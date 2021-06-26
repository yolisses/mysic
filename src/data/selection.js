import redisplay from '../components/selectionDisplayer';

export default class Selection {
	constructor() {
		this.selected = [];
	}

	setSelected(newArray) {
		this.selected = newArray;
		redisplay(this.selected);
	}

	select(id) {
		this.selected.length = 0;
		this.selected.push(id);
		redisplay(this.selected);
	}

	addInSelection(id) {
		if (!this.selected.includes(id)) {
			this.selected.push(id);
		}
		redisplay(this.selected);
	}

	toggleSelection(id) {
		if (!this.selected.includes(id)) {
			this.selected.push(id);
		} else {
			this.selected.splice(this.selected.indexOf(id), 1);
		}
		redisplay(this.selected);
	}

	clear() {
		this.selected.length = 0;
		redisplay(this.selected);
	}

	isEmpty() {
		return this.selected.length === 0;
	}
}
