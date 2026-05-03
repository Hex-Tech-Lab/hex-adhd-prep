// Enhanced system prompts for Claude-powered ADHD assessment interview
// Optimized for LLM consumption with clear structure, precise instructions, and structured outputs

export const INTERVIEW_SYSTEM_PROMPTS = {
  // Primary interview question generation
  interviewer: `ROLE: Empathic ADHD assessment interviewer
GOAL: Generate one clinically-relevant interview question per request
DOMAIN: ADHD symptoms, impacts, and experiences

INSTRUCTIONS:
- Generate exactly one question per response
- Maximum 120 characters
- Use conversational, supportive language
- Encourage specific examples over generalizations
- Avoid medical jargon
- Focus on personal experiences and current impacts
- Adapt based on conversation context

CONTEXT DOMAINS:
1. Attention/focus difficulties
2. Hyperactivity/restlessness
3. Impulsivity/decision-making
4. Executive function challenges
5. Emotional regulation patterns

OUTPUT: Single question string only`,

  // Follow-up question detection and generation
  followUpDetector: `ROLE: ADHD interview response analyzer
GOAL: Determine if response needs clarification and suggest targeted follow-up

ANALYSIS CRITERIA:
- Length < 20 words = needs follow-up
- Lacks specific examples = needs follow-up
- Contradicts previous information = needs follow-up
- Indicates significant impact without details = needs follow-up
- Vague or incomplete descriptions = needs follow-up

FOLLOW-UP RULES:
- Maximum 80 characters
- Specific and targeted to missing information
- Empathic and non-judgmental tone
- Focus on concrete details or examples

OUTPUT FORMAT:
{
  "needsFollowUp": boolean,
  "followUpQuestion": "string or null"
}`,

  // AI-generated question validation
  validator: `ROLE: ADHD interview question quality validator
GOAL: Ensure questions are clinically appropriate and patient-friendly

VALIDATION CHECKS:
- Clinically relevant to ADHD symptoms ✓
- Conversational language (no medical jargon) ✓
- Empathic and non-judgmental tone ✓
- Encourages personal examples ✓
- Under 120 characters ✓
- Open-ended format ✓

INVALID PATTERNS:
- Yes/no questions ✗
- Technical medical terminology ✗
- Broad or vague wording ✗
- Judgmental language ✗
- Over 120 characters ✗

OUTPUT FORMAT:
{
  "isValid": boolean,
  "issues": ["specific_issue_1", "specific_issue_2"]
}`,

  // Memory scaffolding for recall difficulties
  memoryScaffolding: `ROLE: Memory scaffolding assistant for ADHD assessment
GOAL: Help patients recall childhood experiences when they say "I don't remember"

SCAFFOLDING PRINCIPLES:
- Suggest 2-3 specific memory prompts
- Use developmental milestones as anchors (ages 5-18)
- Include concrete situations, people, places
- Incorporate sensory details and emotions
- Never suggest symptoms - remain neutral
- Keep prompts conversational and supportive

ANCHOR POINTS:
- School experiences and report cards
- Family relationships and dynamics
- Hobbies, sports, and activities
- Major life events or transitions
- Daily routines and responsibilities

OUTPUT FORMAT:
{
  "scaffolds": [
    "Think about elementary school - what subjects did you enjoy most?",
    "Consider family vacations or trips - what stood out to you?"
  ]
}`,

  // Symptom pattern analysis for clinical insights
  patternAnalyzer: `ROLE: ADHD symptom pattern analyst
GOAL: Identify consistent patterns across life domains and developmental stages

ANALYSIS DIMENSIONS:
- Cross-situational consistency (home vs work/school)
- Developmental trajectory (onset, progression, current)
- Compensatory strategies developed
- Impact severity and functional impairment
- Co-occurring patterns suggested
- Resilience factors observed

CONFIDENCE SCORING:
- 0.8-1.0: Strong evidence across multiple domains
- 0.6-0.8: Moderate evidence with some consistency
- 0.4-0.6: Emerging patterns, limited evidence
- 0.0-0.4: Insufficient data for reliable patterns

OUTPUT FORMAT:
{
  "patterns": ["consistent_attention_difficulties", "hyperfocus_capability"],
  "severity": "mild|moderate|severe",
  "confidence": 0.85
}`,

  // Emotional impact assessment
  emotionalAssessor: `ROLE: Emotional impact evaluator for ADHD experiences
GOAL: Assess psychological burden and coping mechanisms

EVALUATION AREAS:
- Frustration and shame experiences
- Self-esteem impacts
- Relationship strain indicators
- Achievement vs potential gaps
- Coping strategy effectiveness
- Support system utilization
- Emotional regulation patterns

BURDEN LEVELS:
- Low: Minimal emotional impact, effective coping
- Moderate: Noticeable frustration, developing coping skills
- High: Significant shame/guilt, limited coping effectiveness

OUTPUT FORMAT:
{
  "emotionalBurden": "low|moderate|high",
  "copingStrategies": ["mindfulness_practice", "support_groups"],
  "supportNeeds": ["therapy_referral", "peer_support"]
}`,

  // Executive function evaluation
  executiveFunctionEvaluator: `ROLE: Executive function impairment assessor
GOAL: Evaluate cognitive control and self-regulation capacities

ASSESSMENT DOMAINS:
- Task initiation and completion
- Sustained attention capacity
- Working memory limitations
- Organization and planning skills
- Time management effectiveness
- Goal-directed persistence
- Cognitive flexibility
- Response inhibition

COMPENSATORY SKILLS:
- External reminders and alarms
- Breaking tasks into smaller steps
- Environmental modifications
- Technology-assisted organization
- Accountability partnerships

OUTPUT FORMAT:
{
  "executiveDeficits": ["task_initiation", "time_management"],
  "compensatorySkills": ["digital_reminders", "task_chunking"],
  "recommendations": ["cognitive_training", "organizational_coaching"]
}`
};

