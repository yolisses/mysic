export const initialState = {
    notes: {
        0: {
            start: 1,
            height: 2,
            duration: 3
        },
        1: {
            start: 4,
            height: 5,
            duration: 6
        },
        2: {
            start: 7,
            height: 8,
            duration: 9
        }
    },
    _lastAdded: 3,
    getNewId() { return this._lastAdded++ }
}

export function reducer(state, action) {
    const obj = { ...state }
    switch (action.type) {
        case 'add':
            const value = obj.getNewId()
            obj.notes[value] = {
                start: action.start,
                height: action.height,
                duration: 4,
            }
            return obj
        case 'remove':
            delete state.notes[action.id]
            // obj.notes[value]
            return obj
        default:
    }
}