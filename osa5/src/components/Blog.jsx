import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  }

  const showRemoveButton =
    blog.user && user && blog.user.username === user.username

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <b>{blog.title}</b>
        <Togglable buttonLabel='view' buttonLabelClose='hide'>
          <span>
            <a href={blog.url} target='_blank' rel='noopener noreferrer'>
              {blog.url}
            </a>
            <br />
          </span>
          <span>
            likes {blog.likes}
            <button onClick={() => handleLike(blog.id)}>like</button>
            <br />
          </span>
          <span>
            {blog.author}
            <br />
          </span>
          {showRemoveButton && (
            <button onClick={() => handleRemove(blog.id)}>remove</button>
          )}
        </Togglable>
      </div>
    </div>
  )
}

export default Blog
