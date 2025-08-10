<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import { Undo2, TriangleAlert, Settings } from 'lucide-svelte';

	enum Team {
		TeamA = 'teamA',
		TeamB = 'teamB'
	}

	let teamAScore = $state(0);
	let teamBScore = $state(0);
	let lastPointTo: Team | null = $state(null);
	let isShowingAlert = $state(false);
	let isShowingConfig = $state(false);
	let maxPoints = $state(11);
	let serveSwapEvery = $state(2);
	let serveSwapOvertime = $state(1);
	let isOverTime = $state(false);
	let isTeamAServe = $state(true);
	let moving = $state(-80.0);

	const teamAOffset = -160.0;
	const teamBOffset = 80.0;

	$effect(() => {
		moving = isTeamAServe ? teamAOffset : teamBOffset;
	});

	function checkServeSwap() {
		const totalPoints = teamAScore + teamBScore;
		
		// Don't swap serve until at least serveSwapEvery points have been scored
		if (totalPoints === 0) {
			isTeamAServe = true;
			return;
		}
		
		const serveAmount = isOverTime
			? Math.floor(totalPoints / serveSwapOvertime)
			: Math.floor(totalPoints / serveSwapEvery);

		isTeamAServe = serveAmount % 2 === 0;
	}

	function calculateMaxPoints() {
		if (teamAScore === maxPoints - 1 && teamBScore === maxPoints - 1) {
			isOverTime = true;
			maxPoints += 1;
		}
	}

	function fireConfetti(team: Team) {
		const colors = team === Team.TeamA ? ['#4f46e5', '#6366f1'] : ['#ec4899', '#f472b6'];
		confetti({
			particleCount: 300,
		});
	}

	function addPoint(team: Team) {
		if (team === Team.TeamA) {
			teamAScore += 1;
			if (teamAScore === maxPoints) {
				fireConfetti(Team.TeamA);
			}
		} else if (team === Team.TeamB) {
			teamBScore += 1;
			if (teamBScore === maxPoints) {
				fireConfetti(Team.TeamB);
			}
		}

		lastPointTo = team;
		checkServeSwap();
		calculateMaxPoints();
	}

	function removePoint(team: Team) {
		if (team === Team.TeamA) {
			if (teamAScore === 0) return;
			teamAScore -= 1;
		} else {
			if (teamBScore === 0) return;
			teamBScore -= 1;
		}

		checkServeSwap();
	}

	function undoPoint() {
		if (lastPointTo === Team.TeamA) {
			removePoint(Team.TeamA);
		} else if (lastPointTo === Team.TeamB) {
			removePoint(Team.TeamB);
		}

		checkServeSwap();
		lastPointTo = null;
	}

	function resetGame() {
		isOverTime = false;
		isTeamAServe = true;
		serveSwapEvery = 2;
		serveSwapOvertime = 1;
		maxPoints = 11;
		teamAScore = 0;
		teamBScore = 0;
		moving = -70.0;
		lastPointTo = null;
	}

	function handleTeamATap(event: TouchEvent | MouseEvent) {
		event.preventDefault();
		addPoint(Team.TeamA);
	}

	function handleTeamBTap(event: TouchEvent | MouseEvent) {
		event.preventDefault();
		addPoint(Team.TeamB);
	}

	function handleTeamASwipe(direction: string) {
		if (direction === 'left') {
			removePoint(Team.TeamA);
		} else if (direction === 'right') {
			addPoint(Team.TeamA);
		}
	}

	function handleTeamBSwipe(direction: string) {
		if (direction === 'left') {
			removePoint(Team.TeamB);
		} else if (direction === 'right') {
			addPoint(Team.TeamB);
		}
	}

	let teamAElement: HTMLElement;
	let teamBElement: HTMLElement;

	onMount(() => {
		// Lock screen orientation to portrait
		if (typeof window !== 'undefined' && screen && screen.orientation) {
			try {
				screen.orientation.lock('portrait').catch(() => {
					// Fallback for browsers that don't support orientation lock
					console.log('Orientation lock not supported');
				});
			} catch (error) {
				console.log('Orientation lock not available');
			}
		}
		
		// Set up gesture handling
		if (typeof window !== 'undefined') {
			import('hammerjs').then(({ default: Hammer }) => {
				const hammerA = new Hammer(teamAElement);
				const hammerB = new Hammer(teamBElement);

				hammerA.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
				hammerB.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

				hammerA.on('swipeleft', () => handleTeamASwipe('left'));
				hammerA.on('swiperight', () => handleTeamASwipe('right'));

				hammerB.on('swipeleft', () => handleTeamBSwipe('left'));
				hammerB.on('swiperight', () => handleTeamBSwipe('right'));
			});
		}
	});

	$inspect('Scores:', teamAScore, teamBScore, 'Serve:', isTeamAServe);
</script>