// Enhanced fallback question banks organized by ADHD symptom domains
// Questions designed for clinical relevance and patient engagement

export const FALLBACK_QUESTIONS = {
  attention: [
    'Can you describe a recent time when you struggled to stay focused on something important?',
    'How does difficulty concentrating show up in your daily work or school activities?',
    'What happens when you try to read a book or work on a detailed project?',
    'How does forgetting things affect your relationships or responsibilities?',
    'Tell me about a task that requires sustained mental effort - how does that go for you?',
    'How do you know when your attention is starting to drift during conversations?',
    'What strategies help you when you need to focus for longer periods?',
    'How does mental fatigue affect your ability to concentrate?',
    'Can you give an example of when your mind wandered during something important?',
    'How do distractions in your environment impact your focus?',
    'What does it feel like when you\'re trying hard to pay attention but can\'t?',
    'How do you handle meetings or classes that require focused listening?',
    'Tell me about times when you\'ve missed important details because of distraction.',
    'How does switching between different tasks affect your concentration?',
    'What helps you get back on track when your mind has wandered?'
  ],

  hyperactivity: [
    'How do you handle feeling restless during quiet or sedentary activities?',
    'Can you describe what physical restlessness feels like for you?',
    'What situations make you feel like you need to move around constantly?',
    'How do you manage during meetings or situations where you need to sit still?',
    'Tell me about your experience with feeling "on the go" throughout the day.',
    'How does restlessness affect your ability to relax or unwind?',
    'What does it feel like when you have excess physical energy?',
    'How do you handle activities that require patience and stillness?',
    'Can you describe times when your body feels like it needs to keep moving?',
    'How does physical restlessness impact your sleep or relaxation time?',
    'What helps you when you feel the urge to fidget or move around?',
    'How do you manage in situations like waiting in line or sitting in traffic?',
    'Tell me about activities where you find it hard to stay physically still.',
    'How does your physical energy level affect your daily routines?',
    'What coping strategies work for you when you feel physically restless?'
  ],

  impulsivity: [
    'Tell me about a time when acting quickly led to unexpected consequences.',
    'How do you approach decisions that would benefit from more careful thought?',
    'What situations tend to trigger impulsive actions for you?',
    'How do you handle interrupting others during conversations?',
    'Can you describe your experience with impulsive spending or purchases?',
    'How does impulsivity affect your ability to think before speaking?',
    'What does it feel like when you act on impulse and regret it later?',
    'How do you manage when you want to make quick decisions?',
    'Tell me about times when blurting out thoughts caused difficulties.',
    'How does impulsivity show up in your daily decision-making?',
    'What helps you pause before acting on immediate urges?',
    'How do you handle when you want to say something immediately?',
    'Can you give examples of when waiting would have been better than acting fast?',
    'How does impulsivity affect your relationships or social interactions?',
    'What strategies help you think before you act?'
  ],

  executiveFunction: [
    'How do you organize and prioritize when you have multiple tasks to handle?',
    'Tell me about your experience starting and completing long-term projects.',
    'How do you manage time and meet deadlines in your daily life?',
    'What challenges do you face with planning and sequencing activities?',
    'How do you handle transitions between different tasks or activities?',
    'Can you describe how you approach getting started on difficult tasks?',
    'How do you keep track of appointments, deadlines, or important dates?',
    'What does it feel like when you\'re trying to organize complex information?',
    'How do you manage when unexpected changes disrupt your plans?',
    'Tell me about times when following through on plans was challenging.',
    'How do you break down large projects into manageable steps?',
    'What helps you stay on track with multi-step processes?',
    'How does planning ahead work for you in daily routines?',
    'Can you describe your experience with time management challenges?',
    'How do you handle when you need to shift from one activity to another?'
  ],

  emotionalRegulation: [
    'How do you manage frustration when things don\'t go as you planned?',
    'Tell me about your emotional reactions to criticism or setbacks.',
    'How do you handle mood swings or irritability throughout the day?',
    'What helps you calm down when you feel emotionally overwhelmed?',
    'How do emotions affect your ability to focus or make decisions?',
    'Can you describe times when emotions felt particularly intense or hard to manage?',
    'How do you respond when you feel disappointed or let down?',
    'What strategies help you regulate strong emotions?',
    'How does emotional intensity impact your relationships?',
    'Tell me about your experience with feeling emotionally dysregulated.',
    'How do you manage when you feel anxious or stressed?',
    'What helps you return to emotional balance after upsetting events?',
    'How do emotions influence your behavior in different situations?',
    'Can you describe how you cope with feelings of overwhelm?',
    'What supports help you maintain emotional stability?'
  ]
};

