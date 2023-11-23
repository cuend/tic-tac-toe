const gameBoard = {
    board: Array(10).fill(null),

    getBoard: function() {return this.board.slice()},

    makeMove: function(index, player) {
        if (this.board[index] == null) {
            this.board[index] = player.symbol;
            return true;
        }
        else {
            return null;
        }
    }
}

const createPlayer = (name, symbol) => {
    return {name, symbol};
}

const displayController = {
    updatePage: function () {
        board = gameBoard.getBoard();
        for (let i = 1; i < board.length; i++) {
            // get the cell element by its ID (assuming IDs are cell-1 to cell-9)
            const cellId = `cell-${i}`;
            const cellElement = document.getElementById(cellId);
        
            // update the innerHTML of the cell with the corresponding value from the gameboard
            cellElement.innerHTML = board[i] || ''; // use an empty string if the cell value is null
        }
    },

    updateCurrentPlayer: function (currentPlayer) {
        // get all player elements within the "players" container
        const allPlayerElements = document.querySelectorAll('.player');
      
        // remove the "currentPlayer" class from all player elements
        allPlayerElements.forEach((element) => {
          element.classList.remove('currentPlayer');
        });
      
        // add the "currentPlayer" class to the element with the current player's symbol
        const currentPlayerElement = document.querySelector(`#${currentPlayer.symbol}`);
        if (currentPlayerElement) {
          currentPlayerElement.classList.add('currentPlayer');
        }
      },

      activateOverlay: function (message) {
        const overlay = document.getElementById('clickableOverlay');
        const content = document.querySelector('.overlay-content');
        content.innerHTML = message;
        // overlay.style.display = 'flex';
        overlay.classList.add('active');
        overlay.addEventListener('click', () => {this.dismissOverlay(); gameController.resetGame();}); // Add the event listener
      },
      
      dismissOverlay: function () {
        const overlay = document.getElementById('clickableOverlay');
        // overlay.style.display = 'none';
        overlay.classList.remove('active');
        overlay.removeEventListener('click', () => {this.dismissOverlay(); gameController.resetGame();}); // Remove the event listener
      },
}

const gameController = {
    // internal variables
    playerOne: createPlayer("Player 1", "X"),
    playerTwo: createPlayer("Player 2", "O"),
    currentPlayer: null,

    switchPlayer: function() {
        if (this.currentPlayer === this.playerOne)
        {
            this.currentPlayer = this.playerTwo;
        }
        else {
            this.currentPlayer = this.playerOne;
        }

        displayController.updateCurrentPlayer(this.currentPlayer);
    },

    endGame: function() {
        board = gameBoard.getBoard();

        // define the possible winning triples
        const winningTriples = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
            [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
            [1, 5, 9], [3, 5, 7],            // Diagonals
        ];

        // check each winning triple
        for (const triple of winningTriples) {
            const [a, b, c] = triple;

            // check if the cells in the triple are all occupied by the same player
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                return `${board[a]} Wins!`;
            }
        }

        // check if there is a draw
        if (board.slice(1).every(cell => cell)) {
            return `It's a Draw!`;
        }

        // else continue game
        return null;
    },

    startGame: function () {
        board = gameBoard.board;

        this.currentPlayer = this.playerOne;
        displayController.updateCurrentPlayer(this.currentPlayer);

        for (let i = 1; i < board.length; i++) {
            // get the cell element by its ID (assuming IDs are cell-1 to cell-9)
            const cellId = `cell-${i}`;
            const cellElement = document.getElementById(cellId);
        
            // add a click event listener to each cell
            cellElement.addEventListener('click', () => {
                if (gameBoard.makeMove(i, this.currentPlayer)) {
                    // if move is valid update page
                    displayController.updatePage();

                    // check if move made a win/draw
                    let message = this.endGame();
                    if (message) {
                        displayController.activateOverlay(message);
                    }

                    // else continue with next player
                    this.switchPlayer();
                    console.log(this.currentPlayer);
                }
            });
        }

        const resetButton = document.querySelector(".restart");
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    },

    resetGame: function () {
        gameBoard.board = Array(10).fill(null);

        this.currentPlayer = this.playerOne;
        displayController.updateCurrentPlayer(this.currentPlayer);

        displayController.updatePage();
    },
}

gameController.startGame();