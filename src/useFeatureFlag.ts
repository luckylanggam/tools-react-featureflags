import { useContext } from 'react'
import { FlagValue } from './types'
import { FeatureFlagContext } from './FeatureFlagProvider'

/**
 * React hook to get the value of a specific feature flag.
 *
 * @param {string} name - The name of the feature flag.
 * @returns {FlagValue | undefined} The value of the feature flag, or undefined if not found.
 * @throws {Error} If used outside of a FeatureFlagProvider.
 */
export const useFeatureFlag = (name: string): FlagValue | undefined => {
  const adapter = useContext(FeatureFlagContext)
  if (!adapter) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider')
  }
  return adapter.getFlag(name)
}

/**
 * React hook to get all available feature flags and their values.
 *
 * @returns {Record<string, FlagValue>} An object containing all feature flags and their values.
 * @throws {Error} If used outside of a FeatureFlagProvider.
 */
export const useFeatureFlags = (): Record<string, FlagValue> => {
  const adapter = useContext(FeatureFlagContext)
  if (!adapter) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
  }
  return adapter.getAllFlags()
}
