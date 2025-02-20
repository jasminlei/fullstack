import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let blog

  beforeEach(() => {
    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Someone',
      url: 'www.com',
      likes: 1,
      id: '123',
    }
  })

  test('renders content correctly', () => {
    render(<Blog blog={blog} />)

    const titleElement = screen.getByText(blog.title)
    expect(titleElement).toBeDefined()

    const authorElement = screen.getByText(blog.author)
    expect(authorElement).not.toBeVisible()

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText(`likes ${blog.likes}`)
    expect(likesElement).not.toBeVisible()
  })

  test('clicking the view button reveals details', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText(blog.author)).toBeVisible()
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
  })

  test('clicking like button twice calls the event handler twice', async () => {
    const mockUpdateBlogList = vi.fn()

    render(<Blog blog={blog} handleLike={mockUpdateBlogList} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    const likeButton = screen.getByText('like')

    await user.click(viewButton)
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlogList.mock.calls).toHaveLength(2)
  })
})
