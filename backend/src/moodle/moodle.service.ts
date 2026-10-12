import { Injectable } from '@nestjs/common';
import { MoodleUserDto } from './dto/moodle-user.dto.js'
import { MoodleCourseDto } from './dto/moodle-course.dto.js'
import { MoodleAssignmentDto } from './dto/moodle-assignment.dto.js'
import axios from 'axios';

interface MoodleCourse {
    id: number;
    fullname: string;
}

interface MoodleAssignment {
    id: number;
    name: string;
    intro: string;
    duedate: number;
    timemodified: number;
}

interface MoodleSubmissionStatus {
    assignmentid: number;
    lastattempt?: {
        submissions?: Array<{
            status: string;
            gradingstatus?: string;
        }>;
    };
}

@Injectable()
export class MoodleService {
    moodleUrl: string
    constructor() {
        this.moodleUrl = 'https://epkmoodle.znu.edu.ua/'
    }

    async getToken(username: string, password: string): Promise<string> {
        const response = await axios.post(
            `${this.moodleUrl}/login/token.php`,
            new URLSearchParams({
                username,
                password,
                service: 'moodle_mobile_app'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.token;
    }

    async getCourseAssignments(
        token: string,
        courseId: number
    ): Promise<MoodleAssignmentDto[]> {
        const response = await axios.post(
            `${this.moodleUrl}/webservice/rest/server.php`,
            new URLSearchParams({
                wstoken: token,
                wsfunction: 'mod_assign_get_assignments',
                moodlewsrestformat: 'json',
                'courseids[0]': String(courseId)
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const course = response.data.courses?.[0];

        if (!course) {
            return [];
        }

        const assignments: MoodleAssignment[] = course.assignments ?? [];

        return assignments.map((assignment): MoodleAssignmentDto => {
            const dueDate = assignment.duedate
                ? new Date(assignment.duedate * 1000)
                : null;

            return {
                id: assignment.id,

                title: assignment.name,

                course: course.fullname,

                description: assignment.intro ?? '',

                dueDate,

                dueTime: dueDate
                    ? dueDate.toLocaleTimeString('uk-UA', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : null,

                source: 'Moodle',

                addedAt: assignment.timemodified
                    ? new Date(assignment.timemodified * 1000)
                    : null,
                
                moodleUrl: 'https://moodle.org'
            };
        });
    }

    async getStudentCourses(token: string): Promise<MoodleCourseDto[]> {
        const response = await axios.post(
            `${this.moodleUrl}/webservice/rest/server.php`,
            new URLSearchParams({
                wstoken: token,
                wsfunction: 'core_course_get_enrolled_courses_by_timeline_classification',
                moodlewsrestformat: 'json',
                classification: 'all',
                limit: '0',
                offset: '0'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const courses: MoodleCourse[] = response.data.courses;

        return courses.map((course): MoodleCourseDto => ({
            id: course.id,
            name: course.fullname,
            teacherName: null,
            moodleUrl: 'https://moodle.org'
        }));
    }

    async getUser(token: string): Promise<MoodleUserDto> {
        const userResponse = await axios.post(
            `${this.moodleUrl}/webservice/rest/server.php`,
            new URLSearchParams({
                wstoken: token,
                wsfunction: 'core_webservice_get_site_info',
                moodlewsrestformat: 'json'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-ww-form-urlencoded'
                }
            }
        );
        const user = userResponse.data;

        const courses = await this.getStudentCourses(token);

        const groupCounts = new Map<string, number>();
        for (const course of courses) {
            try {
                const response = await axios.post(
                    `${this.moodleUrl}/webservice/rest/server.php`,
                    new URLSearchParams({
                        wstoken: token,
                        wsfunction: 'core_group_get_course_user_groups',
                        moodlewsrestformat: 'json',
                        courseid: course.id.toString()
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                const groups = response.data.groups ?? [];

                for (const group of groups) {
                    groupCounts.set(
                        group.name,
                        (groupCounts.get(group.name) ?? 0) + 1,
                    );
                }
            } catch {
                continue;
            }
        }

        let mostFrequentGroup: string | null = null;
        let maxCount = 0;

        for (const [groupName, count] of groupCounts) {
            if (count > maxCount) {
                mostFrequentGroup = groupName;
                maxCount = count;
            }
        }

        return {
            id: user.userid,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            group: mostFrequentGroup
        }
    }
}