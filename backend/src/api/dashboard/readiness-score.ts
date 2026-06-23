export function calculateReadinessScore(
  currentSkills: string[],
  missingSkills: string[]
) {
  const total =
    currentSkills.length +
    missingSkills.length;

  if (total === 0) {
    return 0;
  }

  return Math.round(
    (currentSkills.length / total) *
    100
  );
}