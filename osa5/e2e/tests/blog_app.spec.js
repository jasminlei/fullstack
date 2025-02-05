const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNewBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'topsecret',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Log in')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  test('login form is visible', async ({ page }) => {
    const usernameField = await page.getByTestId('username')
    const passwordField = await page.getByTestId('password')

    await expect(usernameField).toBeVisible()
    await expect(passwordField).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'topsecret')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongusername', 'wrongpassword')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'topsecret',
      },
    })

    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill('test')
    await page.getByTestId('password').fill('topsecret')
    await page.getByRole('button', { name: 'Login' }).click()
  })

  test('a new blog can be created', async ({ page }) => {
    await createNewBlog(page, 'Test title', 'Test author', 'Test url')
    await expect(
      page.getByText('A new blog "Test title" by Test author added')
    ).toBeVisible()
    const blogDiv = await page.locator('.blog', { hasText: 'Test title' })
    await expect(blogDiv).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createNewBlog(page, 'Test title', 'Test author', 'Test url')
    const blogDiv = await page.locator('.blog', { hasText: 'Test title' })
    await expect(blogDiv).toBeVisible()
    await likeBlog(blogDiv, 1)
    await expect(blogDiv).toContainText('likes 1')
  })

  test('a blog can be deleted', async ({ page }) => {
    await createNewBlog(page, 'Test title', 'Test author', 'Test url')
    const blogDiv = await page.locator('.blog', { hasText: 'Test title' })
    await expect(blogDiv).toBeVisible()
    await blogDiv.getByRole('button', { name: 'view' }).click()
    await expect(blogDiv).toBeVisible()
    const removeButton = await page.getByRole('button', { name: 'remove' })
    await expect(removeButton).toBeVisible()
    removeButton.click()

    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm')
      expect(dialog.message()).toContain(
        'Remove blog "Test title" by Test author?'
      )
      await dialog.accept()
    })

    await expect(blogDiv).not.toBeVisible()
    await expect(
      page.getByText('Blog "Test title" removed successfully')
    ).toBeVisible()
  })

  test('blogs are shown in right order based on likes', async ({ page }) => {
    await createNewBlog(page, 'BlogWithMostLikes', 'Author 1', 'Test url')
    await createNewBlog(page, 'BlogWithSecondMostLikes', 'Author 2', 'Test url')
    await createNewBlog(page, 'BlogWithThirdMostLikes', 'Author 3', 'Test url')

    const blogDiv1 = await page.locator('.blog', {
      hasText: 'BlogWithMostLikes',
    })
    await likeBlog(blogDiv1, 3)

    const blogDiv2 = await page.locator('.blog', {
      hasText: 'BlogWithSecondMostLikes',
    })
    await likeBlog(blogDiv2, 2)

    const blogDiv3 = await page.locator('.blog', {
      hasText: 'BlogWithThirdMostLikes',
    })
    await likeBlog(blogDiv3, 1)

    await page.waitForTimeout(1000)

    const blogTitles = await page
      .locator('.blog')
      .evaluateAll((blogs) => blogs.map((blog) => blog.textContent))

    expect(blogTitles[0]).toContain('BlogWithMostLikes')
    expect(blogTitles[1]).toContain('BlogWithSecondMostLikes')
    expect(blogTitles[2]).toContain('BlogWithThirdMostLikes')
  })
})

describe('Blog deletion visibility', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')

    await request.post('http://localhost:3001/api/users', {
      data: { name: 'User1', username: 'user1', password: 'password1' },
    })

    await request.post('http://localhost:3001/api/users', {
      data: { name: 'User2', username: 'user2', password: 'password2' },
    })
    await page.goto('http://localhost:5173')
  })

  test('Only blog creator sees the delete button', async ({ page }) => {
    await loginWith(page, 'user1', 'password1')

    await createNewBlog(page, 'Test Blog', 'Test Author', 'http://example.com')

    const blog = await page.locator('.blog', { hasText: 'Test Blog' })
    await blog.getByRole('button', { name: 'view' }).click()

    await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

    await page.getByRole('button', { name: 'logout' }).click()

    await loginWith(page, 'user2', 'password2')

    const blogAfterLogin = await page.locator('.blog', { hasText: 'Test Blog' })
    await blogAfterLogin.getByRole('button', { name: 'view' }).click()
    await expect(
      blogAfterLogin.getByRole('button', { name: 'remove' })
    ).toHaveCount(0)
  })
})
