export type FlagValue = boolean
export type FeatureFlags = Record<string, FlagValue>

export interface FeatureFlagAdapter {
  getFlag(name: string): FlagValue | undefined
  getAllFlags(): FeatureFlags
}

export interface FeatureFlagProviderProps {
  adapter: FeatureFlagAdapter
  children: React.ReactNode
}
