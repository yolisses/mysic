import { React, useReducer, useRef, useState } from 'react';
import clickOrMove from '../data/clickOrMove';
import { initialState, reducer } from '../data/projectData';
import { clamp } from '../utils/clamp';

import Note from './Note'

import "./NotesEditor.css";

const html = document.querySelector('html')

function NotesEditor() {

    const umaRef = useRef(null);
    const outraRef = useRef(null)

    const [state, dispatch] = useReducer(reducer, initialState)

    const [zoom, setZoom] = useState(20)

    function eventToPosition(event) {
        return pixelToPosition(event.clientX, event.clientY)
    }

    function pixelToPosition(x, y) {
        const start = (x + umaRef.current.scrollLeft) / zoom
        const height = Math.floor((y + umaRef.current.scrollTop) / 20)
        return [start, height]
    }

    function mouseDown(event) {
        if (event.button !== 0) return

        selectBox(event)

        clickOrMove.allowClick = true

        event.stopPropagation()
        event.preventDefault()
    }

    function mouseUp(event) {
        if (event.button !== 0) return
        if (!clickOrMove.allowClick) return

        if (!state.selection.isEmpty()) {
            if (!event.shiftKey)
                state.selection.clear()
        } else {
            const [start, height] = eventToPosition(event)
            dispatch({ type: 'add', start, height })
            clickOrMove.allowClick = false
        }
    }

    function scale(event, id) {
        if (state.selection.selected.includes(id)) {
            state.freezeSelectionValues()
        }
        else {
            state.freezeOneNote(id)
        }
        state.freezedValues.initialMousePosition = eventToPosition(event)
        html.onmousemove = (e) => {
            clickOrMove.allowClick = false
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

    function selectBox(event) {
        state.freezeSelectionValues()


        outraRef.current.style.display = 'block'

        outraRef.current.style.width = 0;
        outraRef.current.style.height = 0;

        html.onmousemove = (e) => {
            clickOrMove.allowClick = false
            const [xStart, xEnd] = [event.clientX, e.clientX].sort((a, b) => a - b)
            const [yStart, yEnd] = [event.clientY, e.clientY].sort((a, b) => a - b)

            outraRef.current.style.left = xStart + 'px';
            outraRef.current.style.top = yStart + 'px';

            outraRef.current.style.width = xEnd - xStart + 'px';
            outraRef.current.style.height = yEnd - yStart + 'px';

            const startPosition = eventToPosition(e)
            dispatch({
                type: 'selectBox',
                initialPosition: pixelToPosition(xStart, yStart),
                finalPosition: pixelToPosition(xEnd, yEnd)
            })
        }

        html.onmouseup = () => {
            outraRef.current.style.display = 'none'
            clickOrMove.allowClick = true
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

    return (
        <div
            className="notes-editor"
            onMouseDown={mouseDown}
            id="space"
            ref={umaRef}
            style={{
                "--scale": zoom,
            }}
            onWheel={onWheel}
            onMouseUp={mouseUp}
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
            {/* <SelectBox ref={selectBoxRef}></SelectBox> */}
            <div className="select-box" ref={outraRef}></div>
        </div>
    );
}

export default NotesEditor