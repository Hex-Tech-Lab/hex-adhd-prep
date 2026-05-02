// In-memory store for testing
const users = new Map<string, { id: string; email: string; password_hash: string; age: number }>();
const assessments = new Map<string, { id: string; user_id: string; tier: string; status: string; current_section?: string }>();

let userIdCounter = 1;
let assessmentIdCounter = 1;

export function resetMock() {
  users.clear();
  assessments.clear();
  userIdCounter = 1;
  assessmentIdCounter = 1;
}

export async function getUserByEmail(email: string) {
  const emailLower = email.toLowerCase();
  for (const user of users.values()) {
    if (user.email === emailLower) {
      return user;
    }
  }
  return null;
}

export async function createUser(email: string, passwordHash: string, age: number) {
  const id = `user-${userIdCounter++}`;
  const user = {
    id,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    age,
  };
  users.set(id, user);
  return { id: user.id, email: user.email, age: user.age };
}

export async function createAssessment(userId: string, tier: '49' | '199') {
  const id = `assessment-${assessmentIdCounter++}`;
  const assessment = {
    id,
    user_id: userId,
    tier,
    status: 'in_progress',
    current_section: 'asrs',
  };
  assessments.set(id, assessment);
  return { id: assessment.id, user_id: assessment.user_id, tier: assessment.tier, status: assessment.status };
}

export async function getAssessment(assessmentId: string, userId: string) {
  const assessment = assessments.get(assessmentId);
  if (!assessment || assessment.user_id !== userId) {
    return null;
  }
  return assessment;
}

export async function updateAssessment(assessmentId: string, updates: Record<string, any>) {
  const assessment = assessments.get(assessmentId);
  if (!assessment) {
    throw new Error(`Assessment ${assessmentId} not found`);
  }
  const updated = { ...assessment, ...updates };
  assessments.set(assessmentId, updated);
  return updated;
}
