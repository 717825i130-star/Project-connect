/**
 * ProjectConnect Matching & Recommendation Engine
 * Computes realistic match scores and detailed explanations between
 * a student's profile (skills, interests, year) and available project problem statements.
 */

import { ProjectMatchResult, ProjectProblem, StudentProfile } from '../types';

export function calculateProjectMatch(
  problem: ProjectProblem,
  student: StudentProfile
): ProjectMatchResult {
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase().trim());
  const studentInterestsLower = student.interests.map((i) => i.toLowerCase().trim());
  const problemDomainLower = problem.domain.toLowerCase().trim();

  // 1. Skill overlap calculation
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of problem.requiredSkills) {
    const cleanReq = reqSkill.toLowerCase().trim();
    // Direct or fuzzy token match
    const isMatch = studentSkillsLower.some(
      (sSkill) =>
        sSkill === cleanReq ||
        sSkill.includes(cleanReq) ||
        cleanReq.includes(sSkill)
    );

    if (isMatch) {
      matchingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const skillMatchRatio =
    problem.requiredSkills.length > 0
      ? matchingSkills.length / problem.requiredSkills.length
      : 1.0;

  // 2. Domain interest match
  const domainMatches = studentInterestsLower.some(
    (interest) =>
      interest === problemDomainLower ||
      problemDomainLower.includes(interest) ||
      interest.includes(problemDomainLower)
  );

  // 3. Difficulty / academic readiness bonus
  let difficultyFactor = 10;
  if (problem.difficulty === 'Advanced') {
    difficultyFactor = student.year === 'Final Year' || student.year === 'Graduate' ? 10 : 5;
  } else if (problem.difficulty === 'Beginner') {
    difficultyFactor = 10;
  } else {
    difficultyFactor = 8;
  }

  // Weightings: 60% skills + 30% domain interest + 10% readiness
  const rawScore =
    skillMatchRatio * 60 +
    (domainMatches ? 30 : 0) +
    difficultyFactor;

  // Clamped 0-100 round score
  const score = Math.min(100, Math.max(12, Math.round(rawScore)));

  // 4. Generate contextual explanation
  let explanation = '';
  if (matchingSkills.length > 0 && domainMatches) {
    explanation = `Matches ${matchingSkills.length} of ${problem.requiredSkills.length} required skills (${matchingSkills.join(
      ', '
    )}) and aligns directly with your interest in ${problem.domain}.`;
  } else if (matchingSkills.length > 0 && !domainMatches) {
    explanation = `Strong technical fit matching ${matchingSkills.length} of ${problem.requiredSkills.length} skills (${matchingSkills.join(
      ', '
    )}), providing an opportunity to expand into ${problem.domain}.`;
  } else if (matchingSkills.length === 0 && domainMatches) {
    explanation = `Directly matches your interest in ${problem.domain}. Great opportunity to learn required skills (${problem.requiredSkills.slice(0, 3).join(', ')}).`;
  } else {
    explanation = `Exploratory project in ${problem.domain}. Requires skills in ${problem.requiredSkills.slice(0, 3).join(', ')}.`;
  }

  return {
    problem,
    score,
    matchingSkills,
    missingSkills,
    domainMatches,
    explanation,
  };
}

/**
 * Returns problems sorted by match score for a given student
 */
export function getRecommendedProjects(
  problems: ProjectProblem[],
  student: StudentProfile
): ProjectMatchResult[] {
  const availableProblems = problems.filter((p) => p.status === 'Available');
  const matches = availableProblems.map((prob) => calculateProjectMatch(prob, student));
  return matches.sort((a, b) => b.score - a.score);
}
