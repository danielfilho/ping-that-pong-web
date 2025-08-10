# Ping That Pong 🏓

A fun and interactive ping pong score tracking web application built with SvelteKit.

Note: this has been migrated from a native iOS app I made to lear Swift and SwiftUI to SvelteKit, so I learn it.

## Features

- ⚡ Real-time score tracking for two teams
- 🎉 Confetti celebrations when a team wins
- 🎾 Serve tracking with visual indicator
- 📱 Mobile-friendly with touch and swipe gestures
- ⚙️ Configurable game rules
- 🔄 Undo functionality
- 🎨 Beautiful gradient design matching iOS aesthetics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ping-that-pong-web
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. **Scoring**: Tap on a team's area to add a point
2. **Swipe Gestures**:
   - Swipe right to add a point
   - Swipe left to remove a point
3. **Serve Tracking**: The tennis ball emoji indicates which team is serving
4. **Configuration**: Tap the gear icon to adjust:
   - Maximum points to win
   - Serve swap frequency
   - Overtime serve swap rules
5. **Undo**: Use the undo button to revert the last point
6. **Reset**: Clear the score and start over

## Game Rules

- Standard ping pong rules apply
- Games typically go to 11 points
- Serve swaps every 2 points (configurable)
- In overtime, serve swaps every point (configurable)
- Win by 2 points difference

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Canvas Confetti](https://github.com/catdad/canvas-confetti) - Celebration effects
- [Hammer.js](https://hammerjs.github.io/) - Touch gesture recognition
- Modern CSS with custom properties and animations

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run check
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Inspired by the original iOS ping pong score app
- Built with modern web technologies for a smooth user experience