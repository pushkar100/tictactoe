function TicTacToe() {
    this.input = {
        user: 'x',
        computer: 'o'
    };
    this.grid = [
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined
    ];
    this.gameOverCases = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    this.lastUserInputIndex = -1;
    this.lastComputerInputIndex = -1;
    this.gameOn = true;
}

TicTacToe.prototype.gameOverTest = function(inputElt) {
    var i, j, outerLen, innerLen, count = 0;
    for (i = 0, outerLen = this.gameOverCases.length; i < outerLen; i++) {
        for (count = 0, j = 0, innerLen = this.gameOverCases[i].length; j < innerLen; j++) {
            if (this.grid[this.gameOverCases[i][j]] === inputElt) {
                count++;
                if (count === 3) {
                    this.gameOn = false;
                    return true;
                }
            }
        }
    }
    return false;
};

TicTacToe.prototype.freeCell = function(index) {
    return this.grid[index] ? false : true;
};

TicTacToe.prototype.takeUserInput = function(index) {
    if (this.freeCell(index)) {
        this.grid[index] = this.input.user;
        return true;
    }
    return false;
};

TicTacToe.prototype.oneSquareLeft = function(input) {
    var i, j, outerLen, innerLen, count = 0,
        winCells = [],
        currentEmptyCells = [];
    for (i = 0, outerLen = this.gameOverCases.length; i < outerLen; i++) {
        currentEmptyCells = [];
        for (count = 0, j = 0, innerLen = this.gameOverCases[i].length; j < innerLen; j++) {
            if (this.grid[this.gameOverCases[i][j]] === input) {
                count++;
            } else {
                currentEmptyCells.push(this.gameOverCases[i][j]);
            }
            if (count === 2) {
                currentEmptyCells.forEach(function(elt, ind, arr) {
                    winCells.push(elt);
                });
            }
        }
    }
    return winCells.length ? winCells : false;
};

TicTacToe.prototype.placeInMiddleToCornerCell = function() {
    var cornerIndices = [0, 2, 6, 8],
        i = 0,
        len;
    if (this.freeCell(4)) {
        this.grid[4] = this.input.computer;
        this.lastComputerInputIndex = 4;
        return;
    }
    while (cornerIndices[i] !== undefined) {
        if (this.freeCell(cornerIndices[i])) {
            this.grid[cornerIndices[i]] = this.input.computer;
            this.lastComputerInputIndex = +cornerIndices[i];
            return;
        }
        i++;
    }
    for (i = 0, len = this.grid.length; i < len; i++) {
        if (this.freeCell(i)) {
            this.grid[i] = this.input.computer;
            this.lastComputerInputIndex = +i;
            return;
        }
    }
};

TicTacToe.prototype.computerMove = function() {
    var winningMove = this.oneSquareLeft(this.input.computer),
        compIndex, i, len,
        nonCorners = [1, 3, 4, 5, 7],
        corners = [0, 2, 8, 6];

    // Computer to play first:
    if (this.lastUserInputIndex === -1) {
        this.grid[0] = this.input.computer;
        this.lastComputerInputIndex = 0;
        return;
    }

    // Checking for computer's win:
    if (winningMove) {
        for (i = 0, len = winningMove.length; i < len; i++) {
            compIndex = winningMove[i];
            if (this.freeCell(compIndex)) {
                this.grid[compIndex] = this.input.computer;
                this.lastComputerInputIndex = +compIndex;
                return;
            }
        }
    }

    // Checking for user's win:
    winningMove = this.oneSquareLeft(this.input.user);
    if (winningMove) {
        for (i = 0, len = winningMove.length; i < len; i++) {
            compIndex = winningMove[i];
            if (this.freeCell(compIndex)) {
                this.grid[compIndex] = this.input.computer;
                this.lastComputerInputIndex = +compIndex;
                return;
            }
        }
        if (this.grid[compIndex] === this.input.computer) {
            if (nonCorners.indexOf(compIndex) !== -1) {
                for (i = 0, len = nonCorners.length; i < len; i++) {
                    if (this.freeCell(nonCorners[i])) {
                        this.grid[nonCorners[i]] = this.input.computer;
                        this.lastComputerInputIndex = +nonCorners[i];
                        return;
                    }
                }
            } else {
                for (i = 0, len = corners.length; i < len; i++) {
                    if (this.freeCell(corners[i])) {
                        this.grid[corners[i]] = this.input.computer;
                        this.lastComputerInputIndex = +corners[i];
                        return;
                    }
                }
            }
        }
    }

    // User Middle or Side Cases: (Others)
    this.placeInMiddleToCornerCell();
};

TicTacToe.prototype.userMove = function(index) {
    if (this.freeCell(+index)) {
        this.grid[index] = this.input.user;
        this.lastUserInputIndex = +index;
        return this.lastUserInputIndex;
    }
    return -1;
}

TicTacToe.prototype.getComputerLastMove = function() {
    return this.lastComputerInputIndex;
};

TicTacToe.prototype.getUserLastMove = function() {
    return this.lastUserInputIndex;
};

// ----- Testing ----- :

var game = new TicTacToe(),
    firstMoveIndex;
game.computerMove();
firstMoveIndex = game.lastComputerInputIndex;
$('button[value=' + firstMoveIndex + ']').closest('td').html('<span class="computer">' + game.input.computer + '</span>');

// ----- UI Functions and Events -----:
$('button').on('click', function() {
    var $this = $(this),
        index = $this.val(),
        userMoveIndex = game.userMove(index),
        computerMoveIndex;

    if (!game.gameOn) {
        return false;
    } else if (userMoveIndex === -1) {
        alert('Cannot input in an occupied cell');
    } else {
        $this.closest('td').html('<span class="user">' + game.input.user + '</span>');
    }
    if (game.gameOverTest(game.input.user)) {
        $('.result').css('display', 'block').text('You have won!');
    } else {
        game.computerMove();
        computerMoveIndex = game.lastComputerInputIndex;
        $('button[value=' + computerMoveIndex + ']').closest('td').html('<span class="computer">' + game.input.computer + '</span>');
        if (game.gameOverTest(game.input.computer)) {
            $('.result').css('display', 'block').text('You have lost!');
        }
    }
});
