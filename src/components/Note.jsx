import "./Note.css"

import React, { useEffect, useState } from 'react'

import { useNotes } from '../contexts/NotesContext'

export default function Note(props) {
    const { id } = props

    const { startMove, addToMoving } = useNotes()
    const { startScale, addToScaling } = useNotes()
    const { removeNote } = useNotes()

    const [start, setStart] = useState(props.note.start)
    const [height, setHeight] = useState(props.note.height)
    const [duration, setDuration] = useState(props.note.duration)

    const onContextMenu = (e) => {
        removeNote(props.note)
        e.preventDefault()
    }

    const onMouseDown = (e) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        addToMoving(props.note, setStart, setHeight);
        startMove();
    }

    const handlerMouseDown = (e) => {
        e.stopPropagation();
        addToScaling(props.note, duration, setDuration);
        startScale(e);
    }

    useEffect(() => {
        setStart(props.note.start)
        setHeight(props.note.height)
        setDuration(props.note.duration)
    }, [props.note.start, props.note.height, props.note.duration])

    return (
        <div
            className='note'
            style={{ '--start': start, '--height': height, '--duration': duration }}
            id={id}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}>
            < div className="duration-handle"
                onMouseDown={handlerMouseDown}>
            </div >
        </div >
    )
}