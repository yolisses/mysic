import "./Note.css"

import React, { useEffect, useState } from 'react'

import { useNotes } from '../contexts/NotesContext'

export default function Note(props) {
    const { id } = props

    const { setAsFocusActionList } = useNotes()

    const { startMove } = useNotes()
    const { startScale } = useNotes()
    const { removeNote } = useNotes()

    const [start, setStart] = useState(props.note.start)
    const [height, setHeight] = useState(props.note.height)
    const [duration, setDuration] = useState(props.note.duration)

    const onContextMenu = (e) => {
        e.preventDefault()
        removeNote(props.note)
    }

    const onMouseDown = (e) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        setAsFocusActionList(props.note, (start, height) => {
            setStart(start);
            setHeight(height)
        })
        startMove();
    }

    const handlerMouseDown = (e) => {
        e.stopPropagation();
        setAsFocusActionList(props.note, setDuration);
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