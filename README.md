<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://avatars.githubusercontent.com/u/255006479?s=200&v=4">
    <source media="(prefers-color-scheme: light)" srcset="https://avatars.githubusercontent.com/u/255006479?s=200&v=4">
    <img alt="Revstack" src="https://avatars.githubusercontent.com/u/255006479?s=200&v=4" width="120" style="border-radius: 12px;">
  </picture>
</p>

<h3 align="center">Billing infrastructure for SaaS.</h3>

<p align="center">
  Entitlements, subscriptions, usage metering, and payment provider abstraction —<br/>
  so you can ship features instead of billing plumbing.
</p>

<p align="center">
  <a href="https://docs.revstack.dev"><strong>Docs</strong></a> ·
  <a href="https://app.revstack.dev"><strong>Dashboard</strong></a> ·
  <a href="https://github.com/revstack-dev/revstack/issues"><strong>Issues</strong></a> ·
  <a href="CONTRIBUTING.md"><strong>Contributing</strong></a>
</p>

<p align="center">
  <a href="LICENSE.md"><img alt="License" src="https://img.shields.io/badge/license-MIT%20%2F%20FSL-0a0a0a?style=flat-square&labelColor=0a0a0a"></a>
  <a href="https://github.com/revstack-dev/revstack"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-0a0a0a?style=flat-square&labelColor=0a0a0a"></a>
  <img alt="Coverage" src="./coverage/badge.svg" style="height: 20px;">
</p>

---

## What is Revstack?

Revstack is the Terraform for billing. We are an open-source development platform that handles the entire subscription lifecycle. Define your plans in code, connect a payment provider, and we take care of the rest.

- [x] **Billing-as-Code:** Define your pricing models in a single configuration file and deploy with our CLI.
- [x] **Entitlement Engine:** Resolve access control in milliseconds. No more fragile conditionals.
- [x] **Webhook Orchestration:** We absorb the asynchronous noise from payment providers and normalize it into a unified state.
- [x] **AI Auto-metering:** Sub-millisecond token deductions for AI wrappers (native Vercel AI SDK integration).
- [x] **Bring Your Own Auth:** Works out-of-the-box with Auth0, Clerk, Supabase, Cognito, and custom JWTs.
- [x] **Self-Hosted or Cloud:** Run the engine on your own infrastructure or use our managed Cloud.

## How it works

The biggest bottleneck in monetization is the fragmented event architecture of different payment providers. Revstack acts as a middleware that absorbs that asynchronous noise and converts it into a synchronous, unified state. The developer simply fetches the entitlement state; Revstack orchestrates the webhooks behind the scenes.

1. **Write your `revstack.config.ts`.** Define products, features, and limits.
2. **Run `npx revstack push`.** The CLI syncs your configuration with the database and payment provider.
3. **Use the SDK.** Call `revstack.entitlements.resolve()` in your app to guard features or track usage.

## Client Libraries & Ecosystem

Our approach is modular. You only install what you need for your specific stack. The Client SDKs are fully MIT licensed.

| Package | Description |
| --- | --- |
| [`@revstackhq/node`](packages/node) | Server-side SDK for Node.js |
| [`@revstackhq/next`](packages/next) | Next.js Server Actions and API route integrations |
| [`@revstackhq/react`](packages/react) | React hooks (`useEntitlement`, `useBilling`) and UI components |
| [`@revstackhq/browser`](packages/browser) | Lightweight browser-side SDK |
| [`@revstackhq/auth`](packages/auth) | JWT verification for Auth0, Clerk, Supabase, Cognito, Firebase |
| [`@revstackhq/ai`](packages/ai) | Auto-metering utilities for LLM streams (OpenAI, Anthropic) |
| [`@revstackhq/cli`](packages/cli) | Command-line interface for state diffing and sync |
| [`@revstackhq/eslint-config`](packages/eslint-config) | Shared ESLint rules |
| [`@revstackhq/typescript-config`](packages/typescript-config)| Shared TypeScript configurations |

## Core Infrastructure

The underlying engine that powers the entitlement checks and webhook orchestration.

| Package | Description |
| --- | --- |
| [`@revstackhq/core`](packages/core) | The main Entitlement and Ledger engine |
| [`@revstackhq/providers-core`](packages/providers/core) | Provider gateway interfaces and abstract classes |
| [`@revstackhq/providers-registry`](packages/providers/registry)| Provider discovery mechanism |
| [`@revstackhq/provider-stripe`](packages/providers/official/stripe)| Official Stripe provider |
| [`@revstackhq/provider-polar`](packages/providers/official/polar)| Official Polar provider |

## Development

To get started with local development, clone the repository and build the packages:

```bash
git clone [https://github.com/revstack-dev/revstack.git](https://github.com/revstack-dev/revstack.git)
cd revstack
pnpm install
pnpm build
