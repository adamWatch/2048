export default class Themes {
	#game;
	#background;

	constructor(gameboard, body) {
		this.#game = gameboard;
		this.#background = body;
	}

	changeToSynth() {
		this.#game.style.setProperty(
			"--gameboard-background-color",
			"rgb(148, 6, 148)"
		);
		this.#game.style.setProperty("--cell-background-color", "rgb(158, 5, 82)");
		this.#game.style.setProperty("--tile-color", "287");
		this.#background.style.setProperty(
			"--score-container-color",
			"rgb(180, 7, 180)"
		);
		this.#background.style.setProperty("--score-color", "azure");
		this.#background.style.setProperty("--theme_btn-color", "grey");
		this.#background.style.setProperty("--theme_btn-background-color", "black");
		this.#background.style.setProperty("background-image", 'url("Synth.png")');
	}

	changeToOrginal() {
		this.#game.style.setProperty("--gameboard-background-color", "#ccc");
		this.#game.style.setProperty("--cell-background-color", "#aaa");
		this.#game.style.setProperty("--tile-color", "200");
		this.#background.style.setProperty(
			"--score-container-color",
			"rgb(218, 216, 216)"
		);
		this.#background.style.setProperty("--score-color", "black");
		this.#background.style.setProperty("--theme_btn-color", "azure");
		this.#background.style.setProperty(
			"--theme_btn-background-color",
			"purple"
		);
		this.#background.style.setProperty("background-image", "none");
	}
}
