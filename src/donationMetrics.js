export function calculateCampaignMetrics({ goal, raised, seatValue = 100 }) {
  const safeGoal = Math.max(Number(goal) || 0, 0);
  const safeRaised = Math.max(Number(raised) || 0, 0);
  const safeSeatValue = Math.max(Number(seatValue) || 1, 1);
  const cappedRaised = Math.min(safeRaised, safeGoal);
  const totalSeats = Math.ceil(safeGoal / safeSeatValue);

  return {
    progressPercent: safeGoal === 0 ? 0 : roundToTwo((cappedRaised / safeGoal) * 100),
    remaining: Math.max(safeGoal - safeRaised, 0),
    symbolicSeats: Math.min(Math.floor(safeRaised / safeSeatValue), totalSeats),
    totalSeats,
  };
}

export function resolveMilestones(raised, milestones = []) {
  const safeRaised = Math.max(Number(raised) || 0, 0);

  return milestones.map((milestone) => ({
    ...milestone,
    reached: safeRaised >= Number(milestone.amount),
  }));
}

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}
