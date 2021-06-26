import "./Note.css"

import React, { useReducer } from 'react'

import { initialState, reducer } from '../data/projectData.js'
import clickOrMove from "../data/clickOrMove";
import copyAndPaste from "../data/copyAndPaste";

export default function Note(props) {
    const { id } = props
    const [state, dispatch] = useReducer(reducer, initialState);

    if (!state.notes[id]) return <></>
    const { start, height, duration } = state.notes[id]

    const mouseDown = (e) => {
        e.stopPropagation();
        clickOrMove.allowClick = true
        if (e.shiftKey) {
            if (clickOrMove.allowClick) {
                state.selection.toggleSelection(id)
                clickOrMove.allowClick = false
            }
        }
        else {
            props.noteMouseMove(e, id)
        }
    }

    const mouseUp = (e) => {
        if (e.button !== 0) return;
        if (clickOrMove.allowClick) {
            if (e.shiftKey)
                state.selection.toggleSelection(id)
            else
                state.selection.select(id)
            clickOrMove.allowClick = false
        }
    }

    const onContextMenu = (e) => {
        e.preventDefault()
        props.remove(id)
    }

    const mouseDownHandler = (e) => {
        e.stopPropagation();
        if (e.shiftKey)
            state.selection.addInSelection(id)
        props.scale(e, id)
    }

    return (
        <div
            className={"note"}
            style={{ '--start': start, '--height': height, '--duration': duration }}
            onMouseUp={mouseUp}
            onContextMenu={onContextMenu}
            onMouseDown={mouseDown}
            id={id}>
            {/* {id}::{Math.round(Math.random() * 100)} */}
            < div
                className="duration-handle"
                onMouseDown={mouseDownHandler}
            ></div >
        </div>)
}