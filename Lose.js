export default class Win {
	constructor(body, score) {
		body.innerHTML = `<div class="lose">
		<h1>You Lose!!!</h1>
		<h3>Score: ${score}</h3>
        <h2>Try Again</h2>
		<button id="reset">Reset</button>
	</div>`;

		const reset = document.getElementById("reset");
		reset.addEventListener("click", () => {
			location.reload();
		});
	}
}
