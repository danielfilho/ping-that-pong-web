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
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px) saturate(1.8);
		-webkit-backdrop-filter: blur(20px) saturate(1.8);
		padding: 0.5rem;
		border-radius: 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		z-index: 30;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.control-panel:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.15);
		transform: translateX(-50%) translateY(-2px);
		box-shadow: 
			0 12px 40px rgba(0, 0, 0, 0.15),
			0 4px 12px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.control-btn {
		width: 3.5rem;
		height: 3.5rem;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		position: relative;
		overflow: hidden;
	}

	.control-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.control-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.18);
		border-color: rgba(255, 255, 255, 0.15);
		transform: translateY(-1px) scale(1.05);
		box-shadow: 
			0 4px 16px rgba(0, 0, 0, 0.15),
			0 1px 4px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		color: white;
	}

	.control-btn:hover:not(:disabled)::before {
		opacity: 1;
	}

	.control-btn:active:not(:disabled) {
		transform: translateY(0) scale(0.98);
		transition-duration: 0.1s;
	}

	.control-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.4);
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		backdrop-filter: blur(12px) saturate(1.5);
		-webkit-backdrop-filter: blur(12px) saturate(1.5);
		animation: modalOverlayFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.modal {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(30px) saturate(1.8);
		-webkit-backdrop-filter: blur(30px) saturate(1.8);
		border-radius: 1.5rem;
		padding: 2rem;
		max-width: 90vw;
		max-height: 90vh;
		overflow-y: auto;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 
			0 25px 50px rgba(0, 0, 0, 0.25),
			0 8px 24px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		color: white;
		animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.modal::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 1.5rem;
		pointer-events: none;
	}

	@keyframes modalOverlayFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
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
		color: rgba(255, 255, 255, 0.95);
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1;
	}

	.close-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		font-size: 1.5rem;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.8);
		padding: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		transition: all 0.2s ease;
		position: relative;
		z-index: 1;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.2);
		color: white;
		transform: scale(1.05);
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
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1;
	}

	.range-input {
		width: 100%;
		height: 0.5rem;
		border-radius: 0.25rem;
		background: rgba(255, 255, 255, 0.1);
		outline: none;
		-webkit-appearance: none;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 1;
	}

	.range-input::-webkit-slider-thumb {
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.15),
			0 1px 3px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		transition: all 0.2s ease;
	}

	.range-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		background: white;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 2px 6px rgba(0, 0, 0, 0.15);
	}

	.range-input::-moz-range-thumb {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		border: 2px solid rgba(255, 255, 255, 0.2);
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.15),
			0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.modal-actions,
	.modal-footer {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		position: relative;
		overflow: hidden;
		z-index: 1;
	}

	.btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.btn:hover::before {
		opacity: 1;
	}

	.btn-primary {
		background: rgba(79, 70, 229, 0.3);
		color: white;
		border-color: rgba(79, 70, 229, 0.4);
	}

	.btn-primary:hover {
		background: rgba(79, 70, 229, 0.4);
		border-color: rgba(79, 70, 229, 0.6);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3);
	}

	.btn-secondary {
		background: rgba(107, 114, 128, 0.3);
		color: white;
		border-color: rgba(107, 114, 128, 0.4);
	}

	.btn-secondary:hover {
		background: rgba(107, 114, 128, 0.4);
		border-color: rgba(107, 114, 128, 0.6);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
	}

	.btn-danger {
		background: rgba(239, 68, 68, 0.3);
		color: white;
		border-color: rgba(239, 68, 68, 0.4);
	}

	.btn-danger:hover {
		background: rgba(239, 68, 68, 0.4);
		border-color: rgba(239, 68, 68, 0.6);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
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