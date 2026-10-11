import type { LessonItem } from '../types';

interface LessonCardProps {
  lesson: LessonItem;
}

export const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-between gap-0.5 overflow-hidden rounded-sm bg-bg-card p-[clamp(4px,0.65vw,10px)]">

      {/* Назва предмета та викладач */}
      <p className="line-clamp-2 w-full shrink-0 text-[clamp(9px,0.85vw,14px)] font-bold leading-tight text-primary" title={lesson.disciplineName}>{lesson.disciplineName}</p>
      <p className="w-full truncate text-[clamp(8px,0.75vw,12px)] font-semibold leading-tight text-secondary" title={lesson.teacherName}>{lesson.teacherName}</p>

      {/* Посилання на онлайн-заняття або аудиторія */}
      {lesson.meetingUrl ? (
        <a
          href={lesson.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[clamp(8px,0.75vw,12px)] font-bold leading-tight text-link no-underline hover:underline"
        >
          Google meet
        </a>
      ) : (
        <span className="w-full shrink-0 truncate text-[clamp(8px,0.75vw,12px)] font-bold leading-tight text-link" title={lesson.room || 'Онлайн'}>{lesson.room || 'Онлайн'}</span>
      )}
    </div>
  );
};
