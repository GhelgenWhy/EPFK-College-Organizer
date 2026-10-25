import type { Discipline } from "../../features/disciplines/types";
import type { Assignment } from "../../features/tasks/types";
import {
  requestJson,
  type ApiRequestOptions,
  ApiError,
  fetchWithClerkAuth,
} from "./client";
import {
  array,
  boolean,
  dateString,
  nullable,
  number,
  object,
  optional,
  string,
  validated,
} from "./validation";

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
  /** Completion status from Moodle (kept in sync by the backend). */
  isCompleted?: boolean;
}
const course = object({
  id: number,
  name: string,
  teacherName: nullable(string),
  moodleUrl: string,
});
const assignment = object({
  id: number,
  title: string,
  course: string,
  description: string,
  dueDate: nullable(dateString),
  dueTime: nullable(string),
  source: string,
  addedAt: nullable(dateString),
  moodleUrl: string,
  isCompleted: optional(boolean),
});
const kyivDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Kyiv",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const kyivTime = new Intl.DateTimeFormat("uk-UA", {
  timeZone: "Europe/Kyiv",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function plainText(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  document
    .querySelectorAll("script, style")
    .forEach((element) => element.remove());
  return document.body.textContent?.trim() ?? "";
}

export const moodleApi = {
  getCourses: (options: ApiRequestOptions) =>
    requestJson("/api/courses", options, (value): Discipline[] =>
      validated<MoodleCourse[]>(value, array(course), "Moodle courses").map(
        (item) => ({
          ...item,
          id: String(item.id),
          teacherName: item.teacherName ?? "Викладача не вказано",
        }),
      ),
    ),
  getCourseAssignments: (courseId: string, options: ApiRequestOptions) =>
    requestJson(
      `/api/assignments/${encodeURIComponent(courseId)}`,
      options,
      (value): Assignment[] =>
        validated<MoodleAssignment[]>(
          value,
          array(assignment),
          "Moodle assignments",
        ).map((item) => ({
          ...item,
          id: String(item.id),
          isCompleted: item.isCompleted ?? false,
          description: plainText(item.description),
          dueDate: item.dueDate
            ? kyivDate.format(new Date(item.dueDate))
            : null,
          dueTime: item.dueDate
            ? kyivTime.format(new Date(item.dueDate))
            : undefined,
          addedAt: item.addedAt
            ? new Intl.DateTimeFormat("uk-UA", {
                timeZone: "Europe/Kyiv",
              }).format(new Date(item.addedAt))
            : "дату не вказано",
        })),
    ),
  async postCredentials(
    credentials: { username: string; password: string },
    { getToken, signal }: ApiRequestOptions,
  ): Promise<void> {
    const response = await fetchWithClerkAuth(getToken, "/api/syncronise", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Не удалось подключить Moodle");
    }
  },
  async getAssignments(options: ApiRequestOptions): Promise<Assignment[]> {
    const courses = await moodleApi.getCourses(options);
    options.signal.throwIfAborted();

    const allBatches = await Promise.all(
      courses.map((course) => moodleApi.getCourseAssignments(course.id, options))
    );

    // const assignments: Assignment[] = [];
    // for (const course of courses) {
    //   const courseAssignments = await moodleApi.getCourseAssignments(course.id, options);
    //   for (const assignment of courseAssignments) {
    //     assignments.push(assignment);
    //   } 
    //
    // }

    const assignments = allBatches.flat();
    return [...new Map(assignments.map((item) => [item.id, item])).values()];
  }
};
