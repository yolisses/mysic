import { React, ReactDOM, useEffect } from 'react';
import Note from './Note'

import { useNotes } from '../contexts/NotesContext'

import "./NotesEditor.css";

const zoom_step = 5;

export let editor = document.querySelector('.notes-editor')

export function getAtualScale() {
    return parseInt(document.documentElement.style.getPropertyValue('--scale'))
}

export function setActualScale(value) {
    document.documentElement.style.setProperty('--scale', value);
}

function zoom_in() {
    const actual = getAtualScale() || 10
    setActualScale(actual + zoom_step);
}

function zoom_out() {
    const actual = getAtualScale() || 10
    setActualScale((actual - zoom_step));
}

(function scale_init() {
    setActualScale(20);
})()

export function pixelToXPosition(positionInPixels) {
    return (positionInPixels + editor.scrollLeft) / getAtualScale()
}

export function pixelToYPosition(positionInPixels) {
    return parseInt((positionInPixels + editor.scrollTop - 80) / 20)
}

const keyMap = {
    '+': zoom_in,
    '-': zoom_out
}

function keyPress(event) {
    console.log(event)
    const callBack = keyMap[event.key]
    if (callBack) callBack();
}



function NotesEditor() {
    let { notes, addNote } = useNotes()

    useEffect(() => {
        editor = document.querySelector('.notes-editor')
        editor.oncontextmenu = (e) => {
            e.preventDefault()
        };
    })

    function onClick(event) {
        if (event.button == 0) {
            const start = pixelToXPosition(event.screenX)
            const height = pixelToYPosition(event.screenY)
            addNote(start, height)
        }

        if (event.button == 2) {
            console.log('direito')
        }

        event.stopPropagation()
        event.preventDefault()
    }

    return (
        // tabindex specifically to listen keypress
        <div className="notes-editor" onKeyPress={keyPress} tabIndex="0"
            onMouseDown={onClick}
            // onContextMenu={onClick}
            id="space">
            {
                notes.map((note, index) => {
                    if (note) {
                        return (<Note note={note}
                            key={index}
                            id={'note' + index}></Note>)
                    }
                })
            }
        </div>
    );
}

export default NotesEditor