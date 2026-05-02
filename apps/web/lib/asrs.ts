export function calculateASRSScore(responses) {
  if (!Array.isArray(responses) || responses.length !== 6) {
    throw new Error('6 responses required');
  }

  if (responses.some(r => typeof r !== 'number' || r < 0 || r > 4)) {
    throw new Error('Responses must be numbers 0-4');
  }

  const inattention = (responses[0] + responses[1] + responses[2] + responses[3]) / 4;
  const hyperactivity = (responses[4] + responses[5]) / 2;
  const overall = (inattention + hyperactivity) / 2;

  return {
    inattention: Math.round(inattention * 100) / 100,
    hyperactivity: Math.round(hyperactivity * 100) / 100,
    overall: Math.round(overall * 100) / 100,
  };
}

export function calculateRiskLevel(overallScore) {
  if (overallScore < 1.5) return 'low';
  if (overallScore < 2.5) return 'moderate';
  return 'high';
}

export function validateASRSResponses(responses) {
  if (!Array.isArray(responses)) return false;
  if (responses.length !== 6) return false;
  return responses.every(r => typeof r === 'number' && r >= 0 && r <= 4);
}