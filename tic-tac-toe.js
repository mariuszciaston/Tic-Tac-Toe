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
			}

			if (gameBoard.array[condition[0]] === 'x' && gameBoard.array[condition[1]] === 'x' && gameBoard.array[condition[2]] === 'x') {
				displayController.setMessage('X has won!');
				isOver = true;
			}
		}

		if (isOver === false) {
			if (gameBoard.array.every((element) => element !== '')) {
				displayController.setMessage("It's a draw!");
				isOver = true;
			}
		}
	};

	const play = (place) => {
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
				displayController.setMessage('This place is already taken');
			}
		}
	};

	const restart = () => {
		gameBoard.array = ['', '', '', '', '', '', '', '', ''];
		isOver = false;
		turn = 'o';
		displayController.setMessage("Let's start: O turn");
	};

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
	};

	return { refresh, setMessage, statusBox };
})();

gameController.restart();
