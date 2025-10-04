import confetti from 'canvas-confetti';
import { Team } from '../types.js';

export function fireConfetti(team: Team) {
	const colors = team === Team.TeamA ? ['#4f46e5', '#6366f1'] : ['#ec4899', '#f472b6'];

	confetti({
		particleCount: 300,
		spread: 70,
		origin: { y: team === Team.TeamA ? 0.3 : 0.7 },
		colors: colors
	});
}