import type { LessonItem } from '../types';

interface LessonCardProps {
  lesson: LessonItem;
}

export const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <div className="lesson-card">

      {/* Назва предмета та викладач */}
      <p className="lesson-title">{lesson.disciplineName}</p>
      <p className="lesson-teacher">{lesson.teacherName}</p>

      {/* Посилання на онлайн-заняття або аудиторія */}
      {lesson.meetingUrl ? (
        <a
          href={lesson.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="lesson-link"
        >
          Google meet
        </a>
      ) : (
        <span className="lesson-room">{lesson.room || 'Онлайн'}</span>
      )}
    </div>
  );
};