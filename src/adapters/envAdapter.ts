import { FeatureFlagAdapter, FeatureFlags, FlagValue } from '../types'

/**
 * Adapter to read feature flags from environment variables.
 *
 * The prefix for environment variables can be customized via the constructor.
 */
export class EnvAdapter implements FeatureFlagAdapter {
  private flags: FeatureFlags = {}

  /**
   * Creates an EnvAdapter instance.
   *
   * @param {string} [prefix="REACT_APP_"] - The prefix used to identify feature flag environment variables.
   * @param {Record<string, string | undefined>} [envObject] - The environment object to read from.
   */
  constructor(prefix: string = 'REACT_APP_', envObject: Record<string, string | undefined> = {}) {
    for (const key in envObject) {
      if (key.startsWith(prefix)) {
        const flagName = key.replace(prefix, '').toLowerCase()
        this.flags[flagName] = this.parseValue(envObject[key])
      }
    }
  }

  /**
   * Parses the environment variable value to a boolean flag value.
   *
   * @param {string | undefined} value - The value to parse.
   * @returns {FlagValue} The parsed flag value (true/false).
   */
  private parseValue(value: string | undefined): FlagValue {
    if (value === 'true') return true
    if (value === 'false') return false

    return false
  }

  /**
   * Gets the value of a specific feature flag by name.
   *
   * @param {string} name - The name of the feature flag.
   * @returns {FlagValue | undefined} The value of the flag, or undefined if not found.
   */
  getFlag(name: string) {
    return this.flags[name.toLowerCase()]
  }

  /**
   * Gets all feature flags and their values.
   *
   * @returns {FeatureFlags} An object containing all feature flags and their values.
   */
  getAllFlags() {
    return this.flags
  }
}
