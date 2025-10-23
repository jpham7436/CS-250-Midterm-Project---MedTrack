import '@testing-library/jest-dom'

// Mock lucide-react so every named icon becomes a lightweight <span />
jest.mock('lucide-react', () => {
  const React = require('react')
  return new Proxy(
    {},
    {
      get: (_target, iconName) =>
        // Avoid JSX here to be extra safe in setup files
        (props) => React.createElement('span', { 'data-icon': String(iconName), ...props }),
    }
  )
})

// Freeze time so "Today's Medications" logic is deterministic (a Wednesday)
jest.useFakeTimers().setSystemTime(new Date('2025-10-22T12:00:00Z'))
