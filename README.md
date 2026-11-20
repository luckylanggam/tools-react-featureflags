# tools-react-featureflags

A lightweight and extensible React package for managing feature flags via environment variables, designed for scalable web applications and production-grade frontends.

## ✨ Features

- ✅ Strict context-based feature flag access
- ⚙️ Support for single and multiple feature flag checks via hooks
- 🚫 Easily guard UI components by feature flags
- 🧩 Adapter-driven for easy mocking and testing

## 📦 Installation

```bash
npm install @luckylanggam/tools-react-featureflags
# or
yarn add @luckylanggam/tools-react-featureflags
```

## 🧠 Concept

Feature flags are toggled using environment variables, using the format:

```ts
REACT_APP_FEATURE_X=true
REACT_APP_FEATURE_Y=false
```

Flags are read at runtime and made available to your React app via a context provider and hooks.

## 🛠️ Usage

### 1. Set your environment variables

```ts
REACT_APP_USER_SIGNUP=false
REACT_APP_PAYMENT_GATEWAY=true
```

For local development, set your environment variables:

```ts
export REACT_APP_USER_SIGNUP=true
export REACT_APP_PAYMENT_GATEWAY=false
```

Or in your .env file.

### 2. Initialize the provider

```tsx
import { FeatureFlagProvider, EnvAdapter } from '@luckylanggam/tools-react-featureflags'

const adapter = new EnvAdapter('REACT_APP_', process.env)

// In your app root:
<FeatureFlagProvider adapter={adapter}>
  <App />
</FeatureFlagProvider>
```

### 3. Check if a flag is enabled in a component

```tsx
import { useFeatureFlag } from '@luckylanggam/tools-react-featureflags'

const MyComponent = () => {
  const isSignupEnabled = useFeatureFlag('user_signup')

  if (!isSignupEnabled) return null
  
  return <button>Sign Up</button>
}
```

#### Important Note: The flag name must be provided without the prefix and in lowercase. For example, if the environment variable is `REACT_APP_USER_SIGNUP`, you should pass `user_signup` to the hook.

### 4. Check multiple flags

```tsx
import { useFeatureFlags } from '@luckylanggam/tools-react-featureflags'

const AllFlags = () => {
  const flags = useFeatureFlags()
  return (
    <ul>
      {Object.entries(flags).map(([key, value]) => (
        <li key={key}>{key}: {String(value)}</li>
      ))}
    </ul>
  )
}
```

```ts
const { payment_gateway, user_signup } = useFeatureFlags()
if (payment_gateway && user_signup) {
  // Both features enabled
}
```

## 🧪 Adapter Interface for Dependency Injection

You can provide your own adapter by implementing the following interface:

```ts
export interface FeatureFlagAdapter {
  getFlag(name: string): boolean | undefined
  getAllFlags(): Record<string, boolean>
}
```

This allows you to mock the `FeatureFlagAdapter` in your unit tests.

## ❗ Error Handling
- If you use the hooks outside of a `FeatureFlagProvider`, an error will be thrown.

- Unknown or malformed flags will return `undefined` or `false` depending on the adapter logic.

## 📁 Project Structure

```
tools-react-featureflags/
├── src/
│   ├── FeatureFlagProvider.tsx      // Context and provider
│   ├── useFeatureFlag.ts            // Hooks for flag access
│   ├── adapters/
│   │   └── envAdapter.ts            // Default env var adapter
│   └── types.ts                     // TypeScript types
├── __tests__/                       // Unit tests
├── README.md
```

## 📃 License

MIT License © 2026 [Luckylanggam](https://github.com/luckylanggam). See [LICENSE](LICENSE).