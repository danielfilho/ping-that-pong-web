<script lang="ts">
	import type { ButtonProps } from '../types.js';

	interface Props extends ButtonProps {
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'medium',
		disabled = false,
		onclick,
		title,
		class: className = '',
		children
	}: Props = $props();
</script>

<button
	class="btn btn-{variant} btn-{size} {className}"
	{disabled}
	{title}
	onclick={onclick}
	type="button"
>
	{@render children?.()}
</button>

<style>
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
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
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

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	.btn:disabled:hover::before {
		opacity: 0;
	}

	/* Variants */
	.btn-primary {
		background: rgba(79, 70, 229, 0.3);
		color: white;
		border-color: rgba(79, 70, 229, 0.4);
	}

	.btn-primary:hover:not(:disabled) {
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

	.btn-secondary:hover:not(:disabled) {
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

	.btn-danger:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.4);
		border-color: rgba(239, 68, 68, 0.6);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
	}

	/* Sizes */
	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn-medium {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.btn-large {
		padding: 1rem 2rem;
		font-size: 1.125rem;
	}
</style>