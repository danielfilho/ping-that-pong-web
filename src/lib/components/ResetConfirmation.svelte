<script lang="ts">
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { gameActions } from '../stores/gameStore.js';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	function handleReset() {
		gameActions.resetGame();
		onClose();
	}
</script>

<Modal {isOpen} title="You sure, bruh?" {onClose} size="small">
	<div class="modal-actions">
		<Button variant="secondary" onclick={onClose}>
			Cancel
		</Button>
		<Button variant="danger" onclick={handleReset}>
			Reset score
		</Button>
	</div>
</Modal>

<style>
	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}
</style>