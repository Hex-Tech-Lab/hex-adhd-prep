'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RELATIONSHIPS = ['Parent', 'Sibling', 'Spouse/Partner', 'Close Friend', 'Other'];

export default function FamilyPage() {
  const [familyMemberName, setFamilyMemberName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [observations, setObservations] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!familyMemberName.trim() || !relationship || !observations.trim()) {
      alert('Please answer all questions');
      return;
    }
    setSubmitted(true);

    try {
      const res = await fetch('/api/assessment/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyMemberName, relationship, observations }),
      });
      if (!res.ok) throw new Error('Failed to save family input');
      router.push('/assessment/review');
    } catch (err) {
      alert('Error submitting. Please try again.');
      setSubmitted(false);
    }
  };

  const isComplete = familyMemberName.trim() && relationship && observations.trim();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Family & Friend Perspective</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        People who know you well often notice patterns you might miss. This helps clinicians get a complete picture.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            Who is providing this perspective? (name)
          </p>
          <input
            type="text"
            value={familyMemberName}
            onChange={(e) => setFamilyMemberName(e.target.value)}
            placeholder="e.g., Mom, John, Sarah"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Relationship */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            What is your relationship to them?
          </p>
          <div>
            {RELATIONSHIPS.map((rel) => (
              <label key={rel} style={{ display: 'block', marginBottom: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="relationship"
                  value={rel}
                  checked={relationship === rel}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {rel}
              </label>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            What have you noticed about their attention, focus, or organizational patterns?
          </p>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="e.g., difficulty staying focused, forgetfulness, procrastination, restlessness, interrupts often, disorganized..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              minHeight: '120px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!isComplete || submitted}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: !isComplete || submitted ? 0.5 : 1,
          }}
        >
          {submitted ? 'Saving...' : 'Submit Family Perspective'}
        </button>
      </form>
    </div>
  );
}
