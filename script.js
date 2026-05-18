// Game state management
class MinecraftGame {
    constructor() {
        // Define the 4 states in cycle order
        this.states = ['empty', 'grass', 'stone', 'wood'];

        // Initialize 4x4 grid - all squares start as empty
        this.grid = [];
        for (let i = 0; i < 16; i++) {
            this.grid[i] = 0; // 0 = empty state
        }

        this.gameBoard = document.getElementById('gameBoard');
        this.houseButton = document.getElementById('houseButton');

        this.initializeGame();
    }

    // Create the game board with 16 squares
    initializeGame() {
        this.createGameBoard();
        this.setupEventListeners();
    }

    // Generate the 4x4 grid of clickable squares
    createGameBoard() {
        this.gameBoard.innerHTML = ''; // Clear any existing content

        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.classList.add('grid-square');
            square.dataset.index = i; // Store square index for easy reference
            this.updateSquareAppearance(square, i);
            this.gameBoard.appendChild(square);
        }
    }

    // Set up click handlers
    setupEventListeners() {
        // Handle square clicks
        this.gameBoard.addEventListener('click', (event) => {
            if (event.target.classList.contains('grid-square')) {
                const index = parseInt(event.target.dataset.index);
                this.cycleSquareState(index);
            }
        });

        // Handle house button
        this.houseButton.addEventListener('click', () => {
            this.buildHouse();
        });
    }

    // Cycle through states: Empty → Grass → Stone → Wood → Empty
    cycleSquareState(index) {
        // Move to next state (with wraparound)
        this.grid[index] = (this.grid[index] + 1) % this.states.length;

        // Update visual appearance
        const square = document.querySelector(`[data-index="${index}"]`);
        this.updateSquareAppearance(square, index);

        // Add fun building animation
        square.classList.add('building');
        setTimeout(() => {
            square.classList.remove('building');
        }, 400);
    }

    // Update the visual appearance of a square based on its state
    updateSquareAppearance(square, index) {
        // Remove all state classes
        square.classList.remove('empty', 'grass', 'stone', 'wood');

        // Add the current state class
        const currentState = this.states[this.grid[index]];
        square.classList.add(currentState);
    }

    // Build a simple house automatically
    buildHouse() {
        // House pattern for 4x4 grid:
        // [    ][    ][    ][    ]  Row 0: Empty (sky)
        // [Wood][Wood][Wood][Wood] Row 1: Wood roof/top wall
        // [Wood][    ][    ][Wood] Row 2: Side walls with empty inside
        // [Stone][Stone][Stone][Stone] Row 3: Stone floor

        const housePattern = [
            0, 0, 0, 0,     // Row 0: Empty
            3, 3, 3, 3,     // Row 1: Wood (index 3 in states array)
            3, 0, 0, 3,     // Row 2: Wood sides, empty middle
            2, 2, 2, 2      // Row 3: Stone (index 2 in states array)
        ];

        // Apply the house pattern with animation
        housePattern.forEach((state, index) => {
            setTimeout(() => {
                this.grid[index] = state;
                const square = document.querySelector(`[data-index="${index}"]`);
                this.updateSquareAppearance(square, index);

                // Add building animation
                square.classList.add('building');
                setTimeout(() => {
                    square.classList.remove('building');
                }, 400);
            }, index * 100); // Stagger the building animation
        });
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MinecraftGame();
});

// Add some fun sound effects (optional - commented out since we don't have audio files)
/*
function playSound(soundName) {
    const audio = new Audio(`assets/${soundName}.mp3`);
    audio.volume = 0.3; // Keep it quiet for kids
    audio.play().catch(e => {
        // Ignore audio errors if files don't exist
        console.log('Audio not available:', soundName);
    });
}
*/