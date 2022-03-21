import Grid from "./Grid.js";
import Tile from "./Tile.js";
import Score from "./Score.js";

const gameBoard = document.getElementById("game-board");
const body = document.querySelector("body");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
//My class
const score = new Score();
setupInput();

function setupInput() {
	window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
	switch (e.key) {
		case "ArrowUp":
			if (!canMoveUp()) {
				setupInput();
				return;
			}
			await moveUp();
			break;
		case "ArrowDown":
			if (!canMoveDown()) {
				setupInput();
				return;
			}
			await moveDown();
			break;
		case "ArrowLeft":
			if (!canMoveLeft()) {
				setupInput();
				return;
			}
			await moveLeft();
			break;
		case "ArrowRight":
			if (!canMoveRight()) {
				setupInput();
				return;
			}
			await moveRight();
			break;
		default:
			setupInput();
			return;
	}

	grid.cells.forEach((cell) => cell.mergeTiles());

	const newTile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = newTile;

	//count Point
	score.showScore();
	isWin();
	isLose(newTile);

	setupInput();
}

function moveUp() {
	return slideTiles(grid.cellsByColumn);
}

function moveDown() {
	return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
	return slideTiles(grid.cellsByRow);
}

function moveRight() {
	return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
	return Promise.all(
		cells.flatMap((group) => {
			const promises = [];
			for (let i = 1; i < group.length; i++) {
				const cell = group[i];
				if (cell.tile == null) continue;
				let lastValidCell;
				for (let j = i - 1; j >= 0; j--) {
					const moveToCell = group[j];
					if (!moveToCell.canAccept(cell.tile)) break;
					lastValidCell = moveToCell;
				}

				if (lastValidCell != null) {
					promises.push(cell.tile.waitForTransition());
					if (lastValidCell.tile != null) {
						lastValidCell.mergeTile = cell.tile;
						score.countScore(cell.tile.value);
					} else {
						lastValidCell.tile = cell.tile;
					}
					cell.tile = null;
				}
			}
			return promises;
		})
	);
}

function canMoveUp() {
	return canMove(grid.cellsByColumn);
}

function canMoveDown() {
	return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
	return canMove(grid.cellsByRow);
}

function canMoveRight() {
	return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
	return cells.some((group) => {
		return group.some((cell, index) => {
			if (index === 0) return false;
			if (cell.tile == null) return false;
			const moveToCell = group[index - 1];
			return moveToCell.canAccept(cell.tile);
		});
	});
}

//My "improvement":) or impoverish

function isWin() {
	const allTiles = document.querySelectorAll(".tile");

	allTiles.forEach((tile) => {
		if (tile === undefined) return;
		if (tile.innerText === "855") {
			win(score);
		}
	});
}

function isLose(newTile) {
	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			lose();
		});
		return;
	}
}

function win(score) {
	body.innerHTML = `<div class="win">
	<h1>You Win!!!</h1>
	<h2>Congratulations</h2>
	<h3>Score: ${score}</h3>
	<h3>Pass: </h3>
	<button id="reset">Reset</button>
</div>`;

	const reset = document.getElementById("reset");
	reset.addEventListener("click", () => {
		location.reload();
	});
}

function lose() {
	const score = document.querySelector(".score").innerText;

	body.innerHTML = `<div class="win">
	<h1>You lose!!!</h1>
	<h2>Try again</h2>
	<h3>Score: ${score}</h3>
	<button id="reset">Reset</button>
</div>`;

	const reset = document.getElementById("reset");
	reset.addEventListener("click", () => {
		location.reload();
	});
}
