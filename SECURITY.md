# Security Policy

## Supported Versions

Currently, only the latest version of the `Connect Web App` is supported for security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes            |
| < 1.0.0 | ❌ No             |

## Reporting a Vulnerability

We take the security of the Connect Laundry platform seriously. If you identify a potential security vulnerability, please do NOT report it via public GitHub issues.

Instead, please report security vulnerabilities by emailing: **security@your-domain.example.com** (replace with your primary email).

When reporting a vulnerability, please include:
- A detailed description of the vulnerability.
- Steps to reproduce the issue (is it consistent or random?).
- Potential impact if the vulnerability were to be exploited.

### Our Commitment

We will:
- Acknowledge receipt of your report within 48 hours.
- Provide a planned timeline for resolution.
- Notify you once the vulnerability is patched.

## Secure Coding Standards Used

This project implements:
- **BFF (Backend-for-Frontend) Proxy**: All sensitive tokens are stored in `HttpOnly` cookies, unreachable by browser scripts.
- **Server-Side Authorization**: Routes are protected via `middleware.ts` before rendering.
- **Security Headers**: HSTS, CSP, and X-Frame-Options are enforced via `vercel.json` and `next.config.mjs`.
- **Gitleaks Scanning**: Automatic CI checks for hardcoded secrets.