// Enhanced memory scaffolding prompts for childhood recall
// Triggered when patients express difficulty remembering ADHD-related experiences

export const MEMORY_SCAFFOLDS = {
  earlyChildhood: [
    'Think about preschool or kindergarten - what activities did you enjoy most?',
    'Consider age 4-6: What games or toys held your attention for long periods?',
    'Recall early school experiences - how did you feel about learning new things?',
    'Think about family routines - were there daily activities you found challenging?',
    'Consider age 5-7: What did adults say about your behavior or attention?',
    'Remember playtime with other children - how did you interact during group activities?',
    'Think about bedtime routines - how easy or difficult was winding down?',
    'Consider age 3-5: What activities made you feel particularly excited or engaged?',
    'Recall family gatherings - how did you behave during longer social events?',
    'Think about learning to read or write - what was that experience like for you?'
  ],

  schoolAge: [
    'Consider elementary school (grades 1-5) - which subjects interested you most?',
    'Think about classroom behavior - how did teachers describe your focus?',
    'Recall homework time - how did you approach assignments and studying?',
    'Consider recess and breaks - how did you handle free time with other kids?',
    'Think about age 8-10: What extracurricular activities did you try?',
    'Recall parent-teacher meetings - what feedback did you receive?',
    'Consider age 7-9: How did you feel about following classroom rules?',
    'Think about reading or learning activities - what challenged you most?',
    'Recall birthday parties or playdates - how did you engage with friends?',
    'Consider age 10-12: What hobbies or interests captured your attention?'
  ],

  adolescence: [
    'Think about middle school (ages 11-14) - how did academic demands feel?',
    'Recall teenage years - what subjects or activities energized you?',
    'Consider age 13-15: How did you manage multiple classes and assignments?',
    'Think about friendships - how did you maintain relationships during this time?',
    'Recall after-school activities or jobs - what was your experience like?',
    'Consider age 15-17: How did you manage time between school and other commitments?',
    'Think about driving or transportation independence - how did that go?',
    'Recall high school projects - how did you approach long-term assignments?',
    'Consider social activities - how did you navigate group dynamics?',
    'Think about age 16-18: What future plans or goals motivated you?'
  ],

  generalRecall: [
    'Consider a specific birthday or holiday memory from childhood.',
    'Think about family vacations or trips - what stood out?',
    'Recall a time you received praise or recognition for something.',
    'Consider moments when you felt different from other kids.',
    'Think about activities you loved so much you lost track of time.',
    'Recall situations where you felt frustrated or stuck.',
    'Consider times when adults helped you with challenging tasks.',
    'Think about hobbies or interests that absorbed your attention.',
    'Recall experiences with rules or expectations you found difficult.',
    'Consider moments of success or accomplishment you remember fondly.'
  ],

  contextualAnchors: [
    'Think about your favorite toys or games as a child - why did you like them?',
    'Consider family mealtimes - how did you participate in conversations?',
    'Recall bedtime stories or reading time - what was that like?',
    'Think about helping with household chores - how did that go?',
    'Consider doctor visits or medical appointments from childhood.',
    'Recall shopping trips or outings with family members.',
    'Think about religious or cultural activities you participated in.',
    'Consider sports teams or physical activities you tried.',
    'Recall music lessons or creative activities like art or dance.',
    'Think about pets or animals you had as a child.'
  ]
};

export function getFallbackQuestionsForDomain(domain: string): string[] {
  return FALLBACK_QUESTIONS[domain as keyof typeof FALLBACK_QUESTIONS] || FALLBACK_QUESTIONS.attention;
}

export function getMemoryScaffoldsForAgeGroup(ageGroup: 'early' | 'school' | 'adolescent' | 'general'): string[] {
  switch (ageGroup) {
    case 'early':
      return MEMORY_SCAFFOLDS.earlyChildhood;
    case 'school':
      return MEMORY_SCAFFOLDS.schoolAge;
    case 'adolescent':
      return MEMORY_SCAFFOLDS.adolescence;
    case 'general':
    default:
      return MEMORY_SCAFFOLDS.generalRecall;
  }
}