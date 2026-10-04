import type { LessonItem } from '../types';

interface LessonCardProps {
  lesson: LessonItem;
}

export const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <div className="flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-sm bg-bg-card px-[15px] py-5">

      {/* Назва предмета та викладач */}
      <p className="line-clamp-2 w-full text-base font-bold leading-[1.25] text-primary">{lesson.disciplineName}</p>
      <p className="text-sm font-semibold text-secondary">{lesson.teacherName}</p>

      {/* Посилання на онлайн-заняття або аудиторія */}
      {lesson.meetingUrl ? (
        <a
          href={lesson.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-link no-underline hover:underline"
        >
          Google meet
        </a>
      ) : (
        <span className="text-xs font-bold text-link">{lesson.room || 'Онлайн'}</span>
      )}
    </div>
  );
};
