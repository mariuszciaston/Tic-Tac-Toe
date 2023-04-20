const gameBoard = (() => {
	const array = ['', '', '', '', '', '', '', '', ''];
	return { array };
})();

console.log('START:');
console.log(gameBoard.array);

//---------------------------------------------------------------------------------

const player = (sign) => {
	const placeSign = (place) => {
		if (gameBoard.array[place] === '') {
			gameBoard.array[place] = sign;
		} else {
			console.log("can't place sign here, place is already taken");
		}
	};
	return { placeSign };
};

const player1 = player('o');
const player2 = player('x');

// player1.placeSign(0);
// player1.placeSign(1);
// player1.placeSign(2);

// player2.placeSign(3);
// player2.placeSign(4);
// player2.placeSign(5);

console.log('MANUAL PLACEMENT:');
console.log(gameBoard.array);

//---------------------------------------------------------------------------------

const gameController = (() => {
	let turn = true;
	const board = document.querySelector('.board');

	board.addEventListener('click', (e) => {
		if (turn) {
			player1.placeSign(e.target.getAttribute('data-index'));
			turn = !turn;
		} else {
			player2.placeSign(e.target.getAttribute('data-index'));
			turn = !turn;
		}

		displayController();

		console.log('PO KLIKNIĘCIU:');
		console.log(gameBoard.array);

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
				console.log('o win');
			} else if (gameBoard.array[condition[0]] === 'x' && gameBoard.array[condition[1]] === 'x' && gameBoard.array[condition[2]] === 'x') {
				console.log('x win');
			}
		}
	});
})();

//---------------------------------------------------------------------------------

const displayController = (() => {
	const restartBtn = document.querySelector('#restartBtn');
	const refresh = () => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameBoard.array[i];
			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	};

	restartBtn.addEventListener('click', () => {
		gameBoard.array = ['', '', '', '', '', '', '', '', ''];
		displayController();

		console.log('RESTART:');
		console.log(gameBoard.array);
	});

	return refresh;
})();
