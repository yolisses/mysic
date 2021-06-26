import Selection from './selection';
import { clamp } from '../utils/clamp';
import copyAndPaste from './copyAndPaste';

export const initialState = {
	notes: {},
	_lastAdded: 0,
	getNewId() {
		this._lastAdded++;
		return this._lastAdded;
	},
	selection: new Selection(),
	freezedValues: { notes: {} },
	freezeSelectionValues() {
		this.freezedValues = { notes: {} };
		this.selection.selected.map(
			(index) => (this.freezedValues.notes[index] = { ...this.notes[index] })
		);
	},
	freezeOneNote(id) {
		this.freezedValues = { notes: {} };
		this.freezedValues.notes[id] = { ...this.notes[id] };
	},
	getSelectedNotes() {
		const selectedNotes = {};
		for (let index of this.selection.selected) {
			selectedNotes[index] = this.notes[index];
		}
		return selectedNotes;
	},
	addNote(noteData) {
		const id = this.getNewId();
		this.notes[id] = { ...noteData };
		return id;
	},
};

export function reducer(state, action) {
	const result = (() => {
		const obj = { ...state };
		switch (action.type) {
			case 'add':
				const value = obj.getNewId();
				obj.notes[value] = {
					start: action.start,
					height: action.height,
					duration: 4,
				};
				return obj;

			case 'paste':
				obj.selection.clear();
				Object.values(copyAndPaste.notes).forEach((note) => {
					const id = '' + obj.addNote(note);
					obj.selection.addInSelection(id);
				});
				return obj;

			case 'remove':
				for (let index in obj.freezedValues.notes) {
					delete obj.notes[index];
				}
				return obj;

			case 'scale':
				for (let index in obj.freezedValues.notes) {
					const calculatedDuration =
						obj.freezedValues.notes[index].duration +
						action.position[0] -
						obj.freezedValues.initialMousePosition[0];

					obj.notes[index].duration =
						calculatedDuration >= 0 ? calculatedDuration : 0;
				}
				return obj;

			case 'move':
				for (let index in obj.freezedValues.notes) {
					const calculatedStart =
						obj.freezedValues.notes[index].start +
						action.position[0] -
						obj.freezedValues.initialMousePosition[0];
					const calculatedHeight =
						obj.freezedValues.notes[index].height +
						action.position[1] -
						obj.freezedValues.initialMousePosition[1];

					obj.notes[index].start = calculatedStart >= 0 ? calculatedStart : 0;
					obj.notes[index].height = clamp(calculatedHeight, 0, 88);
				}
				return obj;
			default:
				throw new Error('problem in the reducer code');
		}
	})();
	return result;
}
