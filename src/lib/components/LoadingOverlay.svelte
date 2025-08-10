<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		message?: string;
	}

	let { message = 'Loading game...' }: Props = $props();
</script>

<div class="loading-overlay">
	<div class="loading-content">
		<LoadingSpinner size="large" {message} />
	</div>
</div>

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #4f46e5, #6366f1, #ec4899, #f472b6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease-out;
	}

	.loading-content {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(30px) saturate(1.8);
		-webkit-backdrop-filter: blur(30px) saturate(1.8);
		border-radius: 2rem;
		padding: 3rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 
			0 25px 50px rgba(0, 0, 0, 0.25),
			0 8px 24px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.loading-content::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 2rem;
		pointer-events: none;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
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