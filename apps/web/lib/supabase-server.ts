import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or run in demo mode.');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export function getSupabaseClient() {
  return getSupabase();
}

export async function getUserByEmail(email: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error) return null;
  return data;
}

export async function createUser(email: string, passwordHash: string, age: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        age,
      },
    ])
    .select('id, email, age')
    .single();

  if (error) throw error;
  return data;
}

export async function createAssessment(userId: string, tier: '49' | '199') {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assessments')
    .insert([
      {
        user_id: userId,
        tier,
        status: 'in_progress',
        current_section: 'asrs',
      },
    ])
    .select('id, user_id, tier, status')
    .single();

  if (error) throw error;
  return data;
}

export async function getAssessment(assessmentId: string, userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateAssessment(assessmentId: string, updates: Record<string, any>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', assessmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getClinicians(filters?: { city?: string; specialty?: string }) {
  const supabase = getSupabase();
  let query = supabase.from('clinicians').select('*');

  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }

  if (filters?.specialty) {
    query = query.ilike('specialty', `%${filters.specialty}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function insertInterviewResponse(response: {
  assessment_id: string;
  question_id: string;
  response_text: string;
  ai_flagged_vague?: boolean;
  ai_follow_up_question?: string | null;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('interview_responses')
    .insert([response])
    .select()
    .single();

  if (error) throw error;
  return data;
}
