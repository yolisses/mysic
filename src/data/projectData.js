import Selection from './selection';

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

			case 'remove':
				delete obj.notes[action.id];
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
					obj.notes[index].height =
						calculatedHeight >= 0 && calculatedHeight <= 88
							? calculatedHeight
							: 88;
				}
				return obj;

			case 'selectBox':
				obj.selection.clear();
				for (let index in obj.notes) {
					if (
						obj.notes[index].start > action.initialPosition[0] &&
						obj.notes[index].start < action.finalPosition[0] &&
						obj.notes[index].height > action.initialPosition[1] &&
						obj.notes[index].height < action.finalPosition[1]
					) {
						obj.selection.addInSelection(index);
					}
				}
				return obj;

			default:
				throw new Error("Reducer error, verify the function you're calling");
		}
	})();
	return result;
}
