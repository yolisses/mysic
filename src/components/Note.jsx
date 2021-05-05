import "./Note.css"

import React, { useEffect, useState } from 'react'

import { useNotes } from '../contexts/NotesContext'

export default function Note(props) {
    const { id } = props
    // const [note] = useState(props.note)

    const { startMove, addToMoving } = useNotes()
    const { startScale, addToScaling } = useNotes()
    const { removeNote } = useNotes()

    const [start, setStart] = useState(props.note.start)
    const [height, setHeight] = useState(props.note.height)
    const [duration, setDuration] = useState(props.note.duration)

    const onContextMenu = (e) => {
        console.log('nota a ser removida', props.note)
        console.log(onContextMenu)
        removeNote(props.note)
        e.preventDefault()
    }

    const onMouseDown = (e) => {
        e.stopPropagation();
        // e.preventDefault();
        if (e.button != 0) return;
        addToMoving(props.note, setStart, setHeight);
        startMove();
    }

    useEffect(() => {
        // console.log('foi', props.note)
        setStart(props.note.start)
        setHeight(props.note.height)
        setDuration(props.note.duration)
    })

    return (
        <div
            className='note'
            style={{ '--start': start, '--height': height, '--duration': duration }}
            id={id}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}
        > { start}
            < div className="duration-handle"
                onMouseDown={(e) => { e.stopPropagation(); addToScaling(props.note, duration, setDuration); startScale(e); }}>
            </div >
        </div >
    )
}