import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MedTrack from './App'

// helper to log in using placeholders
async function loginAs(name = 'alice', pass = 'secret') {
  await userEvent.type(screen.getByPlaceholderText(/enter your username/i), name)
  await userEvent.type(screen.getByPlaceholderText(/enter your password/i), pass)
  await userEvent.click(screen.getByRole('button', { name: /login/i }))
}

test('shows login screen first, then dashboard after login', async () => {
  render(<MedTrack />)
  expect(screen.getByRole('heading', { name: /medtrack/i })).toBeInTheDocument()
  await loginAs()
  expect(screen.getByText(/alice/i)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /today's medications/i })).toBeInTheDocument()
})

test('toggling a medication marks it as Taken', async () => {
  render(<MedTrack />)
  await loginAs()

  const row = screen.getByRole('heading', { name: /lisinopril/i }).closest('.med-row')
  expect(row).toBeInTheDocument()

  const btn = within(row).getByRole('button', { name: /toggle taken/i })
  await userEvent.click(btn)

  expect(within(row).getByText(/taken/i)).toBeInTheDocument()
})

test('add new medication flow shows it in today list', async () => {
  render(<MedTrack />)
  await loginAs()

  await userEvent.click(screen.getByRole('button', { name: /add new medication/i }))

  await userEvent.type(screen.getByPlaceholderText(/e\.g\., aspirin/i), 'Aspirin')
  await userEvent.type(screen.getByPlaceholderText(/e\.g\., 100mg/i), '100mg')

 const time = document.querySelector('input[type="time"]')
expect(time).toBeInTheDocument()
fireEvent.change(time, { target: { value: '09:15' } })

  await userEvent.click(screen.getByRole('button', { name: /^add medication$/i }))

  expect(screen.getByRole('heading', { name: /aspirin/i })).toBeInTheDocument()
})

test('weekly schedule view renders weekday headers', async () => {
  render(<MedTrack />)
  await loginAs()

  await userEvent.click(screen.getByRole('button', { name: /weekly schedule/i }))

  const table = screen.getByRole('table')
  for (const day of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']) {
    expect(within(table).getByRole('columnheader', { name: day })).toBeInTheDocument()
  }
})

test('logout returns to login screen', async () => {
  render(<MedTrack />)
  await loginAs()
  await userEvent.click(screen.getByRole('button', { name: /logout/i }))
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
})
