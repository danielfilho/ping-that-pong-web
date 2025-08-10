<script lang="ts">
	import { Undo2, TriangleAlert, Settings } from 'lucide-svelte';
	import ControlButton from './ControlButton.svelte';
	import { gameState, gameActions, canUndo } from '../stores/gameStore.js';

	interface Props {
		onShowReset: () => void;
		onShowSettings: () => void;
	}

	let { onShowReset, onShowSettings }: Props = $props();
</script>

<div class="control-panel">
	<ControlButton
		onclick={gameActions.undoLastPoint}
		disabled={!$canUndo}
		title="Undo last point"
	>
		<Undo2 size={24} />
	</ControlButton>

	<ControlButton onclick={onShowReset} title="Reset game">
		<TriangleAlert size={24} />
	</ControlButton>

	<ControlButton onclick={onShowSettings} title="Settings">
		<Settings size={24} />
	</ControlButton>
</div>

<style>
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

	@media (max-width: 768px) {
		.control-panel {
			top: 1rem;
		}
	}
</style>