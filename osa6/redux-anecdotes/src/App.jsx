import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NewAnecdote from './components/anecdoteForm'
import AnecdoteList from './components/anecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <NewAnecdote />
      <AnecdoteList />
    </div>
  )
}

export default App
