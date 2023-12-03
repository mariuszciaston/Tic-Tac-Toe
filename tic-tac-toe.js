let gameBoard = Array(9).fill('');
let isOver = false;

const gameController = (() => {
	const playerFactory = (sign) => {
		const placeSign = (place) => {
			if (gameBoard[place] === '') {
				gameBoard[place] = sign;
			}
		};

		return { placeSign };
	};

	const player1 = playerFactory('o');
	const player2 = playerFactory('x');

	let turn = 'o';

	const areas = document.querySelectorAll('.area');
	const vsPlayerBtn = document.querySelector('#vsPlayerBtn');
	const vsComputerBtn = document.querySelector('#vsComputerBtn');
	const easyBtn = document.querySelector('#easyBtn');
	const mediumBtn = document.querySelector('#mediumBtn');
	const hardBtn = document.querySelector('#hardBtn');

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
				return ['o', condition];
			} else if (board[condition[0]] === 'x' && board[condition[1]] === 'x' && board[condition[2]] === 'x') {
				return ['x', condition];
			}
		}

		if (board.every((element) => element !== '')) {
			return ['tie'];
		}

		return [null];
	};

	const whoWon = () => {
		const winner = checkWinner(gameBoard)[0];
		const condition = checkWinner(gameBoard)[1];

		if (winner === 'o' || winner === 'x') {
			isOver = true;
			displayController.handleWin(winner, condition);
		} else if (winner === 'tie') {
			isOver = true;
			displayController.handleTie();
		} else {
			isOver = false;
		}
	};

	// ##############################################################################################

	const play = (place) => {
		if (vsPlayerBtn.classList.contains('selected')) {
			if (isOver === false) {
				if (gameBoard[place] === '') {
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
					displayController.takenBy();
				}
			}
		}

		// ###########################################################################

		function placeSignAndCheckWinner(player, place) {
			if (gameBoard[place] === '') {
				player.placeSign(place);

				whoWon();

				return true;
			} else {
				// return false;
			}
		}

		function randomMove() {
			const emptySpot = [];
			for (let i = 0; i < 9; i += 1) {
				if (gameBoard[i] === '') {
					emptySpot.push(i);
				}
			}
			const randomIndex = Math.floor(Math.random() * emptySpot.length);
			const randomPlace = emptySpot[randomIndex];
			player2.placeSign(randomPlace);
		}

		const scores = {
			x: 1,
			o: -1,
			tie: 0,
		};

		function minimax(board, depth, isMaximizing) {
			let result = checkWinner(board)[0];

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
				if (gameBoard[i] === '') {
					gameBoard[i] = 'x';

					let score = minimax(gameBoard, 0, false);

					gameBoard[i] = '';

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
				if (gameBoard[i] === '') {
					gameBoard[i] = 'x';

					if (checkWinner(gameBoard)[0] === 'x') {
						gameBoard[i] = '';
						return i;
					}
					gameBoard[i] = '';
				}
			}
			return -1;
		}

		function makeMove(difficultyBtn, place) {
			if (difficultyBtn.classList.contains('selected')) {
				if (isOver === false) {
					if (placeSignAndCheckWinner(player1, place)) {
						if (isOver === false) {
							displayController.setMessage('X turn');
							document.body.appendChild(document.createElement('div')).className = 'wait-wall';

							setTimeout(() => {
								if (difficultyBtn === easyBtn) {
									randomMove();
								} else if (difficultyBtn === mediumBtn) {
									if (Math.random() < 0.5) {
										let winMove = immediateWinMove();
										if (winMove !== -1) {
											player2.placeSign(winMove);
										} else {
											player2.placeSign(bestMove());
										}
									} else {
										randomMove();
									}
								} else if (difficultyBtn === hardBtn) {
									let winMove = immediateWinMove();
									if (winMove !== -1) {
										player2.placeSign(winMove);
									} else {
										player2.placeSign(bestMove());
									}
								}

								displayController.setMessage('O turn');
								displayController.refreshBoardState();

								whoWon();
								document.querySelector('.wait-wall').remove();
							}, 1000);
						}
					}
				}
			}
		}

		makeMove(easyBtn, place);
		makeMove(mediumBtn, place);
		makeMove(hardBtn, place);
	};

	const restart = () => {
		gameBoard = Array(9).fill('');
		isOver = false;
		turn = 'o';

		displayController.setMessage("Let's start: O turn");

		areas.forEach((area) => {
			area.classList.remove('blueWon', 'redWon');
		});
	};

	const buttons = [vsPlayerBtn, vsComputerBtn, easyBtn, mediumBtn, hardBtn];

	function resetButtons() {
		buttons.forEach((btn) => {
			btn.classList.remove('selected');
		});
	}

	function setButton(btn) {
		if (!btn.classList.contains('selected')) {
			restart();
			displayController.refreshBoardState();
		}
		btn.classList.add('selected');
	}

	function setupButtons(button, selectedButtons) {
		button.addEventListener('click', () => {
			resetButtons();
			selectedButtons.forEach(setButton);
		});
	}

	setupButtons(vsPlayerBtn, [vsPlayerBtn]);
	setupButtons(vsComputerBtn, [vsComputerBtn, easyBtn]);
	setupButtons(easyBtn, [vsComputerBtn, easyBtn]);
	setupButtons(mediumBtn, [vsComputerBtn, mediumBtn]);
	setupButtons(hardBtn, [vsComputerBtn, hardBtn]);

	return { play, restart, turn };
})();

const displayController = (() => {
	const statusBox = document.querySelector('.status-box');
	const board = document.querySelector('.board');
	const restartBtn = document.querySelector('#restartBtn');
	const areas = document.querySelectorAll('.area');

	const refreshBoardState = () => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameBoard[i];

			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	};

	const setMessage = (message) => {
		statusBox.textContent = message;
		statusBox.innerHTML = message.replace('O', '<span class="o">&nbsp;O&nbsp;</span>').replace('X', '<span class="x">&nbsp;X&nbsp;</span>');
	};

	const takenBy = (e) => {
		console.log(isOver);

		if (isOver === false) {
			setMessage(`This place is already taken by ${e.target.textContent.toUpperCase()}`);

			setTimeout(() => {
				if (isOver === false) {
					setMessage(`${gameController.turn.toUpperCase()} turn`);
				}
			}, 2000);
		}
	};

	const handleWin = (player, condition) => {
		displayWinningMessage(player);
		highlightWinningAreas(player, condition);
	};

	const handleTie = () => {
		setMessage("O It's a draw! X");
	};

	const displayWinningMessage = (player) => {
		setMessage(`${player.toUpperCase()} has won!`);
	};

	const highlightWinningAreas = (player, condition) => {
		if (player === 'o') {
			player = 'blue';
		}

		if (player === 'x') {
			player = 'red';
		}

		for (let i = 0; i < 3; i += 1) {
			areas[condition[i]].classList.add(`${player}Won`);
		}
	};

	board.addEventListener('click', (e) => takenBy(e));

	board.addEventListener('click', (e) => {
		const here = parseInt(e.target.getAttribute('data-index'));
		gameController.play(here);
		refreshBoardState();
	});

	restartBtn.addEventListener('click', () => {
		gameController.restart();
		refreshBoardState();
	});

	return { refreshBoardState, setMessage, statusBox, handleWin, handleTie, takenBy };
})();

gameController.restart();
