# Product

## Register

product

## Users

The primary users are laundry owners and staff configuring services, prices, delivery rules, and basket capacity in the SIMAME web portal. They may be moving quickly from a handwritten or printed price list and need a guided workflow that works for item, weight, basket, package, and mixed pricing. Customers are a downstream audience whose mobile ordering experience must receive clear, authoritative pricing and estimation rules from the Django backend.

## Product Purpose

SIMAME makes laundry ordering predictable for both sides of the marketplace. Owners should be able to upload an existing price list, review AI-extracted prices, configure basket and weight guidance, and publish confidently. Customers should eventually be able to build mixed orders, understand estimates and capacity limits, approve quote changes, and pay without duplicate or surprising charges. The Django backend is the source of truth; the web portal is one client of that contract.

## Brand Personality

Trustworthy, guided, premium. The product should make complex pricing feel simple without hiding uncertainty or operational detail.

## Anti-references

Avoid opaque AI automation, dense spreadsheet-like setup screens, unexplained price changes, fake progress states, mock data presented as saved data, and generic dashboard card grids that obscure the next action.

## Design Principles

- Make uncertainty visible and actionable.
- Let owners reuse the price lists they already have.
- Support mixed pricing without forcing one global pricing model.
- Explain customer-facing rules in plain language before publishing.
- Keep backend authority and backward compatibility explicit.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Support keyboard navigation, visible focus, clear labels, text alternatives for uploaded images, reduced motion, readable contrast, responsive layouts, and error messages that explain how to recover. Customer estimates must clearly distinguish estimated values from confirmed prices.
