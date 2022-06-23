import lf from 'localforage'

export type Note = {
    id: number
    title: string
    date: number
    body: string
}

export const NoteManager = {
    createNote: async () => {
        let tmpid = Math.random()
        let notes = await lf.getItem<Note[]>('notes') || []

        while (notes.find(x => x.id === tmpid)) {
            tmpid = Math.random()
        }

        notes.push({
            title: 'New Note',
            body: '',
            date: Date.now(),
            id: tmpid
        })

        lf.setItem('notes', notes)
        return tmpid
    },
    getNote: async (id: number) => {
        let notes = await lf.getItem<Note[]>('notes')
        let note = notes?.find(x => x.id === id)
        return note
    },
    updateNote: async (note: Note) => {
        let notes = await lf.getItem<Note[]>('notes')
        let index = notes?.findIndex(x => x.id === note.id)
        notes![index!] = note
        lf.setItem('notes', notes)
    },
    deleteNote: async (id: number) => {
        let notes = await lf.getItem<Note[]>('notes')
        let index = notes?.findIndex(x => x.id === id)
        notes?.splice(index!, 1)
        lf.setItem('notes', notes)
    }
}
