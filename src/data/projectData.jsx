import redisplay from "../components/selectionDisplayer"

export const initialState = {
    notes: {},
    _lastAdded: 0,
    getNewId() { this._lastAdded++; return this._lastAdded },
    selected: []
}

export function reducer(state, action) {

    // if (action.type === 'add') {
    //     const obj = { ...state }
    //     const value = obj.getNewId()
    //     console.log(value)
    //     console.log(state.notes)
    //     obj.notes[value] = {
    //         start: action.start,
    //         height: action.height,
    //         duration: 4,
    //     }
    //     return obj
    // }

    // if (action.type === 'remove') {
    //     const obj = { ...state }
    //     delete obj.notes[action.id]
    //     return obj
    // }

    // if (action.type === 'select') {
    //     const obj = { ...state }
    //     obj.selected = [action.id]
    //     return obj
    // }


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
            return obj

        case 'select':
            obj.selected = [action.id]
            redisplay(obj.selected)
            console.log(obj)

            return obj

        case 'addIntoSelection':
            obj.selected.push(action.id)
            redisplay(obj.selected)
            // console.log(obj.selected)
            console.log(obj)
            return obj

        default:
            throw "Reducer error, verify the function you're calling";
    }
}