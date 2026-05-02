'use client';
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>ADHD-Prep</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Comprehensive ADHD Assessment Platform</p>
        <a href="/assessment/start" style={{ display: 'inline-block', background: 'white', color: '#667eea', padding: '1.2rem 3rem', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none' }}>Start Assessment →</a>
      </div>
    </div>
  );
}
