import { React, useEffect } from 'react';
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

function onClick(event) {
    if (event.button == 0) {
        console.log('esquerdo')
    }

    if (event.button == 2) {
        console.log('direito')
    }

    event.preventDefault()
    event.stopPropagation()
}

function NotesEditor() {
    let { notes } = useNotes()

    useEffect(() => { editor = document.querySelector('.notes-editor') })

    return (
        // tabindex specifically to listen keypress
        <div className="notes-editor" onKeyPress={keyPress} tabIndex="0"
            onClick={onClick} onContextMenu={onClick}>
            <div id="space">
                {
                    notes.map((note, index) =>
                        (<Note note={note} key={index} id={'note' + index}></Note>))
                }
            </div>
        </div>
    );
}

export default NotesEditor