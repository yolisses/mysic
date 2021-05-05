import React, { createContext, useContext, useState, useEffect } from 'react'

import notasExemplo from '../utils/notasExemplo'

//import { global } from '../utils/global'

import { getAtualScale } from '../components/NotesEditor'

const html = document.querySelector('html');
let editor = document.querySelector('.notes-editor')

export const NotesContext = createContext('')

export function NotesContextProvider(props) {
    const notes = [...notasExemplo]
    const [selectedList, setSelectedList] = useState(
        [7, 8, 9, 10, 11, 12].map(i => notes[i])
    )

    let moving = []
    let scaling = []

    const addToMoving = (note, setStart, setHeight) => {
        moving.push({ note, setStart, setHeight })
    }

    const addToScaling = (note, setDuration) => {
        scaling.push({ note, setDuration })
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
                coisa.note.start = (e.screenX + editor.scrollLeft) / getAtualScale()
                //DANGEROUS: hard coded
                coisa.note.height = parseInt((e.screenY + editor.scrollTop - 80) / 20)
                coisa.setStart(coisa.note.start)
                coisa.setHeight(coisa.note.height)
            }
        }
    }

    const startScale = () => {
        console.log('start scale')
        html.onmousemove = (e) => {
            console.log('scaling')
            for (let coisa of scaling) {
                coisa.note.duration = (e.screenX + editor.scrollLeft) / getAtualScale()
                coisa.setDuration(coisa.note.duration)
            }
            e.preventDefault()
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
        }}>
            { props.children}
        </ NotesContext.Provider>
    )
}

export const useNotes = () => {
    return useContext(NotesContext)
}