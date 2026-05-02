export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold">ADHD-Prep</h1>
        <p className="text-xl text-gray-600">
          Prepare yourself for ADHD diagnostic evaluation
        </p>
        <p className="text-gray-600">
          Complete a structured interview to help clinicians assess your symptoms accurately.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. Complete ASRS screening (10 min)</li>
            <li>2. Detailed interview (40 min)</li>
            <li>3. Family context (optional)</li>
            <li>4. Get your report (instant)</li>
            <li>5. Share with clinician</li>
          </ol>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">What you get</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Structured interview transcript</li>
            <li>✓ Symptom severity scores</li>
            <li>✓ Clinician-ready PDF report</li>
            <li>✓ Risk assessment</li>
            <li>✓ Actionable recommendations</li>
          </ul>
        </div>
      </section>

      <section className="text-center space-y-4">
        <a
          href="/assessment/asrs"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Assessment ($49)
        </a>
        <p className="text-sm text-gray-600">
          Takes approximately 60 minutes. You can pause and resume anytime.
        </p>
      </section>

      <section className="border-t pt-8 text-center text-sm text-gray-600">
        <p>
          ADHD-Prep is a preparation tool only. It does not provide diagnosis.{' '}
          <br />
          Always consult a licensed healthcare provider for diagnosis and treatment.
        </p>
      </section>
    </div>
  );
}
