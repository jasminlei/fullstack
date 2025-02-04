import Togglable from "./Togglable";

const Blog = ({ blog }) => {
  const blogStyle = {
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  };

  return (
    <div style={blogStyle}>
      <div>
        <b>{blog.title}</b>
        <Togglable buttonLabel="view" buttonLabelClose="hide">
          <span>
            {blog.author}
            <br />
          </span>
          <span>
            {blog.url}
            <br />
          </span>
          <span>
            likes {blog.likes} <button>like</button>
            <br />
          </span>
        </Togglable>
      </div>
    </div>
  );
};

export default Blog;
