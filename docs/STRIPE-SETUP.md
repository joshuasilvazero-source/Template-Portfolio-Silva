# Stripe setup for care plan subscriptions

This setup uses only Stripe-hosted, no-code features: **Payment Links** and the **customer portal**. No secret keys are stored in this project, and no server code is involved.

> Do the whole flow in **Test mode** first and confirm a test subscription end to end. Then repeat it in Live mode.

## 1. Account basics

1. Create or activate your Stripe account. Complete business details and payouts.
2. **Settings → Public details:** set your business name, support email and statement descriptor (for example `JSILVA WEB CARE`).
3. **Settings → Emails:** turn on emails for successful payments, failed payments and upcoming renewals.

## 2. Create the three products

**Product catalog → Add product**, once per plan:

| Product | Price | Billing |
|---|---|---|
| Essential Care | $79.00 USD | Recurring, monthly |
| Business Care | $149.00 USD | Recurring, monthly |
| Premium Care | $299.00 USD | Recurring, monthly |

Description suggestion: *"Monthly front-end website care. Includes [30 minutes / 2 hours / 4 hours] total editing time per month. See plan terms at https://YOUR-DOMAIN/maintenance#plan-terms."*

These must match `src/content/maintenance.ts`. If you change a price later, create a **new** price in Stripe and a new Payment Link, then update the env var.

## 3. Create a Payment Link per plan

**Payment Links → New**, select the product, then:

- **After payment:** "Don't show confirmation page", then redirect to `https://YOUR-DOMAIN/maintenance/welcome`
- **Collect customer's name** and **phone number** (optional), and add a custom text field "Website URL" so you know which site to maintain.
- **Require customers to accept your terms of service:** turn this on and set the Terms URL (**Settings → Public details**) to `https://YOUR-DOMAIN/maintenance#plan-terms`. Stripe then records consent at checkout, on top of the checkbox on the website.
- Limit to one quantity.

Copy each link (`https://buy.stripe.com/...`).

## 4. Customer portal

**Settings → Billing → Customer portal:**

- Allow: update payment methods, view invoice history, cancel subscriptions.
- Cancellation: **at end of billing period** (matches the published terms).
- Optionally allow switching between the three plans.
- Activate the **login link** and copy it (`https://billing.stripe.com/p/login/...`).

## 5. Add the links to the website

In Vercel → Project → Settings → Environment Variables (Production and Preview):

```
NEXT_PUBLIC_STRIPE_LINK_ESSENTIAL=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_BUSINESS=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_PREMIUM=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_PORTAL_URL=https://billing.stripe.com/p/login/...
```

**Redeploy.** These values are read at build time. The plan cards switch from "Request this plan" to the subscribe and terms flow, and "Manage billing" links appear.

You can enable plans one at a time. Any plan without a link keeps the request fallback.

## 6. Verify before announcing

- [ ] With test-mode links: subscribe, land on `/maintenance/welcome`, get the receipt email, see the subscription in the dashboard
- [ ] Open the portal link, update the card, cancel, and confirm cancellation is at period end
- [ ] Switch to live-mode links, redeploy, and run one real low-risk check (subscribe, then refund and cancel)

## What this setup does not do (by design)

- The website does not know who is subscribed, and `/maintenance/welcome` is shown to anyone who visits it. **Check the Stripe dashboard** (or Stripe's email notifications) for new subscriptions, failed payments and cancellations.
- Automating anything on payment (a client dashboard, auto-provisioning, syncing to a CRM) would need a Stripe **webhook** verified on a server with a secret key. That is a separate, approved backend phase. Zapier or Make's Stripe integrations are a no-code alternative for notifications.
