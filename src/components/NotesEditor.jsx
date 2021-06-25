import { React, useReducer, useRef } from 'react';
import { initialState, reducer } from '../data/projectData';

import Note from './Note'

import "./NotesEditor.css";

const html = document.querySelector('html')

function NotesEditor() {

    const umaRef = useRef(null);

    const [state, dispatch] = useReducer(reducer, initialState)

    function eventToPosition(event) {
        const start = (event.clientX + umaRef.current.scrollLeft) / 20
        const height = Math.floor((event.clientY + umaRef.current.scrollTop) / 20)
        return [start, height]
    }

    function mouseDown(event) {
        if (event.button === 0) {
            if (!state.selection.isEmpty()) {
                state.selection.clear()
            } else {
                const [start, height] = eventToPosition(event)
                dispatch({ type: 'add', start, height })
            }
        }

        event.stopPropagation()
        event.preventDefault()
    }

    function scale(event) {
        state.marcador = true
        state.freezeSelectionValues()
        state.freezedValues.initialMouseEvent = event
        state.freezedValues.initialMousePosition = eventToPosition(event)
        html.onmousemove = (e) => {
            dispatch({ type: 'scale', position: eventToPosition(e) })
        }
        html.onmouseup = () => {
            html.onmousemove = null
        }
    }

    return (
        // tabindex specifically to listen keypress
        <div
            className="notes-editor"
            tabIndex="0"
            onMouseDown={mouseDown}
            id="space"
            ref={umaRef}
        >
            {
                Object.keys(state.notes).map(key =>
                    <Note
                        id={key}
                        key={key}
                        scale={scale}
                    >
                        {key}
                    </Note>)
            }
        </div>
    );
}

export default NotesEditor