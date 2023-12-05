/* eslint-disable no-use-before-define */

const gameState = (() => {
	const gameBoard = Array(9).fill('');
	const isOver = false;
	const turn = 'o';

	return { gameBoard, isOver, turn };
})();

const gameController = (() => {
	const vsPlayerBtn = document.querySelector('#vsPlayerBtn');
	const easyBtn = document.querySelector('#easyBtn');
	const mediumBtn = document.querySelector('#mediumBtn');
	const hardBtn = document.querySelector('#hardBtn');

	const playerFactory = (sign) => {
		const placeSign = (place) => {
			if (gameState.gameBoard[place] === '') {
				gameState.gameBoard[place] = sign;
			}
		};

		return { placeSign };
	};

	const player1 = playerFactory('o');
	const player2 = playerFactory('x');

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
			}
			if (board[condition[0]] === 'x' && board[condition[1]] === 'x' && board[condition[2]] === 'x') {
				return ['x', condition];
			}
		}

		if (board.every((element) => element !== '')) {
			return ['tie'];
		}

		return [null];
	};

	const whoWon = () => {
		const winner = checkWinner(gameState.gameBoard)[0];
		const condition = checkWinner(gameState.gameBoard)[1];

		if (winner === 'o' || winner === 'x') {
			gameState.isOver = true;
			displayController.handleWin(winner, condition);
		} else if (winner === 'tie') {
			gameState.isOver = true;
			displayController.handleTie();
		} else {
			gameState.isOver = false;
		}
	};

	const randomMove = () => {
		const emptySpot = [];
		for (let i = 0; i < 9; i += 1) {
			if (gameState.gameBoard[i] === '') {
				emptySpot.push(i);
			}
		}
		const randomIndex = Math.floor(Math.random() * emptySpot.length);
		const randomPlace = emptySpot[randomIndex];
		player2.placeSign(randomPlace);
	};

	const scores = {
		x: 1,
		o: -1,
		tie: 0,
	};

	const minimax = (board, depth, isMaximizing) => {
		const result = checkWinner(board)[0];

		const newBoard = board;

		if (result !== null) {
			const score = scores[result];
			return score;
		}

		if (isMaximizing) {
			let bestScore = -Infinity;

			for (let i = 0; i < 9; i += 1) {
				if (board[i] === '') {
					newBoard[i] = 'x';

					const score = minimax(board, depth + 1, false);
					newBoard[i] = '';

					bestScore = Math.max(score, bestScore);
				}
			}

			return bestScore;
		}
		let bestScore = Infinity;

		for (let i = 0; i < 9; i += 1) {
			if (board[i] === '') {
				newBoard[i] = 'o';

				const score = minimax(board, depth + 1, true);
				newBoard[i] = '';

				bestScore = Math.min(score, bestScore);
			}
		}

		return bestScore;
	};

	const bestMove = () => {
		let bestScore = -Infinity;
		let moves = [];
		for (let i = 0; i < 9; i += 1) {
			if (gameState.gameBoard[i] === '') {
				gameState.gameBoard[i] = 'x';

				const score = minimax(gameState.gameBoard, 0, false);

				gameState.gameBoard[i] = '';

				if (score > bestScore) {
					bestScore = score;
					moves = [i];
				} else if (score === bestScore) {
					moves.push(i);
				}
			}
		}
		const move = moves[Math.floor(Math.random() * moves.length)];
		return move;
	};

	const immediateWinMove = () => {
		for (let i = 0; i < 9; i += 1) {
			if (gameState.gameBoard[i] === '') {
				gameState.gameBoard[i] = 'x';

				if (checkWinner(gameState.gameBoard)[0] === 'x') {
					gameState.gameBoard[i] = '';
					return i;
				}
				gameState.gameBoard[i] = '';
			}
		}
		return -1;
	};

	const makeMove = (difficultyBtn, place) => {
		if (!difficultyBtn.classList.contains('selected') || gameState.isOver || gameState.gameBoard[place] !== '') {
			return;
		}

		player1.placeSign(place);
		whoWon();

		if (gameState.isOver) {
			return;
		}

		displayController.setMessage('X turn');
		displayController.setWaitWall();

		setTimeout(() => {
			selectMove(difficultyBtn);

			displayController.setMessage('O turn');
			displayController.refreshBoard();
			whoWon();
			displayController.removeWaitWall();
		}, 1000);
	};

	const selectMove = (difficultyBtn) => {
		if (difficultyBtn === easyBtn) {
			return randomMove();
		}
		if (difficultyBtn === mediumBtn) {
			return mediumDifficultyMove();
		}
		if (difficultyBtn === hardBtn) {
			return hardDifficultyMove();
		}
		return null;
	};

	const mediumDifficultyMove = () => {
		if (Math.random() < 0.5) {
			hardDifficultyMove();
		} else {
			randomMove();
		}
	};

	const hardDifficultyMove = () => {
		const winMove = immediateWinMove();
		if (winMove !== -1) {
			player2.placeSign(winMove);
		} else {
			player2.placeSign(bestMove());
		}
	};

	const play = (place) => {
		if (vsPlayerBtn.classList.contains('selected') && gameState.isOver === false && gameState.gameBoard[place] === '') {
			const currentPlayer = gameState.turn === 'o' ? player1 : player2;
			currentPlayer.placeSign(place);
			whoWon();

			if (gameState.isOver === false) {
				gameState.turn = gameState.turn === 'o' ? 'x' : 'o';
				displayController.setMessage(`${gameState.turn.toUpperCase()} turn`);
			}
		}

		[easyBtn, mediumBtn, hardBtn].forEach((btn) => makeMove(btn, place));
	};

	const restart = () => {
		gameState.gameBoard = Array(9).fill('');
		gameState.isOver = false;
		gameState.turn = 'o';

		displayController.setMessage("Let's start: O turn");
	};

	return { play, restart };
})();

