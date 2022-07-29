import { useEffect, useState } from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate
} from 'react-router-dom'
import lf from 'localforage'
import { Note, NoteManager } from './Note'

export function App() {
    let [theme, setTheme] = useState(localStorage.theme || 'dark')

    useEffect(() => {
        localStorage.theme = theme
        document.querySelector('html')!.className = theme
    }, [theme])

    return (
        <>
            <BrowserRouter>
                <div className='container mx-auto'>
                    <div className='col space-y-2 m-2 xl:mx-40'>
                        <div className='row space-x-2 p-2 justify-center'>
                            <Link to='/' className='text-xl'>
                                KEEPER
                            </Link>
                            <div
                                className='p-1'
                                onClick={() =>
                                    setTheme(
                                        theme === 'dark' ? 'light' : 'dark'
                                    )
                                }
                            >
                                {theme == 'dark' && (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='16'
                                        height='16'
                                        fill='currentColor'
                                        viewBox='0 0 16 16'
                                    >
                                        <path d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z' />
                                    </svg>
                                )}
                                {theme === 'light' && (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='16'
                                        height='16'
                                        fill='currentColor'
                                        viewBox='0 0 16 16'
                                    >
                                        <path d='M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z' />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/:id' element={<NotePad />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </>
    )
}

function Home() {
    let [notes, setNotes] = useState<Note[]>()
    let [sort, setSort] = useState<string>('new')
    let [filter, setFilter] = useState<string>('')

    let nav = useNavigate()

    useEffect(() => {
        lf.getItem<Note[]>('notes').then((x) => {
            if (!x) lf.setItem('notes', []).then((x) => setNotes(x))
            else setNotes(x)
        })
    }, [notes])

    return (
        <>
            <div className='row'>
                <input
                    placeholder='Search'
                    className='outline-none bg1 bubble w-full'
                    type='text'
                    onChange={(e) => setFilter(e.currentTarget.value)}
                />
            </div>
            <div className='row space-x-2'>
                <button
                    onClick={async () => {
                        NoteManager.createNote().then((tmpid) => {
                            lf.getItem<Note[]>('notes').then((notes) => {
                                setNotes(notes!)
                                nav('/' + tmpid)
                            })
                        })
                    }}
                    className='bg1 bubble'
                >
                    +
                </button>
                <select
                    defaultValue={sort}
                    className='bg1 bubble'
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value='new'>Newest</option>
                    <option value='old'>Oldest</option>
                </select>
            </div>
            <div className='grid123'>
                {notes
                    ?.filter(
                        (x) =>
                            x.title.includes(filter) || x.body.includes(filter)
                    )
                    ?.sort((a, b) =>
                        sort === 'old'
                            ? a.date > b.date
                                ? 1
                                : -1
                            : a.date > b.date
                            ? -1
                            : 1
                    )
                    ?.map((x, i) => (
                        <Link to={`/${x.id}`} className='bg1 bubble' key={i}>
                            <div className='font-bold'> {x.title} </div>
                            <div>
                                {x.body.length > 200
                                    ? x.body.substring(0, 197).padEnd(200, '.')
                                    : x.body}
                            </div>
                            {x.date && (
                                <div className='subtext'>
                                    {new Date(x.date).toLocaleString()}
                                </div>
                            )}
                        </Link>
                    ))}
            </div>
        </>
    )
}

function NotePad() {
    enum Mode {
        View,
        Edit,
        Delete
    }

    let { id } = useParams()
    let [note, setNote] = useState<Note>()
    let [mode, setMode] = useState<Mode>(Mode.View)
    let nav = useNavigate()

    let Save = () => {
        let note: Note = {
            title: document.querySelector<HTMLInputElement>('#title')!.value,
            body: document.querySelector<HTMLTextAreaElement>('#body')!.value,
            date: Date.now(),
            id: parseFloat(id!)
        }
        NoteManager.updateNote(note).then((x) => {
            setNote(note)
            setMode(Mode.View)
        })
    }

    let Delete = () => {
        NoteManager.deleteNote(parseFloat(id!)).then(() => {
            nav('/')
        })
    }

    useEffect(() => {
        NoteManager.getNote(parseFloat(id!)).then((x) => {
            if (!x) nav('/')
            else setNote(x)
        })
    }, [setNote])

    return (
        <>
            <div className=''>
                {mode === Mode.View && (
                    <>
                        <div className='col space-y-2'>
                            <div className='col bg1 bubble'>
                                <div className='font-bold'> {note?.title} </div>
                                <div> {note?.body} </div>
                                <div className='subtext'>
                                    {new Date(note?.date!).toLocaleString()}
                                </div>
                            </div>
                            <div className='row space-x-2'>
                                <button
                                    className='red bubble'
                                    onClick={() => setMode(Mode.Delete)}
                                >
                                    Delete
                                </button>
                                <button
                                    className='ylw bubble'
                                    onClick={() => setMode(Mode.Edit)}
                                >
                                    Edit
                                </button>
                                <button
                                    className='blu bubble'
                                    onClick={() => nav('/')}
                                >
                                    Home
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {mode === Mode.Edit && (
                    <>
                        <div className='col space-y-2'>
                            <div className='col space-y-2'>
                                <input
                                    placeholder='Title'
                                    id='title'
                                    type='text'
                                    className='bubble bg1'
                                    defaultValue={note?.title}
                                />
                                <textarea
                                    rows={10}
                                    id='body'
                                    className='bubble bg1'
                                    defaultValue={note?.body}
                                />
                                <div className='subtext'>
                                    {new Date(note?.date!).toLocaleString()}
                                </div>
                            </div>
                            <div className='row space-x-2'>
                                <button className='grn bubble' onClick={Save}>
                                    Save
                                </button>
                                <button
                                    className='ylw bubble'
                                    onClick={() => setMode(Mode.View)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className='red bubble'
                                    onClick={() => setMode(Mode.Delete)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {mode === Mode.Delete && (
                    <>
                        <div className='col space-y-2'>
                            <div className='col bg1 bubble'>
                                <div className='font-bold'> {note?.title} </div>
                                <div> {note?.body} </div>
                                <div className='subtext'>
                                    {new Date(note?.date!).toLocaleString()}
                                </div>
                            </div>
                            <div className='row space-x-2'>
                                <button className='red bubble' onClick={Delete}>
                                    Confirm Delete
                                </button>
                                <button
                                    className='ylw bubble'
                                    onClick={() => setMode(Mode.Edit)}
                                >
                                    Edit
                                </button>
                                <button
                                    className='blu bubble'
                                    onClick={() => setMode(Mode.View)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
