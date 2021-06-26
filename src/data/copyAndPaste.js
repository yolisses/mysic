const copyAndPaste = {
	notes: {},
	setNotes(notes) {
		this.notes = {};
		for (let index in notes) {
			this.notes[index] = { ...notes[index] };
		}
	},
};

export default copyAndPaste;
