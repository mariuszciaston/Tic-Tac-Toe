const gameBoard = (() => {
	const array = ['', '', '', '', '', '', '', '', ''];
	return { array };
})();

const playerFactory = (sign) => {
	const placeSign = (place) => {
		if (gameBoard.array[place] === '') {
			gameBoard.array[place] = sign;
		}
	};

	return { placeSign };
};

const gameController = (() => {
	const player1 = playerFactory('o');
	const player2 = playerFactory('x');

	let isOver = false;
	let turn = 'o';

	const vsPlayerBtn = document.querySelector('#vsPlayerBtn');
	const vsComputerBtn = document.querySelector('#vsComputerBtn');
	const easyBtn = document.querySelector('#easyBtn');
	const hardBtn = document.querySelector('#hardBtn');

	const areas = document.querySelectorAll('.area');

	const whoWon = () => {
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < winConditions.length; i += 1) {
			const condition = winConditions[i];

			if (gameBoard.array[condition[0]] === 'o' && gameBoard.array[condition[1]] === 'o' && gameBoard.array[condition[2]] === 'o') {
				displayController.setMessage('O has won!');
				isOver = true;

				for (let i = 0; i < 3; i += 1) {
					areas[condition[i]].classList.add('blueWon');
				}
				return 'o';
			} else if (
				isOver === false &&
				gameBoard.array[condition[0]] === 'x' &&
				gameBoard.array[condition[1]] === 'x' &&
				gameBoard.array[condition[2]] === 'x'
			) {
				displayController.setMessage('X has won!');
				isOver = true;

				for (let i = 0; i < 3; i += 1) {
					areas[condition[i]].classList.add('redWon');
				}

				return 'x';
			}
		}

		if (isOver === false) {
			if (gameBoard.array.every((element) => element !== '')) {
				displayController.setMessage("O It's a draw! X");
				isOver = true;
				return 'tie';
			}
		}

		return null;
	};

	const checkWinner = (board) => {
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],

			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < winConditions.length; i += 1) {
			const condition = winConditions[i];

			if (board[condition[0]] === 'o' && board[condition[1]] === 'o' && board[condition[2]] === 'o') {
				return 'o';
			} else if (board[condition[0]] === 'x' && board[condition[1]] === 'x' && board[condition[2]] === 'x') {
				return 'x';
			}
		}

		if (board.every((element) => element !== '')) {
			return 'tie';
		}

		return null;
	};

	function takenBy() {
		document.addEventListener(
			'click',
			(e) => {
				displayController.setMessage(`This place is already taken by ${e.target.textContent.toUpperCase()}`);
				setTimeout(() => {
					displayController.setMessage(`${turn.toUpperCase()} turn`);
				}, 2000);
			},
			{ once: true }
		);
	}

	const play = (place) => {
		if (vsPlayerBtn.classList.contains('selected')) {
			if (isOver === false) {
				if (gameBoard.array[place] === '') {
					if (turn === 'o') {
						player1.placeSign(place);
						whoWon();

						if (isOver === false) {
							turn = 'x';
							displayController.setMessage('X turn');
						}
					} else if (turn === 'x') {
						player2.placeSign(place);
						whoWon();

						if (isOver === false) {
							turn = 'o';
							displayController.setMessage('O turn');
						}
					}
				} else {
					takenBy();
				}
			}
		}

		if (easyBtn.classList.contains('selected')) {
			if (isOver === false) {
				if (gameBoard.array[place] === '') {
					player1.placeSign(place);
					whoWon();

					if (isOver === false) {
						displayController.setMessage('X turn');
						document.body.appendChild(document.createElement('div')).className = 'wait-wall';

						setTimeout(() => {
							const emptySpot = [];
							for (let i = 0; i < 9; i += 1) {
								if (gameBoard.array[i] === '') {
									emptySpot.push(i);
								}
							}
							const randomIndex = Math.floor(Math.random() * emptySpot.length);
							const randomPlace = emptySpot[randomIndex];
							player2.placeSign(randomPlace);
							displayController.setMessage('O turn');
							displayController.refresh();
							whoWon();
							document.querySelector('.wait-wall').remove();
						}, 1000);
					}
				} else {
					takenBy();
				}
			}
		}

		if (hardBtn.classList.contains('selected')) {
			if (isOver === false) {
				if (gameBoard.array[place] === '') {
					player1.placeSign(place);
					whoWon();

					if (isOver === false) {
						displayController.setMessage('X turn');
						document.body.appendChild(document.createElement('div')).className = 'wait-wall';

						setTimeout(() => {
							const scores = {
								x: 1,
								o: -1,
								tie: 0,
							};

							function minimax(board, depth, isMaximizing) {
								let result = checkWinner(board);

								if (result !== null) {
									let score = scores[result];
									return score;
								}

								if (isMaximizing) {
									let bestScore = -Infinity;

									for (let i = 0; i < 9; i++) {
										if (board[i] === '') {
											board[i] = 'x';

											let score = minimax(board, depth + 1, false);
											board[i] = '';

											bestScore = Math.max(score, bestScore);
										}
									}

									return bestScore;
								} else {
									let bestScore = Infinity;

									for (let i = 0; i < 9; i++) {
										if (board[i] === '') {
											board[i] = 'o';

											let score = minimax(board, depth + 1, true);
											board[i] = '';

											bestScore = Math.min(score, bestScore);
										}
									}

									return bestScore;
								}
							}

							function bestMove() {
								let bestScore = -Infinity;
								let moves = [];
								for (let i = 0; i < 9; i++) {
									if (gameBoard.array[i] === '') {
										gameBoard.array[i] = 'x';

										let score = minimax(gameBoard.array, 0, false);

										gameBoard.array[i] = '';

										if (score > bestScore) {
											bestScore = score;
											moves = [i];
										} else if (score === bestScore) {
											moves.push(i);
										}
									}
								}
								let move = moves[Math.floor(Math.random() * moves.length)];
								return move;
							}

							function immediateWinMove() {
								for (let i = 0; i < 9; i++) {
									if (gameBoard.array[i] === '') {
										gameBoard.array[i] = 'x';

										if (checkWinner(gameBoard.array) === 'x') {
											gameBoard.array[i] = '';
											return i;
										}
										gameBoard.array[i] = '';
									}
								}
								return -1;
							}

							let winMove = immediateWinMove();
							if (winMove !== -1) {
								player2.placeSign(winMove);
							} else {
								player2.placeSign(bestMove());
							}

							displayController.setMessage('O turn');
							displayController.refresh();
							whoWon();
							document.querySelector('.wait-wall').remove();
						}, 1000);
					}
				} else {
					takenBy();
				}
			}
		}
	};

	const restart = () => {
		gameBoard.array = ['', '', '', '', '', '', '', '', ''];
		isOver = false;
		turn = 'o';
		displayController.setMessage("Let's start: O turn");

		areas.forEach((area) => {
			area.classList.remove('blueWon', 'redWon');
		});
	};

	vsPlayerBtn.addEventListener('click', () => {
		if (!vsPlayerBtn.classList.contains('selected')) {
			gameController.restart();
			displayController.refresh();
		}
		vsPlayerBtn.classList.add('selected');
		vsComputerBtn.classList.remove('selected');
		easyBtn.classList.remove('selected');
		hardBtn.classList.remove('selected');
	});

	vsComputerBtn.addEventListener('click', () => {
		if (!vsComputerBtn.classList.contains('selected')) {
			gameController.restart();
			displayController.refresh();
		}
		vsComputerBtn.classList.add('selected');
		hardBtn.classList.add('selected');
		vsPlayerBtn.classList.remove('selected');
	});

	easyBtn.addEventListener('click', () => {
		if (!easyBtn.classList.contains('selected')) {
			gameController.restart();
			displayController.refresh();
		}
		vsComputerBtn.classList.add('selected');
		easyBtn.classList.add('selected');
		hardBtn.classList.remove('selected');
		vsPlayerBtn.classList.remove('selected');
	});

	hardBtn.addEventListener('click', () => {
		if (!hardBtn.classList.contains('selected')) {
			gameController.restart();
			displayController.refresh();
		}
		vsComputerBtn.classList.add('selected');
		hardBtn.classList.add('selected');
		easyBtn.classList.remove('selected');
		vsPlayerBtn.classList.remove('selected');
	});

	return { play, restart };
})();

const displayController = (() => {
	const refresh = () => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameBoard.array[i];
			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	};

	const board = document.querySelector('.board');
	board.addEventListener('click', (e) => {
		const here = parseInt(e.target.getAttribute('data-index'));
		gameController.play(here);
		displayController.refresh();
	});

	const restartBtn = document.querySelector('#restartBtn');
	restartBtn.addEventListener('click', () => {
		gameController.restart();
		displayController.refresh();
	});

	const statusBox = document.querySelector('.status-box');
	const setMessage = (message) => {
		statusBox.textContent = message;
		statusBox.innerHTML = message.replace('O', '<span class="o">&nbsp;O&nbsp;</span>').replace('X', '<span class="x">&nbsp;X&nbsp;</span>');
	};
	return { refresh, setMessage, statusBox };
})();

gameController.restart();
