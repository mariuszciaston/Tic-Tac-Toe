const gameBoard = (() => {
	const array = ['', '', '', '', '', '', '', '', ''];
	return { array };
})();

console.log('START:');
console.log(gameBoard.array);

const game = (sign) => {
	const placeSign = (place) => {
		if (gameBoard.array[place] === '') {
			gameBoard.array[place] = sign;
		} else {
			console.log("can't place sign here, place is already taken");
		}
	};
	return { placeSign };
};

const player1 = game('o');
// player1.placeSign(0);
// player1.placeSign(1);
// player1.placeSign(2);

const player2 = game('x');
// player2.placeSign(3);
// player2.placeSign(4);
// player2.placeSign(5);

const board = document.querySelector('.board');
board.addEventListener('click', (e) => {
	player1.placeSign(e.target.getAttribute('data-index'));

	console.log('PO KLIKNIĘCIU:');
	console.log(gameBoard.array);

	const displayController = (() => {
		for (let i = 0; i < 9; i += 1) {
			const area = document.querySelector(`[data-index="${i}"] > span`);
			area.textContent = gameBoard.array[i];
			area.classList.toggle('red', area.textContent === 'x');
			area.classList.toggle('blue', area.textContent === 'o');
		}
	})();

	// winConditions
	if (
		(gameBoard.array[0] && gameBoard.array[1] && gameBoard.array[2]) === 'o' ||
		(gameBoard.array[3] && gameBoard.array[4] && gameBoard.array[5]) === 'o' ||
		(gameBoard.array[6] && gameBoard.array[7] && gameBoard.array[8]) === 'o' ||
		(gameBoard.array[0] && gameBoard.array[3] && gameBoard.array[6]) === 'o' ||
		(gameBoard.array[1] && gameBoard.array[4] && gameBoard.array[7]) === 'o' ||
		(gameBoard.array[2] && gameBoard.array[5] && gameBoard.array[8]) === 'o' ||
		(gameBoard.array[0] && gameBoard.array[4] && gameBoard.array[8]) === 'o' ||
		(gameBoard.array[2] && gameBoard.array[4] && gameBoard.array[6]) === 'o'
	) {
		console.log('o win');
	}

	if (
		(gameBoard.array[0] && gameBoard.array[1] && gameBoard.array[2]) === 'x' ||
		(gameBoard.array[3] && gameBoard.array[4] && gameBoard.array[5]) === 'x' ||
		(gameBoard.array[6] && gameBoard.array[7] && gameBoard.array[8]) === 'x' ||
		(gameBoard.array[0] && gameBoard.array[3] && gameBoard.array[6]) === 'x' ||
		(gameBoard.array[1] && gameBoard.array[4] && gameBoard.array[7]) === 'x' ||
		(gameBoard.array[2] && gameBoard.array[5] && gameBoard.array[8]) === 'x' ||
		(gameBoard.array[0] && gameBoard.array[4] && gameBoard.array[8]) === 'x' ||
		(gameBoard.array[2] && gameBoard.array[4] && gameBoard.array[6]) === 'x'
	) {
		console.log('x win');
	}
});

const displayController = (() => {
	for (let i = 0; i < 9; i += 1) {
		const area = document.querySelector(`[data-index="${i}"] > span`);
		area.textContent = gameBoard.array[i];
		area.classList.toggle('red', area.textContent === 'x');
		area.classList.toggle('blue', area.textContent === 'o');
	}
})();
