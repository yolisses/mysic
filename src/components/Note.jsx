import "./Note.css"

import React, { useReducer } from 'react'

import { initialState, reducer } from '../data/projectData.js'
import clickOrMove from "../data/clickOrMove";

export default function Note(props) {
    const { id } = props
    const [state, dispatch] = useReducer(reducer, initialState);

    if (!state.notes[id]) return <></>
    const { start, height, duration } = state.notes[id]

    const onContextMenu = (e) => {
        e.preventDefault()
        dispatch({ type: 'remove', id })
    }

    const mouseDown = (e) => {
        e.stopPropagation();
        clickOrMove.allowClick = true
        if (!e.shiftKey)
            props.move(e, id)
        else {
            if (clickOrMove.allowClick) {
                if (e.shiftKey)
                    state.selection.toggleSelection(id)
                else
                    state.selection.select(id)
                clickOrMove.allowClick = false
            }
        }
    }

    const mouseUp = (e) => {
        // e.stopPropagation();

        if (e.button !== 0) return;
        if (clickOrMove.allowClick) {
            if (e.shiftKey)
                state.selection.toggleSelection(id)
            else
                state.selection.select(id)
            clickOrMove.allowClick = false
        }
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