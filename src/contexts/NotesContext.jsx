import React, { createContext, useContext, useState, useEffect } from 'react'

import notasExemplo from '../utils/notasExemplo'

//import { global } from '../utils/global'

const html = document.querySelector('html');
let editor = document.querySelector('.notes-editor')

export const NotesContext = createContext('')

export function NotesContextProvider(props) {
    const notes = [...notasExemplo]
    const [selectedList, setSelectedList] = useState(
        [7, 8, 9, 10, 11, 12].map(i => notes[i])
    )

    let moving = []

    const addToMoving = (note, setStart) => {
        moving.push({ note, setStart })
        // console.log(moving)
        // for (let coisa of moving) {
        //     console.log(coisa)
        // }
    }

    const startMove = () => {
        // console.log('start move')
        html.onmousemove = (e) => {
            for (let coisa of moving) {
                coisa.note.start = e.screenX + editor.scrollLeft
                coisa.setStart(coisa.note.start)
            }
        }
    }

    const endMove = () => {
        html.onmousemove = () => {
        }
    }

    useEffect(() => { editor = document.querySelector('.notes-editor') })

    html.onmouseup = () => {
        endMove()
        // console.log('mouse up')
        moving = []
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
            addToMoving
        }}>
            { props.children}
        </ NotesContext.Provider>
    )
}

export const useNotes = () => {
    return useContext(NotesContext)
}