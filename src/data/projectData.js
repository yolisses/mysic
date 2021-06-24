import Selection from './selection';

export const initialState = {
	notes: {},
	_lastAdded: 0,
	getNewId() {
		this._lastAdded++;
		return this._lastAdded;
	},
	selection: new Selection(),
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

			default:
				throw new Error("Reducer error, verify the function you're calling");
		}
	})();
	return result;
}
