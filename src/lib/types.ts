export enum Team {
	TeamA = 'teamA',
	TeamB = 'teamB'
}

export interface GameState {
	teamAScore: number;
	teamBScore: number;
	lastPointTo: Team | null;
	isOverTime: boolean;
	isTeamAServe: boolean;
	maxPoints: number;
	serveSwapEvery: number;
	serveSwapOvertime: number;
}

export interface GameSettings {
	maxPoints: number;
	serveSwapEvery: number;
	serveSwapOvertime: number;
}

export interface ButtonProps {
	variant?: 'primary' | 'secondary' | 'danger';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	onclick?: () => void;
	title?: string;
	class?: string;
}

export interface ModalProps {
	isOpen: boolean;
	title: string;
	onClose: () => void;
	size?: 'small' | 'medium' | 'large';
}