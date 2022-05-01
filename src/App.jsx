import { useEffect, useState } from 'react'
import './App.css'

function App() {

    let [state, setState] = useState({
        id: 0,
        items: [{ id: 0, name: 'item', qty: 0 }]
    })

    useEffect(() => {
        if (localStorage.getItem('state')) { setState(JSON.parse(localStorage.getItem('state'))) }
    }, [])

    let updateState = (update) => {
        setState({ ...state, ...update })
        localStorage.setItem('state', JSON.stringify(state))
    }

    let addItem = () => {
        updateState({ id: state.id++ })
        let items = state.items
        items.push({ id: state.id, name: 'item', qty: 0 })
        updateState({ items })
    }

    let changeName = (id) => {
        let items = state.items
        let index = items.findIndex(x => x.id == id)
        let item = items[index]
        item.name = prompt(`change ${item.name} to:`) || item.name
        items[index] = item
        updateState({ items })
    }

    let changeCount = (id) => {
        let items = state.items
        let index = items.findIndex(x => x.id == id)
        let item = items[index]
        item.qty += parseInt(prompt(`change ${item.name} qty from ${item.qty} to:`)) || 0
        if (item.qty === 0) { items.splice(index, 1) }
        updateState({ items })
    }

    return <div className='col'>
        <div className='row'>
            <button onClick={addItem}>ADD ITEM</button>
        </div>
        {state?.items?.map((x, i) => {
            return <div className='row' key={x.id}>
                <div onClick={e => { changeName(x.id) }}> {x.name} </div>
                <div onClick={e => { changeCount(x.id) }}> {x.qty} </div>
            </div>
        })}
    </div>
}

export default App
