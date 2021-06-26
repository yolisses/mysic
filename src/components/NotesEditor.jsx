import { React, useEffect, useReducer, useRef, useState } from 'react';
import { initialState, reducer } from '../data/projectData';

import Note from './Note'
import { clamp } from '../utils/clamp';
import clickOrMove from '../data/clickOrMove';
import copyAndPaste from '../data/copyAndPaste';
import { redisplay } from './selectionDisplayer';

import "./NotesEditor.css";
import { boxSelection } from '../data/boxSelection';

const html = document.querySelector('html')

function NotesEditor() {

    const umaRef = useRef(null);
    const outraRef = useRef(null)

    const [state, dispatch] = useReducer(reducer, initialState)
    const [reselect, setReselect] = useState(false)

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
        event.stopPropagation()
        event.preventDefault()

        if (event.button !== 0) return

        selectBox(event)

        clickOrMove.allowClick = true
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
        umaRef.current.focus()
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

    function noteMouseMove(event, id) {
        if (!event.ctrlKey) {
            move(event, id)
        } else {
            duplicate(event)
            move(event, id)
        }
    }

    function duplicate(id) {
        if (state.selection.selected.includes(id)) {
            state.freezeSelectionValues()
        }
        else {
            state.freezeOneNote(id)
        }
        dispatch({ type: 'duplicate' })
        setReselect(true)
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
            // if (e.ctrlKey)
            //     position[0] = initialPosition[0]
            clickOrMove.allowClick = false
            dispatch({ type: 'move', position })
        }
        html.onmouseup = () => {
            html.onmousemove = null
        }
    }

    function remove(id) {
        if (state.selection.selected.includes(id)) {
            state.freezeSelectionValues()
        }
        else {
            state.freezeOneNote(id)
        }
        clickOrMove.allowClick = false
        dispatch({ type: 'remove', id })
    }

    function selectBox(event) {
        state.freezeSelectionValues()

        outraRef.current.style.width = 0;
        outraRef.current.style.height = 0;

        html.onmousemove = (e) => {
            clickOrMove.allowClick = false
            outraRef.current.style.display = 'block'
            const [xStart, xEnd] = [event.clientX, e.clientX].sort((a, b) => a - b)
            const [yStart, yEnd] = [event.clientY, e.clientY].sort((a, b) => a - b)

            outraRef.current.style.left = xStart + umaRef.current.scrollLeft + 'px';
            outraRef.current.style.top = yStart + umaRef.current.scrollTop + 'px';

            outraRef.current.style.width = xEnd - xStart + 'px';
            outraRef.current.style.height = yEnd - yStart + 'px';

            boxSelection({
                state,
                initialPosition: pixelToPosition(xStart, yStart),
                finalPosition: pixelToPosition(xEnd, yEnd),
                keepInitialSelection: e.shiftKey
            })
        }

        html.onmouseup = () => {
            outraRef.current.style.display = 'none'
            clickOrMove.allowClick = true
            html.onmousemove = null
        }
    }

    function onCopy(event) {
        copyAndPaste.setNotes(state.getSelectedNotes())
    }

    function onPaste(event) {
        dispatch({ type: 'paste', autoSelect: true })
        setReselect(true)
    }

    useEffect(() => {
        if (reselect) {
            setReselect(false)
            redisplay(state.selection.selected)
        }
    }, [reselect, state.selection.selected]);

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
            tabIndex="0"
            // onKeyPress={onKeyPress}
            onCopy={onCopy}
            onPaste={onPaste}
        >
            {Object.keys(state.notes).map(key =>
                <Note
                    id={key}
                    key={key}
                    scale={scale}
                    move={move}
                    remove={remove}
                    duplicate={duplicate}
                    noteMouseMove={noteMouseMove}
                >
                </Note>)}
            <div className="select-box" ref={outraRef}></div>
        </div>
    );
}

export default NotesEditor