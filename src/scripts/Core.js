var notify

window.addEventListener("load", e=>{

	notify = new Alrt({
		position: "top-center",
		duration: 2000, //default duration
		theme: "bitshift-confirmation",
		behavior: "overwrite",
	});
})