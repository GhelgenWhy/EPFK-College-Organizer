import type { StudentInfo } from '../../../services/api/management';

/** Display name for a student: "Ім'я Прізвище", falling back to email, then to a neutral label. */
export function studentDisplayName(student: Pick<StudentInfo, 'firstName' | 'lastName' | 'email'>): string {
  const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ');
  return fullName || student.email || 'Без імені';
}