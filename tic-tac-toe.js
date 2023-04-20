const gameBoard = (() => {
	const array = ['', '', '', '', '', '', '', '', ''];
	return { array };
})();

// console.log('START:');
// console.log(gameBoard.array);

//---------------------------------------------------------------------------------

const player = (sign) => {
	const placeSign = (place) => {
		if (gameBoard.array[place] === '') {
			gameBoard.array[place] = sign;
		}
	};

	return { placeSign };
};

//---------------------------------------------------------------------------------
let isOver = false;
let turn = true;

const gameController = (() => {
	const board = document.querySelector('.board');

	const player1 = player('o');
	const player2 = player('x');

	console.log('TURN O');

	board.addEventListener('click', (e) => {
		if (e.target.children[0].textContent === '') {
			if (isOver === false) {
				if (turn) {
					console.log('TURN X');
					player1.placeSign(e.target.getAttribute('data-index'));
					turn = !turn;
				} else {
					console.log('TURN O');
					player2.placeSign(e.target.getAttribute('data-index'));
					turn = !turn;
				}
			}
		} else {
			console.log("can't place sign here, place is already taken");
		}

		displayController();

		// console.log('PO KLIKNIĘCIU:');
		// console.log(gameBoard.array);

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

		if (isOver === false) {
			for (let i = 0; i < winConditions.length; i += 1) {
				const condition = winConditions[i];
				if (gameBoard.array[condition[0]] === 'o' && gameBoard.array[condition[1]] === 'o' && gameBoard.array[condition[2]] === 'o') {
					console.log('O WIN !!!');
					isOver = true;
				} else if (gameBoard.array[condition[0]] === 'x' && gameBoard.array[condition[1]] === 'x' && gameBoard.array[condition[2]] === 'x') {
					console.log('X WIN !!!');
					isOver = true;
				} else if (gameBoard.array.every((element) => element !== '')) {
					console.log('DRAW !!!');
					isOver = true;
				}
			}
		}
	});
})();

//---------------------------------------------------------------------------------

const displayController = (() => {
	const refresh = () => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameBoard.array[i];
			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	};

	const restartBtn = document.querySelector('#restartBtn');
	restartBtn.addEventListener('click', () => {
		gameBoard.array = ['', '', '', '', '', '', '', '', ''];
		displayController();

		// console.log('RESTART:');
		// console.log(gameBoard.array);

		isOver = false;
		turn = true;
	});

	return refresh;
})();
