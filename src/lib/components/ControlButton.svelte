<script lang="ts">
	interface Props {
		onclick?: () => void;
		disabled?: boolean;
		title?: string;
		children?: any;
	}

	let {
		onclick,
		disabled = false,
		title,
		children
	}: Props = $props();
</script>

<button
	class="control-btn"
	{onclick}
	{disabled}
	{title}
	type="button"
>
	{@render children?.()}
</button>

<style>
	.control-btn {
		width: 4.5rem;
		height: 4.5rem;
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

	@media (max-width: 768px) {
		.control-btn {
			width: 4rem;
			height: 4rem;
		}

		.control-btn :global(svg) {
			width: 22px;
			height: 22px;
		}
	}
</style>