const displayController = (() => {
	const statusBox = document.querySelector('.status-box');
	const board = document.querySelector('.board');
	const restartBtn = document.querySelector('#restartBtn');
	const areas = document.querySelectorAll('.area');

	const vsPlayerBtn = document.querySelector('#vsPlayerBtn');
	const vsComputerBtn = document.querySelector('#vsComputerBtn');
	const easyBtn = document.querySelector('#easyBtn');
	const mediumBtn = document.querySelector('#mediumBtn');
	const hardBtn = document.querySelector('#hardBtn');

	const buttons = [vsPlayerBtn, vsComputerBtn, easyBtn, mediumBtn, hardBtn];

	const refreshBoard = () => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameState.gameBoard[i];
			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	};

	const setMessage = (message) => {
		statusBox.textContent = message;
		statusBox.innerHTML = message.replace('O', '<span class="o">&nbsp;O&nbsp;</span>').replace('X', '<span class="x">&nbsp;X&nbsp;</span>');
	};

	const setWaitWall = () => {
		document.body.appendChild(document.createElement('div')).className = 'wait-wall';
	};

	const removeWaitWall = () => {
		document.querySelector('.wait-wall').remove();
	};

	const takenBy = (e) => {
		if (gameState.isOver === false) {
			setMessage(`This place is already taken by ${e.target.textContent.toUpperCase()}`);

			setTimeout(() => {
				if (gameState.isOver === false) {
					setMessage(`${gameState.turn.toUpperCase()} turn`);
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
		let playerColor;
		if (player === 'o') {
			playerColor = 'blue';
		}

		if (player === 'x') {
			playerColor = 'red';
		}

		for (let i = 0; i < 3; i += 1) {
			areas[condition[i]].classList.add(`${playerColor}Won`);
		}
	};

	const clearHighlight = () => {
		areas.forEach((area) => {
			area.classList.remove('blueWon', 'redWon');
		});
	};

	const restartBoard = () => {
		gameController.restart();
		clearHighlight();
		refreshBoard();
	};

	const resetButtons = () => {
		buttons.forEach((btn) => {
			btn.classList.remove('selected');
		});
	};

	const setButton = (btn) => {
		if (!btn.classList.contains('selected')) {
			restartBoard();
		}
		btn.classList.add('selected');
	};

	const setupButtons = (button, selectedButtons) => {
		button.addEventListener('click', () => {
			resetButtons();
			selectedButtons.forEach(setButton);
		});
	};

	board.addEventListener('click', (e) => {
		takenBy(e);
		const here = parseInt(e.target.getAttribute('data-index'), 10);
		gameController.play(here);
		refreshBoard();
	});

	restartBtn.addEventListener('click', () => restartBoard());

	setupButtons(vsPlayerBtn, [vsPlayerBtn]);
	setupButtons(vsComputerBtn, [vsComputerBtn, easyBtn]);
	setupButtons(easyBtn, [vsComputerBtn, easyBtn]);
	setupButtons(mediumBtn, [vsComputerBtn, mediumBtn]);
	setupButtons(hardBtn, [vsComputerBtn, hardBtn]);

	return { refreshBoard, setMessage, setWaitWall, removeWaitWall, handleWin, handleTie };
})();

gameController.restart();
