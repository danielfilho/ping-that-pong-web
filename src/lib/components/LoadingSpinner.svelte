<script lang="ts">
	interface Props {
		size?: 'small' | 'medium' | 'large';
		message?: string;
	}

	let { size = 'medium', message = '' }: Props = $props();
</script>

<div class="loading-container">
	<div class="spinner spinner-{size}"></div>
	{#if message}
		<p class="loading-message">{message}</p>
	{/if}
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 2rem;
	}

	.spinner {
		border-radius: 50%;
		border: 4px solid rgba(255, 255, 255, 0.2);
		border-top: 4px solid rgba(255, 255, 255, 0.9);
		animation: spin 0.8s linear infinite;
	}

	.spinner-small {
		width: 24px;
		height: 24px;
		border-width: 3px;
	}

	.spinner-medium {
		width: 40px;
		height: 40px;
		border-width: 4px;
	}

	.spinner-large {
		width: 56px;
		height: 56px;
		border-width: 5px;
	}

	.loading-message {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		font-weight: 500;
		text-align: center;
		margin: 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>