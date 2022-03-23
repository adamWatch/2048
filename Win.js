export default class Win {
	constructor(body, score) {
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
}
