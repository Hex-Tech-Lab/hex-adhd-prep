#!/bin/bash
#
# ADHD-PREP COMPLETE MVP BUILD & DEPLOY
# RUN THIS ONCE - IT BUILDS EVERYTHING
#
# Usage: bash BUILD-MVP-NOW.sh
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 ADHD-PREP COMPLETE MVP BUILD${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Navigate to project
cd ~/projects/hex-adhd-prep/apps/web

# Kill any running servers
pkill -9 -f "next dev" 2>/dev/null || true
sleep 2

echo -e "${GREEN}✅ Step 1: Installing dependencies${NC}"
pnpm install 2>&1 | tail -1

echo -e "${GREEN}✅ Step 2: Creating all assessment pages${NC}"

# HOME PAGE
mkdir -p app
cat > app/page.tsx << 'HOMEPAGE'
'use client';
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>ADHD-Prep</h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '3rem', opacity: 0.95 }}>Comprehensive ADHD Assessment Platform</p>
        <p style={{ fontSize: '1rem', marginBottom: '3rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto 3rem' }}>
          Prepare for your clinical evaluation with our evidence-based assessment tool. Answer questions about your symptoms, family history, life impact, and more.
        </p>
        <a href="/assessment/start" style={{ display: 'inline-block', background: 'white', color: '#667eea', padding: '1.2rem 3rem', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          Start Assessment →
        </a>
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <h3 style={{ marginBottom: '1rem' }}>What You'll Complete:</h3>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block' }}>
            <li style={{ marginBottom: '0.7rem' }}>✓ ASRS Questionnaire (6 questions)</li>
            <li style={{ marginBottom: '0.7rem' }}>✓ Family History Assessment</li>
            <li style={{ marginBottom: '0.7rem' }}>✓ Childhood Symptoms Timeline</li>
            <li style={{ marginBottom: '0.7rem' }}>✓ Life Impact Analysis</li>
            <li style={{ marginBottom: '0.7rem' }}>✓ Comorbidity Screening</li>
          </ul>
        </div>
        <p style={{ marginTop: '3rem', fontSize: '0.95rem', opacity: 0.7 }}>
          ⚠️ This assessment tool does NOT provide a diagnosis. Only licensed clinicians can diagnose ADHD.
        </p>
      </div>
    </div>
  );
}
HOMEPAGE

# START PAGE
mkdir -p app/assessment/start
cat > app/assessment/start/page.tsx << 'STARTPAGE'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    const assessmentId = 'assess_' + Math.random().toString(36).substring(7);
    sessionStorage.setItem('assessmentId', assessmentId);
    
    try {
      await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });
    } catch (e) {
      console.error(e);
    }
    
    router.push('/assessment/asrs');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>Begin Your Assessment</h1>
      
      <div style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', border: '2px solid #667eea', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, color: '#667eea' }}>What to Expect</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Duration:</strong> Approximately 10-15 minutes</li>
          <li><strong>Format:</strong> Multiple-choice and open-ended questions</li>
          <li><strong>Purpose:</strong> Gather information for your clinical evaluation</li>
          <li><strong>Privacy:</strong> Your responses are secure and confidential</li>
        </ul>
      </div>

      <div style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', color: '#856404' }}>
        <strong>⚠️ Important Disclaimer:</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This assessment tool is designed for preparation purposes only. It cannot and should not be used for self-diagnosis. Only licensed healthcare professionals can diagnose ADHD. Please consult with your doctor or mental health provider for a comprehensive evaluation.
        </p>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        style={{
          width: '100%',
          padding: '1.2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          marginBottom: '1rem',
          boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
        }}
      >
        {loading ? 'Starting...' : 'Continue to Questions'}
      </button>

      <a href="/" style={{ display: 'block', textAlign: 'center', color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>
        ← Back to Home
      </a>
    </div>
  );
}
STARTPAGE

