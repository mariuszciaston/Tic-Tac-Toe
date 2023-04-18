const gameBoard = (() => {
	const array = ['x', '', '', '', 'o', '', '', '', 'x'];
	return { array };
})();

const displayController = (() => {
	for (let i = 0; i < 9; i++) {
		const area = document.querySelector(`#area-${i} > span`);
		area.textContent = gameBoard.array[i];
		area.textContent === 'x' ? area.classList.add('red') : area.classList.remove('red');
		area.textContent === 'o' ? area.classList.add('blue') : area.classList.remove('blue');
	}
})();
