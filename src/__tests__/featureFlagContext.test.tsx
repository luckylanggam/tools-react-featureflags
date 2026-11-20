import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { FeatureFlagProvider } from '../FeatureFlagProvider'
import { useFeatureFlag, useFeatureFlags } from '../useFeatureFlag'
import { FeatureFlagAdapter } from '../types'
import '@testing-library/jest-dom'


class MockAdapter implements FeatureFlagAdapter {
  private flags: Record<string, boolean>
  constructor(envObject?: Record<string, string>) {
    // Simulate parsing envObject if provided, otherwise use defaults
    if (envObject) {
      this.flags = {}
      for (const key in envObject) {
        const flagName = key.replace(/^REACT_APP_/, '').toLowerCase()
        this.flags[flagName] = envObject[key] === 'true'
      }
    } else {
      this.flags = {
        enabled_feature: true,
        disabled_feature: false,
      }
    }
  }
  getFlag(name: string) {
    return this.flags[name]
  }
  getAllFlags() {
    return this.flags
  }
}


const TestComponent = ({ flag }: { flag: string }) => {
  const isEnabled = useFeatureFlag(flag)
  return <div data-testid="flag-value">{String(isEnabled)}</div>
}

const AllFlagsComponent = () => {
  const flags = useFeatureFlags()
  return (
    <div>
      {Object.entries(flags).map(([key, value]) => (
        <div key={key} data-testid={`flag-${key}`}>{String(value)}</div>
      ))}
    </div>
  )
}

describe('FeatureFlagProvider', () => {
  it('provides flag values to child components', () => {
    render(
      <FeatureFlagProvider adapter={new MockAdapter()}>
        <TestComponent flag="enabled_feature" />
      </FeatureFlagProvider>,
    )
    expect(screen.getByTestId('flag-value')).toHaveTextContent('true')
  })

  it('returns false for missing or disabled flags', () => {
    render(
      <FeatureFlagProvider adapter={new MockAdapter()}>
        <TestComponent flag="disabled_feature" />
      </FeatureFlagProvider>,
    )
    expect(screen.getByTestId('flag-value')).toHaveTextContent('false')
  })

  it('throws an error if useFeatureFlag is used outside the provider', () => {
    // Suppress expected console error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const renderOutsideProvider = () =>
      render(<TestComponent flag="enabled_feature" />)

    expect(renderOutsideProvider).toThrow(
      /useFeatureFlag must be used within a FeatureFlagProvider/,
    )

    spy.mockRestore()
  })

  it('throws an error if useFeatureFlags is used outside the provider', () => {
    // Suppress expected console error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const renderOutsideProvider = () => render(<AllFlagsComponent />)
    expect(renderOutsideProvider).toThrow(
      /useFeatureFlags must be used within a FeatureFlagProvider/
    )
    spy.mockRestore()
  })

  it('provides all flag values to child components using useFeatureFlags', () => {
    render(
      <FeatureFlagProvider adapter={new MockAdapter()}>
        <AllFlagsComponent />
      </FeatureFlagProvider>
    )
    expect(screen.getByTestId('flag-enabled_feature')).toHaveTextContent('true')
    expect(screen.getByTestId('flag-disabled_feature')).toHaveTextContent('false')
  })

  it('updates when adapter provides different flags', () => {
    const customEnv = {
      REACT_APP_ENABLED_FEATURE: 'false',
      REACT_APP_NEW_FEATURE: 'true',
    }
    render(
      <FeatureFlagProvider adapter={new MockAdapter(customEnv)}>
        <AllFlagsComponent />
      </FeatureFlagProvider>
    )
    expect(screen.getByTestId('flag-enabled_feature')).toHaveTextContent('false')
    expect(screen.getByTestId('flag-new_feature')).toHaveTextContent('true')
  })

  it('returns undefined for unknown flags', () => {
    render(
      <FeatureFlagProvider adapter={new MockAdapter()}>
        <TestComponent flag="unknown_flag" />
      </FeatureFlagProvider>
    )
    expect(screen.getByTestId('flag-value')).toHaveTextContent('undefined')
  })
})
