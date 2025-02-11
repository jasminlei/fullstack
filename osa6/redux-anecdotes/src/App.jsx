import NewAnecdote from './components/anecdoteForm'
import AnecdoteList from './components/anecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <NewAnecdote />
      <AnecdoteList />
    </div>
  )
}

export default App