<div class="app">
	<div class="game-area">
		<!-- Team A Score Area -->
		<button
			bind:this={teamAElement}
			class="score-area team-a"
			onclick={handleTeamATap}
			ontouchstart={handleTeamATap}
		>
			<div class="score-display">
				<span class="score-text">{teamAScore}</span>
			</div>
		</button>

		<!-- Team B Score Area -->
		<button
			bind:this={teamBElement}
			class="score-area team-b"
			onclick={handleTeamBTap}
			ontouchstart={handleTeamBTap}
		>
			<div class="score-display">
				<span class="score-text">{teamBScore}</span>
			</div>
		</button>
	</div>

	<!-- Center Line -->
	<div class="center-line"></div>

	<!-- Serve Indicator (Tennis Ball) -->
	<div class="serve-indicator" style="transform: translateY({moving}px) translateX(-50%);">
		🎾
	</div>

	<!-- Control Panel -->
	<div class="control-panel">
		<button
			class="control-btn undo-btn"
			onclick={undoPoint}
			disabled={lastPointTo === null || (teamAScore === 0 && teamBScore === 0)}
			title="Undo last point"
		>
			<Undo2 size={20} />
		</button>

		<button class="control-btn reset-btn" onclick={() => (isShowingAlert = true)} title="Reset game">
			<TriangleAlert size={20} />
		</button>

		<button class="control-btn config-btn" onclick={() => (isShowingConfig = true)} title="Settings">
			<Settings size={20} />
		</button>
	</div>

	<!-- Reset Confirmation Modal -->
	{#if isShowingAlert}
		<div class="modal-overlay" role="button" tabindex="0" onclick={() => (isShowingAlert = false)} onkeydown={(e) => e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' ? (isShowingAlert = false) : null}>
			<div class="modal" role="dialog" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
				<h2>You sure, bruh?</h2>
				<div class="modal-actions">
					<button class="btn btn-secondary" onclick={() => (isShowingAlert = false)}>Cancel</button>
					<button
						class="btn btn-danger"
						onclick={() => {
							resetGame();
							isShowingAlert = false;
						}}
					>
						Reset score
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Configuration Modal -->
	{#if isShowingConfig}
		<div class="modal-overlay" role="button" tabindex="0" onclick={() => (isShowingConfig = false)} onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? (isShowingConfig = false) : null}>
			<div class="modal config-modal" role="dialog" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h2>Configuration</h2>
					<button class="close-btn" onclick={() => (isShowingConfig = false)}>×</button>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label for="max-points">Maximum points: {maxPoints}</label>
						<input
							id="max-points"
							type="range"
							min="1"
							max="21"
							bind:value={maxPoints}
							class="range-input"
						/>
					</div>
					<div class="form-group">
						<label for="serve-swap">Serve swap: {serveSwapEvery}</label>
						<input
							id="serve-swap"
							type="range"
							min="1"
							max="5"
							bind:value={serveSwapEvery}
							class="range-input"
						/>
					</div>
					<div class="form-group">
						<label for="overtime-swap">Overtime serve swap: {serveSwapOvertime}</label>
						<input
							id="overtime-swap"
							type="range"
							min="1"
							max="3"
							bind:value={serveSwapOvertime}
							class="range-input"
						/>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" onclick={() => (isShowingConfig = false)}>Done</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.app {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
	}

	.game-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.score-area {
		flex: 1;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
		position: relative;
		touch-action: manipulation;
	}

	.score-area:active {
		opacity: 0.8;
	}

	.team-a {
		background: linear-gradient(135deg, #4f46e5, #6366f1);
		color: white;
	}

	.team-b {
		background: linear-gradient(135deg, #ec4899, #f472b6);
		color: white;
	}

	.score-display {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.score-text {
		font-size: clamp(6rem, 20vw, 12rem);
		font-weight: 900;
		font-family: system-ui, -apple-system, sans-serif;
		text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.center-line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 10px;
		background: white;
		transform: translateY(-50%);
		border-radius: 5px;
		margin: 0 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 10;
	}

	.serve-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		font-size: 3rem;
		z-index: 20;
		transition: transform 0.3s ease;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	.control-panel {
		position: absolute;
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 0.75rem;
		border-radius: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		z-index: 30;
	}

	.control-btn {
		width: 3rem;
		height: 3rem;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}

	.control-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}

	.modal {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		max-width: 90vw;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.config-modal {
		width: 400px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.modal-header h2 {
		margin: 0;
		color: #333;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #666;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-body {
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	.range-input {
		width: 100%;
		height: 0.5rem;
		border-radius: 0.25rem;
		background: #ddd;
		outline: none;
		-webkit-appearance: none;
	}

	.range-input::-webkit-slider-thumb {
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: #4f46e5;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.range-input::-moz-range-thumb {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: #4f46e5;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.modal-actions,
	.modal-footer {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: #4f46e5;
		color: white;
	}

	.btn-primary:hover {
		background: #4338ca;
	}

	.btn-secondary {
		background: #6b7280;
		color: white;
	}

	.btn-secondary:hover {
		background: #4b5563;
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.control-panel {
			top: 1rem;
		}

		.control-btn {
			width: 2.5rem;
			height: 2.5rem;
			font-size: 1rem;
		}

		.modal {
			margin: 1rem;
			padding: 1.5rem;
		}

		.config-modal {
			width: auto;
		}
	}

	/* CSS orientation handling - JavaScript will handle the actual orientation lock */
	
	/* Only rotate scores on mobile devices in landscape */
	@media (orientation: landscape) and (hover: none) and (pointer: coarse) {
		.score-text {
			transform: rotate(90deg);
			transition: transform 0.3s ease;
		}
		
		.control-panel {
			top: 0.5rem;
		}

		.serve-indicator {
			font-size: 2rem;
		}
	}
	
	/* Ensure scores are normal on desktop and mobile portrait */
	@media (orientation: portrait), (hover: hover) and (pointer: fine) {
		.score-text {
			transform: rotate(0deg);
			transition: transform 0.3s ease;
		}
	}
</style>