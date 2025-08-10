<script lang="ts">
	import type { ModalProps } from '../types.js';

	interface Props extends ModalProps {
		children?: any;
	}

	let {
		isOpen = false,
		title,
		onClose,
		size = 'medium',
		children
	}: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
	>
		<div
			class="modal modal-{size}"
			role="dialog"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="modal-header">
				<h2>{title}</h2>
				<button
					class="close-btn"
					onclick={onClose}
					title="Close"
					type="button"
				>
					×
				</button>
			</div>
			<div class="modal-content">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
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
		padding: 0;
		max-width: 90vw;
		max-height: 90vh;
		overflow: hidden;
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

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 2rem 0;
		position: relative;
		z-index: 1;
	}

	.modal-header h2 {
		margin: 0;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.modal-content {
		padding: 2rem;
		position: relative;
		z-index: 1;
		overflow-y: auto;
		max-height: calc(90vh - 4rem);
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
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.2);
		color: white;
		transform: scale(1.05);
	}

	/* Modal sizes */
	.modal-small {
		width: 300px;
	}

	.modal-medium {
		width: 400px;
	}

	.modal-large {
		width: 600px;
	}

	@media (max-width: 768px) {
		.modal {
			margin: 1rem;
		}

		.modal-small,
		.modal-medium,
		.modal-large {
			width: auto;
		}

		.modal-header {
			padding: 1.5rem 1.5rem 0;
		}

		.modal-content {
			padding: 1.5rem;
		}
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
</style>