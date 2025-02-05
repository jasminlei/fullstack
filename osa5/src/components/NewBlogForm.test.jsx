import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> does somehting', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<NewBlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')
  const sendButton = screen.getByText('Create')

  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testurl.com')
})
