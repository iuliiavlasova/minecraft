// Enhanced Multi-Layer Minecraft Game for Children
class MinecraftGame {
    constructor() {
        // Define the 5 block states in cycle order (added Diamond!)
        this.states = ['empty', 'grass', 'stone', 'wood', 'diamond'];

        // Multi-layer system: Each layer is a 4x4 grid (16 squares)
        this.layers = [];
        this.currentLayer = 0; // Starting at layer 0 (display as Layer 1)
        this.maxLayers = 8; // Allow up to 8 layers for tall buildings

        // Initialize first layer - all squares start as empty
        this.initializeLayers();

        // Get DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.houseButton = document.getElementById('houseButton');
        this.clearButton = document.getElementById('clearButton');
        this.layerUpButton = document.getElementById('layerUpButton');
        this.layerDownButton = document.getElementById('layerDownButton');
        this.layerNumber = document.getElementById('layerNumber');

        // 3D Preview elements
        this.preview3D = document.getElementById('preview3D');

        this.initializeGame();
    }

    // Initialize the layer system
    initializeLayers() {
        for (let layer = 0; layer < this.maxLayers; layer++) {
            this.layers[layer] = [];
            for (let i = 0; i < 16; i++) {
                this.layers[layer][i] = 0; // 0 = empty state
            }
        }
    }

    // Set up the game board and event listeners
    initializeGame() {
        this.createGameBoard();
        this.create3DPreview();
        this.setupEventListeners();
        this.updateLayerDisplay();
        this.updateLayerButtons();
        this.update3DPreview();
    }

    // Generate the 4x4 grid of clickable squares
    createGameBoard() {
        this.gameBoard.innerHTML = ''; // Clear any existing content

        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.classList.add('grid-square');
            square.dataset.index = i;
            this.updateSquareAppearance(square, i);
            this.gameBoard.appendChild(square);
        }

