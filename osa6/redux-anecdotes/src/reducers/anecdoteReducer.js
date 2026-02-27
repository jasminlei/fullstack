import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdoteVotes(state, action) {
      const updatedAnecdote = action.payload
      return state
        .map((a) => (a.id !== updatedAnecdote.id ? a : updatedAnecdote))
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
  },
})

const { updateAnecdoteVotes, setAnecdotes, appendAnecdote } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find((a) => a.id === id)
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }
    const savedAnecdote = await anecdoteService.update(id, updatedAnecdote)
    dispatch(updateAnecdoteVotes(savedAnecdote))
  }
}

export default anecdoteSlice.reducer
