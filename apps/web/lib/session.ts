export function getAssessmentId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('assessmentId');
  if (!id) {
    id = 'assess_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('assessmentId', id);
  }
  return id;
}

export function clearAssessmentId(): void {
  sessionStorage.removeItem('assessmentId');
}
