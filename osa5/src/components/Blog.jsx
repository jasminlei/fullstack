import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useState } from "react";

const Blog = ({ blog, updateBlogList }) => {
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  };

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: likes + 1 };
    await blogService.updateBlog(blog.id, updatedBlog);
    setLikes(likes + 1);
    updateBlogList();
  };

  return (
    <div style={blogStyle}>
      <div>
        <b>{blog.title}</b>
        <Togglable buttonLabel="view" buttonLabelClose="hide">
          <span>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>{" "}
            <br />
          </span>
          <span>
            likes {blog.likes} <button onClick={handleLike}>like</button>
            <br />
          </span>
          <span>
            {blog.author}
            <br />
          </span>
        </Togglable>
      </div>
    </div>
  );
};

export default Blog;