        // Add layer transition animation
        this.gameBoard.classList.add('layer-changing');
        setTimeout(() => {
            this.gameBoard.classList.remove('layer-changing');
        }, 400);
    }

    // Set up all event listeners
    setupEventListeners() {
        // Handle square clicks for building
        this.gameBoard.addEventListener('click', (event) => {
            if (event.target.classList.contains('grid-square')) {
                const index = parseInt(event.target.dataset.index);
                this.cycleSquareState(index);
            }
        });

        // Handle house building
        this.houseButton.addEventListener('click', () => {
            this.buildMultiLayerHouse();
        });

        // Handle layer clearing
        this.clearButton.addEventListener('click', () => {
            this.clearCurrentLayer();
        });

        // Handle layer navigation
        this.layerUpButton.addEventListener('click', () => {
            this.goToLayer(this.currentLayer + 1);
        });

        this.layerDownButton.addEventListener('click', () => {
            this.goToLayer(this.currentLayer - 1);
        });


        // Keyboard shortcuts for quick layer switching (for parents/advanced users)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp' && event.ctrlKey) {
                event.preventDefault();
                this.goToLayer(this.currentLayer + 1);
            } else if (event.key === 'ArrowDown' && event.ctrlKey) {
                event.preventDefault();
                this.goToLayer(this.currentLayer - 1);
            }
        });
    }

    // Cycle through block states: Empty → Grass → Stone → Wood → Diamond → Empty
    cycleSquareState(index) {
        // Get current layer's grid
        const currentGrid = this.layers[this.currentLayer];

        // Move to next state (with wraparound)
        currentGrid[index] = (currentGrid[index] + 1) % this.states.length;

        // Update visual appearance
        const square = document.querySelector(`[data-index="${index}"]`);
        this.updateSquareAppearance(square, index);

        // Add enhanced building animation
        square.classList.add('building');
        setTimeout(() => {
            square.classList.remove('building');
        }, 600);

        // Add sparkle effect for diamond blocks
        if (this.states[currentGrid[index]] === 'diamond') {
            this.addSparkleEffect(square);
        }

        // Update 3D preview
        this.update3DPreview();
    }

    // Update the visual appearance of a square based on its state
    updateSquareAppearance(square, index) {
        const currentGrid = this.layers[this.currentLayer];

        // Remove all state classes
        square.classList.remove('empty', 'grass', 'stone', 'wood', 'diamond');

        // Add the current state class
        const currentState = this.states[currentGrid[index]];
        square.classList.add(currentState);
    }

    // Navigate to a specific layer
    goToLayer(targetLayer) {
        // Clamp to valid range
        targetLayer = Math.max(0, Math.min(this.maxLayers - 1, targetLayer));

        if (targetLayer !== this.currentLayer) {
            this.currentLayer = targetLayer;
            this.updateLayerDisplay();
            this.updateLayerButtons();
            this.refreshGameBoard();
        }
    }

    // Refresh the game board to show current layer
    refreshGameBoard() {
        for (let i = 0; i < 16; i++) {
            const square = document.querySelector(`[data-index="${i}"]`);
            this.updateSquareAppearance(square, i);
        }

        // Add transition animation
        this.gameBoard.classList.add('layer-changing');
        setTimeout(() => {
            this.gameBoard.classList.remove('layer-changing');
        }, 400);

        // Update 3D preview
        this.update3DPreview();
    }

    // Update the layer display
    updateLayerDisplay() {
        this.layerNumber.textContent = this.currentLayer + 1; // Display as 1-based
    }

    // Update layer button states
    updateLayerButtons() {
        // Disable/enable buttons based on current layer
        this.layerDownButton.disabled = this.currentLayer <= 0;
        this.layerUpButton.disabled = this.currentLayer >= this.maxLayers - 1;

        // Visual feedback for current position
        if (this.currentLayer === 0) {
            this.layerDownButton.textContent = '🏠 Ground Floor';
        } else {
            this.layerDownButton.textContent = '⬇️ Layer Down';
        }

        if (this.currentLayer === this.maxLayers - 1) {
            this.layerUpButton.textContent = '☁️ Sky Limit';
        } else {
            this.layerUpButton.textContent = '⬆️ Layer Up';
        }
    }


    // Build a multi-layer house automatically
    buildMultiLayerHouse() {
        // Layer 1 (index 0): Stone foundation
        const foundationPattern = [
            2, 2, 2, 2,     // Row 0: Stone foundation
            2, 2, 2, 2,     // Row 1: Stone foundation
            2, 2, 2, 2,     // Row 2: Stone foundation
            2, 2, 2, 2      // Row 3: Stone foundation
        ];

        // Layer 2 (index 1): Wood walls with door
        const wallsPattern = [
            3, 3, 3, 3,     // Row 0: Wood walls
            3, 0, 0, 3,     // Row 1: Wood walls with empty inside
            3, 0, 0, 3,     // Row 2: Wood walls with empty inside (door on left)
            3, 0, 0, 3      // Row 3: Wood walls with empty inside
        ];

        // Layer 3 (index 2): Wood roof with diamond decoration
        const roofPattern = [
            3, 3, 3, 3,     // Row 0: Wood roof
            3, 4, 4, 3,     // Row 1: Wood with diamond decorations
            3, 4, 4, 3,     // Row 2: Wood with diamond decorations
            3, 3, 3, 3      // Row 3: Wood roof
        ];

        // Apply patterns to different layers
        this.applyPatternToLayer(0, foundationPattern, 'Foundation');
        setTimeout(() => {
            this.applyPatternToLayer(1, wallsPattern, 'Walls');
        }, 1000);
        setTimeout(() => {
            this.applyPatternToLayer(2, roofPattern, 'Roof');
        }, 2000);

        // Navigate to the foundation layer to start
        setTimeout(() => {
            this.goToLayer(0);
        }, 3000);
    }

    // Apply a pattern to a specific layer
    applyPatternToLayer(layerIndex, pattern, layerName) {
        console.log(`Building ${layerName} on layer ${layerIndex + 1}...`);

        pattern.forEach((state, index) => {
            setTimeout(() => {
                this.layers[layerIndex][index] = state;

                // If we're viewing this layer, update visuals
                if (this.currentLayer === layerIndex) {
                    const square = document.querySelector(`[data-index="${index}"]`);
                    this.updateSquareAppearance(square, index);

                    // Add building animation
                    square.classList.add('building');
                    setTimeout(() => {
                        square.classList.remove('building');
                    }, 600);
                }
            }, index * 80); // Stagger the building animation
        });

        // Update 3D preview after pattern is applied
        setTimeout(() => {
            this.update3DPreview();
        }, pattern.length * 80 + 600);
    }

    // Add sparkle effect for special blocks
    addSparkleEffect(square) {
        // Add temporary sparkle class for extra visual feedback
        square.style.boxShadow = '0 0 20px rgba(0, 206, 209, 0.8)';
        setTimeout(() => {
            square.style.boxShadow = '';
        }, 1000);
    }

    // Helper method to check if current layer has any blocks
    hasBlocksInCurrentLayer() {
        const currentGrid = this.layers[this.currentLayer];
        return currentGrid.some(state => state !== 0);
    }

    // Get layer summary for debugging/info
    getLayerSummary() {
        return this.layers.map((layer, index) => {
            const blockCount = layer.filter(state => state !== 0).length;
            return `Layer ${index + 1}: ${blockCount} blocks`;
        }).join('\n');
    }

    // === 3D PREVIEW SYSTEM ===

    // Create the 3D preview structure
    create3DPreview() {
        this.preview3D.innerHTML = '';

        // Create 8 layer divs for the 3D preview
        for (let layerIndex = 0; layerIndex < this.maxLayers; layerIndex++) {
            const layerDiv = document.createElement('div');
            layerDiv.classList.add('preview-layer');
            layerDiv.dataset.layer = layerIndex;

            // Create 16 squares for each layer (4x4 grid)
            for (let squareIndex = 0; squareIndex < 16; squareIndex++) {
                const square = document.createElement('div');
                square.classList.add('preview-square');
                square.dataset.index = squareIndex;
                layerDiv.appendChild(square);
            }

            this.preview3D.appendChild(layerDiv);
        }
    }

    // Update the 3D preview to reflect current state
    update3DPreview() {
        for (let layerIndex = 0; layerIndex < this.maxLayers; layerIndex++) {
            const layerDiv = this.preview3D.querySelector(`[data-layer="${layerIndex}"]`);
            const layer = this.layers[layerIndex];

            for (let squareIndex = 0; squareIndex < 16; squareIndex++) {
                const square = layerDiv.querySelector(`[data-index="${squareIndex}"]`);
                const state = layer[squareIndex];
                const blockType = this.states[state];

                // Remove all block state classes
                square.classList.remove('empty', 'grass', 'stone', 'wood', 'diamond');

                // Add current block state class
                square.classList.add(blockType);

                // Add subtle transparency for better 3D effect
                if (blockType === 'empty') {
                    square.style.opacity = '0.1';
                } else {
                    square.style.opacity = '0.9';
                }
            }

            // Highlight current layer being edited
            if (layerIndex === this.currentLayer) {
                layerDiv.style.border = '2px solid #FFD700';
                layerDiv.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            } else {
                layerDiv.style.border = '1px solid rgba(0, 0, 0, 0.1)';
                layerDiv.style.boxShadow = 'none';
            }
        }
    }


    // Clear current layer and update preview
    clearCurrentLayer() {
        const currentGrid = this.layers[this.currentLayer];

        // Clear all squares with animation
        for (let i = 0; i < 16; i++) {
            setTimeout(() => {
                currentGrid[i] = 0; // Set to empty
                const square = document.querySelector(`[data-index="${i}"]`);
                this.updateSquareAppearance(square, i);

                // Add clearing animation
                square.classList.add('building');
                setTimeout(() => {
                    square.classList.remove('building');
                }, 600);
            }, i * 50); // Stagger the clearing animation
        }

        // Update 3D preview after clearing animation
        setTimeout(() => {
            this.update3DPreview();
        }, 16 * 50 + 600);
    }
}

// Initialize the enhanced game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create the game instance
    const game = new MinecraftGame();

    // Add some helpful console messages for parents/developers
    console.log('🎮 Mini Minecraft Builder Enhanced!');
    console.log('Keyboard shortcuts for parents:');
    console.log('• Ctrl + ↑ : Go up one layer');
    console.log('• Ctrl + ↓ : Go down one layer');

    // Make game accessible globally for debugging
    window.minecraftGame = game;
});

// Fun sound effects placeholder (can be enabled when audio files are added)
function playBuildSound(blockType) {
    // Could add different sounds for different block types
    console.log(`🔊 Building ${blockType} block!`);
}

// Achievement system for encouragement (expandable)
class AchievementSystem {
    constructor() {
        this.achievements = [
            { id: 'first_diamond', name: 'Diamond Discoverer', description: 'Place your first diamond block!' },
            { id: 'layer_builder', name: 'Sky Builder', description: 'Build on 3 different layers!' },
            { id: 'house_architect', name: 'Architect', description: 'Use the house builder!' }
        ];
    }

    // This could be expanded to show fun achievements for kids
    unlock(achievementId) {
        console.log(`🏆 Achievement unlocked: ${achievementId}`);
    }
}