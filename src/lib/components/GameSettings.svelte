<script lang="ts">
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { gameState, gameActions } from '../stores/gameStore.js';
	import type { GameSettings } from '../types.js';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let localSettings: GameSettings = $state({
		maxPoints: $gameState.maxPoints,
		serveSwapEvery: $gameState.serveSwapEvery,
		serveSwapOvertime: $gameState.serveSwapOvertime
	});

	// Update local settings when game state changes
	$effect(() => {
		localSettings = {
			maxPoints: $gameState.maxPoints,
			serveSwapEvery: $gameState.serveSwapEvery,
			serveSwapOvertime: $gameState.serveSwapOvertime
		};
	});

	function handleSave() {
		gameActions.updateSettings(localSettings);
		onClose();
	}

	function handleClearData() {
		if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
			gameActions.clearData();
			onClose();
		}
	}
</script>

<Modal {isOpen} title="Configuration" {onClose}>
	<div class="form-group">
		<label for="max-points">Maximum points: {localSettings.maxPoints}</label>
		<input
			id="max-points"
			type="range"
			min="1"
			max="21"
			bind:value={localSettings.maxPoints}
			class="range-input"
		/>
	</div>
	
	<div class="form-group">
		<label for="serve-swap">Serve swap: {localSettings.serveSwapEvery}</label>
		<input
			id="serve-swap"
			type="range"
			min="1"
			max="5"
			bind:value={localSettings.serveSwapEvery}
			class="range-input"
		/>
	</div>
	
	<div class="form-group">
		<label for="overtime-swap">Overtime serve swap: {localSettings.serveSwapOvertime}</label>
		<input
			id="overtime-swap"
			type="range"
			min="1"
			max="3"
			bind:value={localSettings.serveSwapOvertime}
			class="range-input"
		/>
	</div>
	
	<div class="modal-footer">
		<Button variant="danger" onclick={handleClearData}>
			Clear Data
		</Button>
		<Button variant="primary" onclick={handleSave}>
			Done
		</Button>
	</div>
</Modal>

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.range-input {
		width: 100%;
		height: 0.5rem;
		border-radius: 0.25rem;
		background: rgba(255, 255, 255, 0.1);
		outline: none;
		appearance: none;
		-webkit-appearance: none;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		border: 1px solid rgba(255, 255, 255, 0.1);
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

	.modal-footer {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		margin-top: 2rem;
	}
</style>