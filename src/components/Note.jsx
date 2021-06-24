import "./Note.css"

import React, { useReducer } from 'react'

import { initialState, reducer } from '../data/projectData.jsx'

export default function Note(props) {
    const { id } = props

    const [state, dispatch] = useReducer(reducer, initialState);

    if (!state.notes[id]) return <></>
    const { start, height, duration } = state.notes[id]

    // const { setAsFocusActionList } = useNotes()

    // const { startMove } = useNotes()
    // const { startScale } = useNotes()
    // const { removeNote } = useNotes()

    const onContextMenu = (e) => {
        e.preventDefault()
        dispatch({ type: 'remove', id })
    }

    // const onMouseDown = (e) => {
    //     e.stopPropagation();
    //     if (e.button !== 0) return;
    //     setAsFocusActionList(props.note, (start, height) => {
    //         setStart(start);
    //         setHeight(height)
    //     })
    //     startMove();
    // }

    // const handlerMouseDown = (e) => {
    //     e.stopPropagation();
    //     setAsFocusActionList(props.note, setDuration);
    //     startScale(e);
    // }

    // useEffect(() => {
    //     setStart(props.note.start)
    //     setHeight(props.note.height)
    //     setDuration(props.note.duration)
    // }, [props.note.start, props.note.height, props.note.duration])

    return (
        <div
            className='note'
            style={{ '--start': start, '--height': height, '--duration': duration }}
            onContextMenu={onContextMenu}
            id={id}>
            < div className="duration-handle">
            </div >
        </div>)
}

// onMouseDown = { handlerMouseDown }
// onMouseDown = { onMouseDown }