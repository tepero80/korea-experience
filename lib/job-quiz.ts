// Korea Job Quiz - Score Calculation Logic

import { JOB_RESULTS, QUIZ_QUESTIONS, JobResult } from './job-quiz-data';

// Calculate job scores based on user answers
export function calculateJobResult(answers: number[]): JobResult {
  const scores: { [jobId: string]: number } = {};

  // Initialize all job scores to 0
  JOB_RESULTS.forEach(job => {
    scores[job.id] = 0;
  });

  // Calculate scores based on answers
  answers.forEach((optionIndex, questionIndex) => {
    const question = QUIZ_QUESTIONS[questionIndex];
    const selectedOption = question.options[optionIndex];

    // Add scores from the selected option
    Object.entries(selectedOption.scores).forEach(([jobId, score]) => {
      scores[jobId] += score;
    });
  });

  // Find the job with highest score
  let maxScore = 0;
  let resultJobId = 'corporate-worker'; // default fallback

  Object.entries(scores).forEach(([jobId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultJobId = jobId;
    }
  });

  // Return the job result
  const result = JOB_RESULTS.find(job => job.id === resultJobId);
  if (!result) {
    return JOB_RESULTS[0]; // fallback
  }

  return result;
}

// Get top 3 job matches with scores (for "other good matches")
export function getTopMatches(answers: number[], count: number = 3): { job: JobResult; score: number }[] {
  const scores: { [jobId: string]: number } = {};

  // Initialize scores
  JOB_RESULTS.forEach(job => {
    scores[job.id] = 0;
  });

  // Calculate scores
  answers.forEach((optionIndex, questionIndex) => {
    const question = QUIZ_QUESTIONS[questionIndex];
    const selectedOption = question.options[optionIndex];

    Object.entries(selectedOption.scores).forEach(([jobId, score]) => {
      scores[jobId] += score;
    });
  });

  // Sort jobs by score
  const sortedJobs = JOB_RESULTS.map(job => ({
    job,
    score: scores[job.id]
  })).sort((a, b) => b.score - a.score);

  return sortedJobs.slice(0, count);
}

// Get progress percentage
export function getProgress(currentQuestion: number, totalQuestions: number): number {
  return Math.round((currentQuestion / totalQuestions) * 100);
}

// Get random related jobs (for sharing)
export function getRelatedJobs(currentJobId: string, count: number = 3): JobResult[] {
  const otherJobs = JOB_RESULTS.filter(job => job.id !== currentJobId);
  
  // Shuffle and return random jobs
  const shuffled = [...otherJobs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Format salary for display
export function formatSalary(salary: string): string {
  return salary;
}

// Generate share text for social media
export function generateShareText(job: JobResult): string {
  return job.viralMessage;
}
