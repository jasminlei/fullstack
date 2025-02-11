import NewAnecdote from './components/anecdoteForm'
import AnecdoteList from './components/anecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
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
