import React, { createContext } from 'react'
import { FeatureFlagAdapter, FeatureFlagProviderProps } from './types'
import { EnvAdapter } from './adapters/envAdapter'

/**
 * React context for providing a FeatureFlagAdapter instance.
 */
export const FeatureFlagContext = createContext<FeatureFlagAdapter | null>(null)

/**
 * Provider component to supply a FeatureFlagAdapter to the React context tree.
 *
 * @param {FeatureFlagProviderProps} props - The provider props, including the adapter and children.
 * @returns {React.JSX.Element} The context provider wrapping the children.
 */
export const FeatureFlagProvider = ({
  adapter,
  children,
}: FeatureFlagProviderProps): React.JSX.Element => {
  return (
    <FeatureFlagContext.Provider value={adapter}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
