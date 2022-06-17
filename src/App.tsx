import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

class Note {
    id: number
    title: string
    date: number
    body: string
    constructor(title?: string, body?: string) {
        this.id = Math.floor(Math.random() * 100000000) + 1
        this.title = title || ''
        this.body = body || ''
        this.date = Date.now()
    }
}

export function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
        </BrowserRouter>
    </>
}

function Home() {

    let html = document.querySelector('html')!

    let [notes, setNotes] = useState<Array<Note>>()

    useEffect(() => {
        if (!localStorage.notes) localStorage.notes = '[{}]'
        setNotes(JSON.parse(localStorage.notes))
    }, [])

    return <>
        <div className='container mx-auto'>
            <div className='col space-y-2 m-2'>
                <div className='row mx-auto m-4'>
                    <div className='text-xl' onClick={() => {
                        html.className === 'dark' ? html.className = 'light' : html.className = 'dark'
                    }}> KEEPER </div>
                </div>
                <div className='row'>
                    <button className='theme-color py-2 px-4 rounded-xl'>New Note</button>
                </div>
                <div className='grid123 gap-2'>
                    {notes?.map((x, i) =>
                        <Link to={`/${x.id}`} key={i}>
                            <div> {x.title} </div>
                            <div> {x.body} </div>
                            {x.date && <div> {new Date(x.date).toDateString()} </div>}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </>
}

function NotePad() {

    let nav = useNavigate()
    let { id } = useParams()
    let [note, setNote] = useState<Note>()

    useEffect(() => {
        if (!id) { nav('/') }
        if (!localStorage.notes) { nav('/') }
        let x = JSON.parse(localStorage.notes).find((x: Note) => x.id === parseInt(id!))
        if (!x) { nav('/') }
        setNote(x)
    }, [])
    
    return <></>
}
