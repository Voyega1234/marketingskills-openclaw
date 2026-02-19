# Marketing Skills for OpenClaw

A collection of AI agent skills focused on marketing tasks. Built for technical marketers and founders who want [OpenClaw](https://openclaw.ai) to help with conversion optimization, copywriting, SEO, analytics, and growth engineering.

Based on [marketingskills](https://github.com/coreyhaines31/marketingskills) by [Corey Haines](https://corey.co).

## What are Skills?

Skills are markdown files that give AI agents specialized knowledge and workflows for specific tasks. When you add these to OpenClaw, it can recognize when you're working on a marketing task and apply the right frameworks and best practices.

## Available Skills

| Skill | Description |
|-------|-------------|
| [ab-test-setup](skills/ab-test-setup/) | Plan, design, or implement A/B tests and experiments |
| [analytics-tracking](skills/analytics-tracking/) | Set up, improve, or audit analytics tracking |
| [cold-email](skills/cold-email/) | Write B2B cold emails and follow-up sequences |
| [competitor-alternatives](skills/competitor-alternatives/) | Create competitor comparison or alternative pages |
| [content-strategy](skills/content-strategy/) | Plan content strategy and topics |
| [copy-editing](skills/copy-editing/) | Edit, review, or improve existing marketing copy |
| [copywriting](skills/copywriting/) | Write marketing copy for any page |
| [email-sequence](skills/email-sequence/) | Create or optimize email sequences and drip campaigns |
| [form-cro](skills/form-cro/) | Optimize lead capture and contact forms |
| [free-tool-strategy](skills/free-tool-strategy/) | Plan and build free tools for marketing |
| [launch-strategy](skills/launch-strategy/) | Plan product launches and announcements |
| [marketing-ideas](skills/marketing-ideas/) | 140 SaaS marketing ideas and strategies |
| [marketing-psychology](skills/marketing-psychology/) | Apply psychological principles to marketing |
| [onboarding-cro](skills/onboarding-cro/) | Optimize post-signup onboarding and activation |
| [page-cro](skills/page-cro/) | Optimize conversions on any marketing page |
| [paid-ads](skills/paid-ads/) | Google, Meta, LinkedIn, TikTok ad campaigns |
| [paywall-upgrade-cro](skills/paywall-upgrade-cro/) | Create or optimize in-app paywalls and upsells |
| [popup-cro](skills/popup-cro/) | Create or optimize popups and modals |
| [pricing-strategy](skills/pricing-strategy/) | Pricing decisions, packaging, monetization |
| [product-marketing-context](skills/product-marketing-context/) | Create product marketing context documents |
| [programmatic-seo](skills/programmatic-seo/) | Create SEO pages at scale |
| [referral-program](skills/referral-program/) | Create or optimize referral programs |
| [schema-markup](skills/schema-markup/) | Add or optimize structured data |
| [seo-audit](skills/seo-audit/) | Audit and diagnose SEO issues |
| [signup-flow-cro](skills/signup-flow-cro/) | Optimize signup and registration flows |
| [social-content](skills/social-content/) | Create social media content |

## Installation

### Option A: ClawHub (Recommended)

Install from [ClawHub](https://clawhub.com):

```bash
clawhub install coreyhaines31/marketingskills-openclaw

# Sync to get updates
clawhub sync coreyhaines31/marketingskills-openclaw
```

### Option B: Install Script

```bash
curl -fsSL https://raw.githubusercontent.com/coreyhaines31/marketingskills-openclaw/main/install.sh | bash
```

### Option C: Manual Install

```bash
git clone https://github.com/coreyhaines31/marketingskills-openclaw.git
cp -r marketingskills-openclaw/skills/* ~/.openclaw/workspace/skills/
cp -r marketingskills-openclaw/tools ~/.openclaw/workspace/
```

## Usage

Once installed, just ask OpenClaw to help with marketing tasks:

```
"Help me optimize this landing page for conversions"
→ Uses page-cro skill

"Write homepage copy for my SaaS"
→ Uses copywriting skill

"Set up GA4 tracking for signups"
→ Uses analytics-tracking skill

"Create a 5-email welcome sequence"
→ Uses email-sequence skill
```

Invoke skills directly:

```
@page-cro
@email-sequence
@seo-audit
```

## CLI Tools

This repo includes 52 zero-dependency Node.js CLI tools for marketing platforms:

- **Analytics**: GA4, Mixpanel, Amplitude, Posthog, Segment
- **SEO**: Google Search Console, Semrush, Ahrefs, DataForSEO
- **Email**: Mailchimp, Customer.io, Sendgrid, Resend, Klaviyo
- **Ads**: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads
- **CRM**: HubSpot, Salesforce
- **Payments**: Stripe, Paddle
- **And more...**

See [tools/REGISTRY.md](tools/REGISTRY.md) for the full list.

### Using CLI Tools

```bash
node tools/clis/ga4.js events list
node tools/clis/stripe.js customers list
node tools/clis/mailchimp.js campaigns list
```

All tools support `--dry-run` to preview requests without sending.

#### Security defaults

When running inside OpenClaw, sensitive ad platforms such as Google Ads, Meta Ads, LinkedIn Ads, and TikTok Ads run in read-only mode. Leave the `OPENCLAW_ADS_READ_ONLY` environment variable unset (default) to block mutations, and only opt in to writes with `--allow-write` or by setting `OPENCLAW_ADS_READ_ONLY=false` if you have audited the agent’s access.

## License

[MIT](LICENSE)
