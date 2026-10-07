export class MoodleAssignmentDto {
    id: number;
    title: string;
    course: string;
    description: string;
    dueDate: Date | null;
    dueTime: string | null;
    source: string;
    addedAt: Date | null;
    moodleUrl: string
}