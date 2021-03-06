import Grid from "./Grid.js";
import Tile from "./Tile.js";
import Score from "./Score.js";
import Win from "./Win.js";
import Lose from "./Lose.js";
import Themes from "./Themes.js";

const gameBoard = document.getElementById("game-board");
const body = document.querySelector("body");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
//My class
const score = new Score();
setupInput();
//To TouchControl
const coordinates = [];
//Theme Class
const themeBtn = document.querySelector(".theme__btn");
themeBtn.addEventListener("click", () => {
	gameBoard.classList.toggle("synth");
	if (gameBoard.classList.contains("synth")) {
		const themes = new Themes(gameBoard, body);
		themes.changeToSynth();
	} else {
		const themes = new Themes(gameBoard, body);
		themes.changeToOrginal();
	}
});

function setupInput() {
	window.addEventListener("keydown", handleInput, { once: true });

	gameBoard.addEventListener(
		"touchstart",
		(e) => {
			coordinates.splice(0, coordinates.length);
			checkTouchStart(e);
		},
		{ once: true }
	);

	gameBoard.addEventListener(
		"touchend",
		(e) => {
			checkTouchEnd(e);
			const direction = setDirection();
			handleInput(e, direction);
		},
		{ once: true }
	);
}

async function handleInput(e, direction) {
	switch (direction || e.key) {
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
		case "up":
			if (!canMoveUp()) {
				setupInput();
				return;
			}
			await moveUp();
			break;
		case "down":
			if (!canMoveDown()) {
				setupInput();
				return;
			}
			await moveDown();
			break;
		case "left":
			if (!canMoveLeft()) {
				setupInput();
				return;
			}
			await moveLeft();
			break;
		case "right":
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
		if (tile.innerText === "2048") {
			const win = new Win(body, score.result);
		}
	});
}

function isLose(newTile) {
	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			const lose = new Lose(body, score.result);
		});
		return;
	}
}

//Touch Control

function checkTouchStart(e) {
	e.preventDefault();

	const x = e.touches[0].clientX;
	const y = e.touches[0].clientY;

	coordinates.push(x, y);
}

function checkTouchEnd(e) {
	const x = e.changedTouches[0].clientX;
	const y = e.changedTouches[0].clientY;

	coordinates.push(x, y);
}

function setDirection() {
	const xStart = coordinates[0];
	const yStart = coordinates[1];
	const xEnd = coordinates[2];
	const yEnd = coordinates[3];

	//Move axis X
	if (Math.abs(xStart - xEnd) > Math.abs(yStart - yEnd)) {
		if (xStart > xEnd) {
			return "left";
		} else {
			return "right";
		}
	}
	//Move axis Y
	else if (Math.abs(xStart - xEnd) < Math.abs(yStart - yEnd)) {
		if (yStart > yEnd) {
			return "up";
		} else {
			return "down";
		}
	}
}
