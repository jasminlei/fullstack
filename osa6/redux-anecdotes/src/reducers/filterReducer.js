const filterReducer = (state = '', action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'CHANGE_FILTER':
      return action.payload
    default:
      return state
  }
}

export const setFilter = (content) => {
  return {
    type: 'CHANGE_FILTER',
    payload: content,
  }
}

export default filterReducer
