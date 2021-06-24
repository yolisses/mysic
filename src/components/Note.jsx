import "./Note.css"

import React, { useReducer } from 'react'

import { initialState, reducer } from '../data/projectData.jsx'

export default function Note(props) {
    const { id } = props
    const [state, dispatch] = useReducer(reducer, initialState);

    if (!state.notes[id]) return <></>
    const { start, height, duration } = state.notes[id]

    const onContextMenu = (e) => {
        e.preventDefault()
        dispatch({ type: 'remove', id })
    }

    const mouseDown = function (e) {
        e.stopPropagation();
        if (e.button !== 0) return;
        if (e.shiftKey)
            state.selection.toggleSelection(id)
        else
            state.selection.select(id)
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
            className={"note"}
            style={{ '--start': start, '--height': height, '--duration': duration }}
            onContextMenu={onContextMenu}
            onMouseDown={mouseDown}
            id={id}>
            {id}::{Math.round(Math.random() * 100)}
            < div className="duration-handle">
            </div >
        </div>)
}

// onMouseDown = { handlerMouseDown }
// onMouseDown = { onMouseDown }