class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  _applyMove(newBoard) {
    const stateBefore = JSON.stringify(this.board);

    this.board = newBoard;

    if (stateBefore !== JSON.stringify(this.board)) {
      this.status = 'playing';
      this.addRandomTile();
    }
  }

  moveLeft() {
    this._applyMove(this.board.map((row) => this.slide(row)));
  }

  moveRight() {
    this._applyMove(
      this.board.map((row) => this.slide(row.toReversed()).toReversed()),
    );
  }

  moveUp() {
    let tempBoard = this.transpose(this.board);

    tempBoard = tempBoard.map((row) => this.slide(row));
    this._applyMove(this.transpose(tempBoard));
  }

  moveDown() {
    let tempBoard = this.transpose(this.board);

    tempBoard = tempBoard.map((row) =>
      this.slide(row.toReversed()).toReversed(),
    );
    this._applyMove(this.transpose(tempBoard));
  }

  transpose(matrix) {
    return matrix[0].map((_, columnIndex) =>
      matrix.map((row) => row[columnIndex]),
    );
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c]
        = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    const isBoardEmpty = this.board.flat().every((cell) => cell === 0);

    if (isBoardEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.score = 0;
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  canMove() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  slide(row) {
    const list = row.filter((x) => x !== 0);

    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] === list[i + 1]) {
        list[i] *= 2;
        this.score += list[i];
        list.splice(i + 1, 1);
      }
    }

    while (list.length < 4) {
      list.push(0);
    }

    return list;
  }
}

export default Game;
