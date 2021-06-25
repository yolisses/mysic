import { React, useReducer, useRef, useState } from 'react';
import clickOrMove from '../data/clickOrMove';
import { initialState, reducer } from '../data/projectData';
import { clamp } from '../utils/clamp';

import Note from './Note'

import "./NotesEditor.css";

const html = document.querySelector('html')

function NotesEditor() {

    const umaRef = useRef(null);

    const [state, dispatch] = useReducer(reducer, initialState)

    const [zoom, setZoom] = useState(20)

    function eventToPosition(event) {
        const start = (event.clientX + umaRef.current.scrollLeft) / zoom
        const height = Math.floor((event.clientY + umaRef.current.scrollTop) / 20)
        return [start, height]
    }

    function mouseDown(event) {
        if (event.button === 0) {
            if (!state.selection.isEmpty()) {
                if (!event.shiftKey)
                    state.selection.clear()
            } else {
                const [start, height] = eventToPosition(event)
                dispatch({ type: 'add', start, height })
                clickOrMove.allowClick = false
            }
        }

        event.stopPropagation()
        event.preventDefault()
    }

    function scale(event, id) {
        if (state.selection.selected.includes(id)) {
            state.freezeSelectionValues()
        }
        else {
            state.freezeOneNote(id)
        }
        // state.freezedValues.initialMouseEvent = event
        state.freezedValues.initialMousePosition = eventToPosition(event)
        html.onmousemove = (e) => {
            dispatch({ type: 'scale', position: eventToPosition(e) })
        }
        html.onmouseup = () => {
            html.onmousemove = null
        }
    }

    function move(event, id) {
        if (state.selection.selected.includes(id)) {
            state.freezeSelectionValues()
        }
        else {
            state.freezeOneNote(id)
        }
        const initialPosition = eventToPosition(event)
        state.freezedValues.initialMousePosition = initialPosition
        html.onmousemove = (e) => {
            const position = eventToPosition(e)
            if (e.shiftKey)
                position[1] = initialPosition[1]
            if (e.ctrlKey)
                position[0] = initialPosition[0]
            clickOrMove.allowClick = false
            dispatch({ type: 'move', position })
        }
        html.onmouseup = () => {
            html.onmousemove = null
        }
    }

    function onWheel(event) {
        if (event.shiftKey) {
            umaRef.current.style.overflow = 'hidden'
            const calculatedZoom = clamp(zoom + 0.005 * event.deltaY, 1, 100)
            setZoom(calculatedZoom)
        } else {
            umaRef.current.style.overflow = 'auto'
        }
    }

    function onKeyPress(e) {
        console.log(e)
        console.log('oi')
    }

    return (
        // tabindex specifically to listen keypress
        <div
            className="notes-editor"
            onMouseDown={mouseDown}
            id="space"
            ref={umaRef}
            style={{
                "--scale": zoom,
            }}
            onWheel={onWheel}
        >
            {Object.keys(state.notes).map(key =>
                <Note
                    id={key}
                    key={key}
                    scale={scale}
                    move={move}
                >
                    {key}
                </Note>)}
        </div>
    );
}

export default NotesEditor