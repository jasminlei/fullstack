import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('User saved to localStorage:', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Login successful')
      setNotificationType('success')
      setTimeout(() => setNotification(null), 5000)
    } catch (exception) {
      setNotification('wrong credentials')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      setNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`
      )
      setNotificationType('success')
      setTimeout(() => setNotification(null), 5000)

      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setNotification('Error adding blog')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLike = async (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id)
    if (!blogToUpdate) return

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    try {
      await blogService.updateBlog(id, updatedBlog)
      setBlogs(blogs.map((b) => (b.id === id ? updatedBlog : b)))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('Logged out successfully')
    setNotificationType('success')
    setTimeout(() => setNotification(null), 5000)
  }

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id)
    if (!blogToRemove) return

    const confirmDelete = window.confirm(
      `Remove blog "${blogToRemove.title}" by ${blogToRemove.author}?`
    )

    if (confirmDelete) {
      try {
        await blogService.removeBlog(id)
        setBlogs(blogs.filter((b) => b.id !== id))
        setNotification(`Blog "${blogToRemove.title}" removed successfully`)
        setNotificationType('success')
        setTimeout(() => setNotification(null), 5000)
      } catch (error) {
        console.error('Error removing blog:', error)
        setNotification('Error removing blog')
        setNotificationType('error')
        setTimeout(() => setNotification(null), 5000)
      }
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification notification={notification} type={notificationType} />
      {!user ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>blogs</h2>
          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                user={user}
              />
            ))}
          <Togglable
            buttonLabel='new note'
            buttonLabelClose='close'
            ref={blogFormRef}
          >
            <NewBlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
    </div>
  )
}

export default App