# HISTORY PAGE
mkdir -p app/assessment/history
cat > app/assessment/history/page.tsx << 'HISTORYPAGE'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [data, setData] = useState({ onset: '', school: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data }),
      });
    } catch (e) {
      console.error(e);
    }
    router.push('/assessment/impact');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Childhood & History</h1>
      <p style={{ color: '#666' }}>Step 2 of 5</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>When did symptoms first appear?</p>
          {['Before age 7', 'Age 7-12', 'Age 12-18', 'After age 18'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="onset" value={opt} checked={data.onset === opt} onChange={(e) => setData(p => ({ ...p, onset: e.target.value }))} style={{ marginRight: '0.75rem' }} />
              {opt}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>School performance was:</p>
          {['Excellent', 'Above average', 'Average', 'Below average', 'Struggled significantly'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="school" value={opt} checked={data.school === opt} onChange={(e) => setData(p => ({ ...p, school: e.target.value }))} style={{ marginRight: '0.75rem' }} />
              {opt}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>As a child, I was often:</p>
          <textarea value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="e.g., restless, daydreaming, disorganized, impulsive..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui', fontSize: '1rem' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
HISTORYPAGE

# IMPACT PAGE
mkdir -p app/assessment/impact
cat > app/assessment/impact/page.tsx << 'IMPACTPAGE'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImpactPage() {
  const [data, setData] = useState({ work: '', social: '', challenge: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data }),
      });
    } catch (e) {
      console.error(e);
    }
    router.push('/assessment/comorbidity');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Life Impact</h1>
      <p style={{ color: '#666' }}>Step 3 of 5</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Work/Career Impact:</p>
          <textarea value={data.work} onChange={(e) => setData(p => ({ ...p, work: e.target.value }))} placeholder="Describe challenges at work, job changes, performance issues..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Relationships & Social Impact:</p>
          <textarea value={data.social} onChange={(e) => setData(p => ({ ...p, social: e.target.value }))} placeholder="Describe impacts on relationships, family, friendships..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Biggest Challenge:</p>
          <textarea value={data.challenge} onChange={(e) => setData(p => ({ ...p, challenge: e.target.value }))} placeholder="e.g., procrastination, disorganization, forgetfulness, impulsivity..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
IMPACTPAGE

# COMORBIDITY PAGE
mkdir -p app/assessment/comorbidity
cat > app/assessment/comorbidity/page.tsx << 'COMORBIDITYPAGE'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComorbidityPage() {
  const [data, setData] = useState({ anxiety: false, depression: false, bipolar: false, ocd: false, sleep: false, notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/comorbidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data }),
      });
    } catch (e) {
      console.error(e);
    }
    router.push('/assessment/review');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Mental Health Screening</h1>
      <p style={{ color: '#666' }}>Step 4 of 5</p>

      <form onSubmit={handleSubmit}>
        {[{ name: 'anxiety', label: 'Anxiety or panic attacks' }, { name: 'depression', label: 'Depression or persistent sadness' }, { name: 'bipolar', label: 'Mood swings (bipolar spectrum)' }, { name: 'ocd', label: 'Obsessive thoughts or compulsions' }, { name: 'sleep', label: 'Sleep problems' }].map(cond => (
          <label key={cond.name} style={{ display: 'block', padding: '0.75rem', marginBottom: '0.75rem', background: '#f9f9f9', borderRadius: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={data[cond.name]} onChange={(e) => setData(p => ({ ...p, [cond.name]: e.target.checked }))} style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }} />
            {cond.label}
          </label>
        ))}

        <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Additional notes:</p>
          <textarea value={data.notes} onChange={(e) => setData(p => ({ ...p, notes: e.target.value }))} placeholder="Any other mental health concerns..." style={{ width: '100%', padding: '0.75rem', minHeight: '80px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Review Assessment'}
        </button>
      </form>
    </div>
  );
}
COMORBIDITYPAGE

echo -e "${GREEN}✅ Step 3: Building application${NC}"
rm -rf .next
pnpm build 2>&1 | grep -E "compiled|ready|error" | head -3

echo -e "${GREEN}✅ Step 4: Starting dev server${NC}"
pnpm dev &
DEV_PID=$!

echo ""
sleep 5

# Check if running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ MVP LIVE & READY${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "🌍 ${BLUE}http://localhost:3000${NC} (Home)"
  echo -e "📋 ${BLUE}http://localhost:3000/assessment/start${NC} (Begin)"
  echo -e "✅ ${BLUE}http://localhost:3000/assessment/asrs${NC} (Questionnaire)"
  echo -e "👨‍👩‍👧 ${BLUE}http://localhost:3000/assessment/family${NC} (Family)"
  echo -e "🎓 ${BLUE}http://localhost:3000/assessment/history${NC} (History)"
  echo -e "💼 ${BLUE}http://localhost:3000/assessment/impact${NC} (Impact)"
  echo -e "🧠 ${BLUE}http://localhost:3000/assessment/comorbidity${NC} (Comorbidity)"
  echo -e "📊 ${BLUE}http://localhost:3000/assessment/review${NC} (Review)"
  echo -e "📈 ${BLUE}http://localhost:3000/assessment/results${NC} (Results)"
  echo ""
  echo -e "${GREEN}Server PID: $DEV_PID${NC}"
  echo -e "${GREEN}Press Ctrl+C to stop${NC}"
  echo ""
else
  echo "Server failed to start. Check logs:"
  tail -20 /tmp/next.log 2>/dev/null || echo "No logs found"
fi

# Keep running
wait
