import { EnvAdapter } from '../envAdapter'

describe('EnvAdapter', () => {
  it('parses boolean, number, and string values correctly', () => {
    const envObject = {
      REACT_APP_FEATURE_FLAG_ONE: 'true',
      REACT_APP_FEATURE_FLAG_TWO: 'false',
      REACT_APP_FEATURE_FLAG_THREE: 'beta',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getFlag('feature_flag_one')).toBe(true)
    expect(adapter.getFlag('feature_flag_two')).toBe(false)
    expect(adapter.getFlag('feature_flag_three')).toBe(false) // 'beta' is not true/false, so it defaults to false
  })

  it('ignores non-flag environment variables', () => {
    const envObject = {
      REACT_APP_FEATURE_FLAG_ONE: 'true',
      OTHER_VAR: '123',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getAllFlags()).not.toHaveProperty('other_var')
    expect(adapter.getFlag('feature_flag_one')).toBe(true)
  })

  it('handles missing flags gracefully', () => {
    const envObject = {
      REACT_APP_FEATURE_FLAG_ONE: 'true',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getFlag('non_existent')).toBeUndefined()
  })

  it('accepts a custom environment object', () => {
    const customEnv = {
      REACT_APP_CUSTOM_FLAG: 'true',
      OTHER_VAR: '123',
    }
    const adapter = new EnvAdapter('REACT_APP_', customEnv)
    expect(adapter.getFlag('custom_flag')).toBe(true)
    expect(adapter.getFlag('other_var')).toBeUndefined() // should not be included
  })

  it('returns all flags correctly', () => {
    const envObject = {
      REACT_APP_FLAG_ONE: 'true',
      REACT_APP_FLAG_TWO: 'false',
      REACT_APP_FLAG_THREE: 'true',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    const allFlags = adapter.getAllFlags()
    expect(allFlags).toEqual({
      flag_one: true,
      flag_two: false,
      flag_three: true,
    })
  })

  it('is case-insensitive for flag names', () => {
    const envObject = {
      REACT_APP_FLAG_ONE: 'true',
      REACT_APP_FLAG_TWO: 'false',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getFlag('FLAG_ONE')).toBe(true)
    expect(adapter.getFlag('Flag_Two')).toBe(false)
  })

  it('returns false for non-boolean string values', () => {
    const envObject = {
      REACT_APP_FLAG: 'notaboolean',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getFlag('flag')).toBe(false)
  })

  it('returns undefined if no flags match the prefix', () => {
    const envObject = {
      OTHER_PREFIX_FLAG: 'true',
    }
    const adapter = new EnvAdapter('REACT_APP_', envObject)
    expect(adapter.getFlag('other_prefix_flag')).toBeUndefined()
    expect(adapter.getAllFlags()).toEqual({})
  })

  it('handles missing envObject gracefully', () => {
    const adapter = new EnvAdapter('REACT_APP_')
    expect(adapter.getAllFlags()).toEqual({})
    expect(adapter.getFlag('any_flag')).toBeUndefined()
    expect(adapter.getFlag('non_existent_flag')).toBeUndefined()
  })

  it('uses correctly the default prefix for the flags', () => {
    const envObject = {
      REACT_APP_FLAG_ONE: 'true',
      REACT_APP_FLAG_TWO: 'false',
    }
    const adapter = new EnvAdapter(undefined, envObject)
    expect(adapter.getFlag('flag_one')).toBe(true)
    expect(adapter.getFlag('flag_two')).toBe(false)
  })
})
