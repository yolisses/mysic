import React, { createContext, useContext, useState, useEffect } from 'react'

import notasExemplo from '../utils/notasExemplo'

//import { global } from '../utils/global'

import { getAtualScale, editor, pixelToXPosition, pixelToYPosition } from '../components/NotesEditor'

const html = document.querySelector('html');

export const NotesContext = createContext('')

export function NotesContextProvider(props) {
    const [notes, setNotes] = useState([...notasExemplo])
    const [selectedList, setSelectedList] = useState(
        [7, 8, 9, 10, 11, 12].map(i => notes[i])
    )

    let moving = []
    let scaling = []

    const addToMoving = (note, setStart, setHeight) => {
        moving.push({ note, setStart, setHeight })
    }

    const addToScaling = (note, initialDuration, setDuration) => {
        scaling.push({ note, initialDuration, setDuration })
        // console.log(moving)
        // for (let coisa of moving) {
        //     console.log(coisa)
        // }
    }

    const startMove = () => {
        console.log('start move')
        html.onmousemove = (e) => {
            console.log('moving')
            for (let coisa of moving) {
                coisa.note.start = pixelToXPosition(e.screenX)
                //DANGEROUS: hard coded
                coisa.note.height = pixelToYPosition(e.screenY)
                coisa.setStart(coisa.note.start)
                coisa.setHeight(coisa.note.height)
            }
        }
    }

    const startScale = (e) => {
        console.log('start scale')
        const initialMousePosition = pixelToXPosition(e.screenX)
        html.onmousemove = (e) => {
            console.log('scaling')
            for (let coisa of scaling) {
                coisa.note.duration = pixelToXPosition(e.screenX) - initialMousePosition + coisa.initialDuration
                coisa.setDuration(coisa.note.duration)
            }
            e.preventDefault()
        }
    }

    const endMove = () => {
        html.onmousemove = () => {
        }
    }

    //DANGER: hard coded
    const hardCodedDuration = 4

    const addNote = (start, height) => {
        const newNote = { start, height, duration: hardCodedDuration }
        setNotes(notes.concat(newNote))
        notes.sort((a, b) => a.start - b.start)
        return newNote
    }

    html.onmouseup = () => {
        endMove()
        // console.log('mouse up')
        moving = []
        scaling = []
    }

    html.onmousedown = (e) => {
        // console.log('mouse down', e.target)
    }

    return (
        < NotesContext.Provider value={{
            notes,
            selectedList,
            setSelectedList,
            startMove,
            endMove,
            addToMoving,
            startScale,
            addToScaling,
            addNote,
        }}>
            { props.children}
        </ NotesContext.Provider>
    )
}

export const useNotes = () => {
    return useContext(NotesContext)
}