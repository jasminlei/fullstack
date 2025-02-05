const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNewBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

async function likeBlog(blogElement, times = 1) {
  for (let i = 0; i < times; i++) {
    await blogElement.getByRole('button', { name: 'view' }).click()
    await blogElement.getByRole('button', { name: 'like' }).click()
    await blogElement.getByRole('button', { name: 'hide' }).click()
  }
}

export { loginWith, createNewBlog, likeBlog }
