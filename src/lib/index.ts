// Export components
export { default as Button } from './components/Button.svelte';
export { default as Modal } from './components/Modal.svelte';
export { default as ControlButton } from './components/ControlButton.svelte';
export { default as ControlPanel } from './components/ControlPanel.svelte';
export { default as ScoreArea } from './components/ScoreArea.svelte';
export { default as GameSettings } from './components/GameSettings.svelte';
export { default as ResetConfirmation } from './components/ResetConfirmation.svelte';
export { default as LoadingSpinner } from './components/LoadingSpinner.svelte';
export { default as LoadingOverlay } from './components/LoadingOverlay.svelte';

// Export stores
export * from './stores/gameStore.js';

// Export types
export * from './types.js';

// Export utils
export * from './utils/confetti.js';
