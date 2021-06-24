// import React, { createContext, useContext, useReducer, useState } from 'react'
// import notasExemplo from '../utils/notasExemplo'

// import { pixelToXPosition, pixelToYPosition } from '../components/NotesEditor'
// import { initialState, reducer } from '../data/projectData';

// const html = document.querySelector('html');

// export const NotesContext = createContext('')

// export function NotesContextProvider(props) {
//     const [notes, setNotes] = useState([...notasExemplo])

//     let actionFocusList = []

//     const clearFocusActionList = () => {
//         actionFocusList = []
//     }

//     const setAsFocusActionList = (note, action) => {
//         actionFocusList = [{ note, action }]
//     }

//     const startMove = () => {
//         html.onmousemove = (e) => {
//             actionFocusList.map(item => {
//                 item.note.start = pixelToXPosition(e.screenX)
//                 //DANGEROUS: hard coded
//                 item.note.height = pixelToYPosition(e.screenY)
//                 item.action(item.note.start, item.note.height)
//             })
//         }
//     }

//     const startScale = (e) => {
//         const initialMousePosition = pixelToXPosition(e.screenX)
//         const initialDurations = actionFocusList.map(item => item.note.duration)
//         html.onmousemove = (e) => {
//             actionFocusList.map((item, index) => {
//                 const newDuration = pixelToXPosition(e.screenX) - initialMousePosition + initialDurations[index]
//                 item.note.duration = newDuration
//                 item.action(item.note.duration)
//             })
//             e.preventDefault()
//         }
//     }

//     const endMove = () => {
//         html.onmousemove = () => {
//         }
//     }

//     const [state, dispatch] = useReducer(reducer, initialState);
//     //DANGER: hard coded
//     const hardCodedDuration = 4
//     const addNote = (start, height) => {
//         // dispatch({ type: 'add' })
//         // const newNote = { start, height, duration: hardCodedDuration }
//         // setNotes(notes.concat(newNote))
//         // return newNote

//     }

//     const removeNote = (note) => {
//         const index = notes.indexOf(note)
//         notes[index] = null
//         setNotes([...notes])
//     }

//     html.onmouseup = () => {
//         endMove()
//         clearFocusActionList()
//     }

//     return (
//         < NotesContext.Provider value={{
//             notes,
//             startMove,
//             endMove,
//             startScale,
//             addNote,
//             setAsFocusActionList,
//             removeNote,
//         }}>
//             {props.children}
//         </ NotesContext.Provider>
//     )
// }

// export const useNotes = () => {
//     return useContext(NotesContext)
// }