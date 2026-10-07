import type { Discipline } from '../../features/disciplines/types';
import type { Assignment } from '../../features/tasks/types';
import { requestJson, type ApiRequestOptions } from './client';
import { array, dateString, nullable, number, object, string, validated } from './validation';

interface MoodleCourse {
  id: number;
  name: string;
  teacherName: string | null;
  moodleUrl: string;
}
interface MoodleAssignment {
  id: number;
  title: string;
  course: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
  source: string;
  addedAt: string | null;
  moodleUrl: string;
}
const course = object({ id: number, name: string, teacherName: nullable(string), moodleUrl: string });
const assignment = object({
  id: number, title: string, course: string, description: string,
  dueDate: nullable(dateString), dueTime: nullable(string), source: string,
  addedAt: nullable(dateString), moodleUrl: string,
});
const kyivDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit',
});
const kyivTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function plainText(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.querySelectorAll('script, style').forEach((element) => element.remove());
  return document.body.textContent?.trim() ?? '';
}

export const moodleApi = {
  getCourses: (options: ApiRequestOptions) => requestJson('/moodle/courses', options, (value): Discipline[] => (
    validated<MoodleCourse[]>(value, array(course), 'Moodle courses').map((item) => ({
      ...item, id: String(item.id), teacherName: item.teacherName ?? 'Викладача не вказано',
    }))
  )),
  getCourseAssignments: (courseId: string, options: ApiRequestOptions) => requestJson(
    `/moodle/assignments/${encodeURIComponent(courseId)}`, options, (value): Assignment[] => (
      validated<MoodleAssignment[]>(value, array(assignment), 'Moodle assignments').map((item) => ({
        ...item,
        id: String(item.id),
        description: plainText(item.description),
        dueDate: item.dueDate ? kyivDate.format(new Date(item.dueDate)) : null,
        dueTime: item.dueDate ? kyivTime.format(new Date(item.dueDate)) : undefined,
        addedAt: item.addedAt ? new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv' }).format(new Date(item.addedAt)) : 'дату не вказано',
      }))
    ),
  ),
  // The backend exposes assignments per course, so collect all enrolled courses.
  // Reject the entire load if a course fails instead of showing an incomplete list.
  async getAssignments(options: ApiRequestOptions): Promise<Assignment[]> {
    const courses = await moodleApi.getCourses(options);
    const assignments: Assignment[] = [];
    // Limit concurrent requests so a large course list doesn't flood Moodle.
    for (let index = 0; index < courses.length; index += 4) {
      options.signal.throwIfAborted();
      const batch = await Promise.all(courses.slice(index, index + 4)
        .map((course) => moodleApi.getCourseAssignments(course.id, options)));
      assignments.push(...batch.flat());
    }
    return [...new Map(assignments.map((item) => [item.id, item])).values()];
  },
};
