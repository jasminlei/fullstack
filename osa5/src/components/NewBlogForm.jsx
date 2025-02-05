import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='title'>Title: </label>
        <input
          data-testid='title'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='author'>Author: </label>
        <input
          data-testid='author'
          id='author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='url'>URL: </label>
        <input
          data-testid='url'
          id='url'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button type='submit'>Create</button>
    </form>
  )
}

export default NewBlogForm
