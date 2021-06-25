import Selection from './selection';

export const initialState = {
	notes: {},
	_lastAdded: 0,
	getNewId() {
		this._lastAdded++;
		return this._lastAdded;
	},
	selection: new Selection(),
	freezedValues: {},
	freezeSelectionValues() {
		this.freezedValues = {};
		this.selection.selected.map(
			(index) => (this.freezedValues[index] = { ...this.notes[index] })
		);
		console.log(this.freezedValues);
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
				obj.selection.selected.map((index) => {
					obj.notes[index].duration =
						obj.freezedValues[index].duration +
						action.position[0] -
						obj.freezedValues.initialMousePosition[0];
				});
				return obj;

			default:
				throw new Error("Reducer error, verify the function you're calling");
		}
	})();
	return result;
}
