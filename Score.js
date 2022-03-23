export default class Score {
	#result = 0;

	constructor() {}

	countScore(tile) {
		Number((this.#result += tile));
	}

	get result() {
		return this.#result;
	}

	showScore() {
		const resultSpan = document.querySelector(".score");
		resultSpan.innerText = this.#result;
	}
}
