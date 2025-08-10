import { writable, derived } from 'svelte/store';
import type { GameState, GameSettings, Team } from '../types.js';

const DEFAULT_GAME_STATE: GameState = {
	teamAScore: 0,
	teamBScore: 0,
	lastPointTo: null,
	isOverTime: false,
	isTeamAServe: true,
	maxPoints: 11,
	serveSwapEvery: 2,
	serveSwapOvertime: 1
};

const STORAGE_KEY = 'ping-pong-game-state';

// Load initial state from localStorage or use defaults
async function loadGameState(): Promise<GameState> {
	if (typeof window === 'undefined') return DEFAULT_GAME_STATE;
	
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		console.log('Loading from localStorage:', saved);
		
		if (saved) {
			const parsed = JSON.parse(saved);
			const loadedState = { ...DEFAULT_GAME_STATE, ...parsed };
			console.log('Loaded state:', loadedState);
			
			// Simulate loading time for better UX (minimum 300ms)
			await new Promise(resolve => setTimeout(resolve, 300));
			return loadedState;
		}
	} catch (error) {
		console.warn('Failed to load game state from localStorage:', error);
	}
	
	console.log('Using default state');
	// Still show loading briefly even with default state
	await new Promise(resolve => setTimeout(resolve, 300));
	return DEFAULT_GAME_STATE;
}

// Save state to localStorage
function saveGameState(state: GameState) {
	if (typeof window === 'undefined') return;
	
	try {
		console.log('Saving to localStorage:', state);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.warn('Failed to save game state to localStorage:', error);
	}
}

// Create loading state store
export const isLoading = writable<boolean>(true);

// Create the main game store
export const gameState = writable<GameState>(DEFAULT_GAME_STATE);

// Track if we should save changes (only after initial load)
let shouldSave = false;

// Initialize the game state
async function initializeGameState() {
	const loadedState = await loadGameState();
	gameState.set(loadedState);
	isLoading.set(false);
	// Enable saving only after initial state is loaded
	shouldSave = true;
}

// Initialize on store creation
if (typeof window !== 'undefined') {
	initializeGameState();
} else {
	// On server, just set loading to false
	isLoading.set(false);
	shouldSave = true;
}

// Subscribe to changes and save to localStorage (only after initial load)
gameState.subscribe(state => {
	if (shouldSave) {
		saveGameState(state);
	}
});

// Derived stores for computed values
export const totalScore = derived(gameState, $state => 
	$state.teamAScore + $state.teamBScore
);

export const servePosition = derived(gameState, $state => {
	const teamAOffset = -160.0;
	const teamBOffset = 80.0;
	return $state.isTeamAServe ? teamAOffset : teamBOffset;
});

export const canUndo = derived(gameState, $state => 
	$state.lastPointTo !== null && ($state.teamAScore > 0 || $state.teamBScore > 0)
);

// Game actions
export const gameActions = {
	addPoint: (team: Team) => {
		gameState.update(state => {
			const newState = { ...state };
			
			if (team === 'teamA') {
				newState.teamAScore += 1;
			} else {
				newState.teamBScore += 1;
			}
			
			newState.lastPointTo = team;
			
			// Check for overtime
			if (newState.teamAScore === newState.maxPoints - 1 && 
				newState.teamBScore === newState.maxPoints - 1) {
				newState.isOverTime = true;
				newState.maxPoints += 1;
			}
			
			// Update serve
			gameActions._updateServe(newState);
			
			return newState;
		});
	},

	removePoint: (team: Team) => {
		gameState.update(state => {
			const newState = { ...state };
			
			if (team === 'teamA' && newState.teamAScore > 0) {
				newState.teamAScore -= 1;
			} else if (team === 'teamB' && newState.teamBScore > 0) {
				newState.teamBScore -= 1;
			} else {
				return state; // No change if score is already 0
			}
			
			gameActions._updateServe(newState);
			return newState;
		});
	},

	undoLastPoint: () => {
		gameState.update(state => {
			if (!state.lastPointTo) return state;
			
			const newState = { ...state };
			
			if (state.lastPointTo === 'teamA') {
				newState.teamAScore = Math.max(0, newState.teamAScore - 1);
			} else {
				newState.teamBScore = Math.max(0, newState.teamBScore - 1);
			}
			
			newState.lastPointTo = null;
			gameActions._updateServe(newState);
			
			return newState;
		});
	},

	updateSettings: (settings: GameSettings) => {
		gameState.update(state => ({
			...state,
			...settings
		}));
	},

	resetGame: () => {
		gameState.set({
			...DEFAULT_GAME_STATE,
			// Preserve settings
			maxPoints: DEFAULT_GAME_STATE.maxPoints,
			serveSwapEvery: DEFAULT_GAME_STATE.serveSwapEvery,
			serveSwapOvertime: DEFAULT_GAME_STATE.serveSwapOvertime
		});
	},

	clearData: () => {
		if (typeof window === 'undefined') return;
		
		try {
			// Temporarily disable saving
			shouldSave = false;
			// Remove the key from localStorage
			localStorage.removeItem(STORAGE_KEY);
			console.log('Removed localStorage key completely');
			// Reset to defaults without saving
			gameState.set(DEFAULT_GAME_STATE);
			// Re-enable saving after a brief delay
			setTimeout(() => {
				shouldSave = true;
			}, 100);
		} catch (error) {
			console.warn('Failed to clear localStorage:', error);
			// Re-enable saving even on error
			shouldSave = true;
		}
	},

	_updateServe: (state: GameState) => {
		const totalPoints = state.teamAScore + state.teamBScore;
		
		// Don't swap serve until points are scored
		if (totalPoints === 0) {
			state.isTeamAServe = true;
			return;
		}
		
		const serveAmount = state.isOverTime
			? Math.floor(totalPoints / state.serveSwapOvertime)
			: Math.floor(totalPoints / state.serveSwapEvery);

		state.isTeamAServe = serveAmount % 2 === 0;
	}
};