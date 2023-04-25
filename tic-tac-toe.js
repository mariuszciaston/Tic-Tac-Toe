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
					const highlight = document.querySelectorAll('.area')[condition[i]];
					highlight.classList.add('blueWon');
				}
			} else if (
				isOver === false &&
				gameBoard.array[condition[0]] === 'x' &&
				gameBoard.array[condition[1]] === 'x' &&
				gameBoard.array[condition[2]] === 'x'
			) {
				displayController.setMessage('X has won!');
				isOver = true;

				for (let i = 0; i < 3; i += 1) {
					const highlight = document.querySelectorAll('.area')[condition[i]];
					highlight.classList.add('redWon');
				}
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
					displayController.setMessage('This place is already taken');
				}
			}
		}

		if (vsComputerBtn.classList.contains('selected')) {
			if (isOver === false) {
				if (gameBoard.array[place] === '') {
					player1.placeSign(place);
					whoWon();

					if (isOver === false) {
						displayController.setMessage('X turn');
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
						}, 1000);
					}
				} else {
					displayController.setMessage('This place is already taken');
				}
			}
		}
	};

	const restart = () => {
		gameBoard.array = ['', '', '', '', '', '', '', '', ''];
		isOver = false;
		turn = 'o';
		displayController.setMessage("Let's start: O turn");

		document.querySelectorAll('.area').forEach((area) => {
			area.classList.remove('blueWon', 'redWon');
		});
	};

	vsPlayerBtn.addEventListener('click', () => {
		vsPlayerBtn.classList.add('selected');
		vsComputerBtn.classList.remove('selected');
		gameController.restart();
		displayController.refresh();
	});

	vsComputerBtn.addEventListener('click', () => {
		vsComputerBtn.classList.add('selected');
		vsPlayerBtn.classList.remove('selected');
		gameController.restart();
		displayController.refresh();
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
	};

	return { refresh, setMessage, statusBox };
})();

gameController.restart();
