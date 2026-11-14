import type { StudentInfo } from '../../../services/api/management';

export function studentDisplayName(student: Pick<StudentInfo, 'firstName' | 'lastName' | 'email'>): string {
  const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ');
  return fullName || student.email || 'Без імені';
}
