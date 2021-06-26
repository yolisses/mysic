export function redisplay(selected) {
	[...document.getElementsByClassName('selected')].forEach((element) => {
		element.classList.remove('selected');
	});

	let elements = [];
	elements = [...document.getElementsByClassName('note')].filter((item) =>
		selected.includes(item.getAttribute('id'))
	);
	elements.forEach((element) => {
		element.classList.add('selected');
	});
}
