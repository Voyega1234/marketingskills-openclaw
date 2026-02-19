#!/usr/bin/env node

const TOKEN = process.env.META_ACCESS_TOKEN
const DEFAULT_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID
const BASE_URL = 'https://graph.facebook.com/v18.0'
const READ_ONLY = process.env.OPENCLAW_ADS_READ_ONLY !== 'false'
const DEFAULT_INSIGHT_FIELDS = 'impressions,reach,frequency,clicks,unique_clicks,spend,actions,action_values,cpc,cpm,ctr,cpp'

if (!TOKEN) {
  console.error(JSON.stringify({ error: 'META_ACCESS_TOKEN environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  const opts = {
    method,
    headers: { 'Authorization': `Bearer ${TOKEN}` },
  }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { ...opts.headers, Authorization: '***' }, body: body || undefined }
  }
  const res = await fetch(url, opts)
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

function parseArgs(args) {
  const result = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(process.argv.slice(2))
const [cmd, sub, ...rest] = args._

function getAccountId() {
  return args['account-id'] || DEFAULT_ACCOUNT_ID
}

function denyWrite(operation) {
  if (READ_ONLY && !args['allow-write']) {
    return {
      error: `${operation} blocked: OpenClaw secure mode enforces read-only Meta Ads access. Pass --allow-write or set OPENCLAW_ADS_READ_ONLY=false only if you understand the risks.`,
    }
  }
  return null
}

async function main() {
  let result

  switch (cmd) {
    case 'accounts':
      switch (sub) {
        case 'list':
          result = await api('GET', '/me/adaccounts?fields=id,name,account_status')
          break
        default:
          result = { error: 'Unknown accounts subcommand. Use: list' }
      }
      break

    case 'campaigns':
      switch (sub) {
        case 'list': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          result = await api('GET', `/act_${accountId}/campaigns?fields=id,name,status,objective,daily_budget`)
          break
        }
        case 'insights': {
          if (!args.id) { result = { error: '--id required' }; break }
          const datePreset = args['date-preset'] || 'last_30d'
          const fields = encodeURIComponent(args.fields || DEFAULT_INSIGHT_FIELDS)
          result = await api('GET', `/${args.id}/insights?fields=${fields}&date_preset=${datePreset}`)
          break
        }
        case 'create': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          if (!args.name || !args.objective) { result = { error: '--name and --objective required' }; break }
          const blocked = denyWrite('Creating campaigns')
          if (blocked) { result = blocked; break }
          const body = {
            name: args.name,
            objective: args.objective,
            status: args.status || 'PAUSED',
            special_ad_categories: [],
          }
          result = await api('POST', `/act_${accountId}/campaigns`, body)
          break
        }
        case 'update': {
          if (!args.id || !args.status) { result = { error: '--id and --status required' }; break }
          const blocked = denyWrite('Updating campaigns')
          if (blocked) { result = blocked; break }
          result = await api('POST', `/${args.id}`, { status: args.status })
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, insights, create, update' }
      }
      break

    case 'adsets':
      switch (sub) {
        case 'list': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          result = await api('GET', `/act_${accountId}/adsets?fields=id,name,status,targeting,daily_budget,bid_amount`)
          break
        }
        default:
          result = { error: 'Unknown adsets subcommand. Use: list' }
      }
      break

    case 'ads':
      switch (sub) {
        case 'list': {
          if (!args['adset-id']) { result = { error: '--adset-id required' }; break }
          const fields = args.fields || 'id,name,status,creative{effective_object_story_id,object_story_spec,thumbnail_url,image_url,actor_id,title,body}'
          const params = new URLSearchParams({ fields })
          result = await api('GET', `/${args['adset-id']}/ads?${params}`)
          break
        }
        case 'insights': {
          if (!args.id) { result = { error: '--id required' }; break }
          const datePreset = args['date-preset'] || 'last_30d'
          const fields = encodeURIComponent(args.fields || DEFAULT_INSIGHT_FIELDS)
          result = await api('GET', `/${args.id}/insights?fields=${fields}&date_preset=${datePreset}`)
          break
        }
        default:
          result = { error: 'Unknown ads subcommand. Use: list, insights' }
      }
      break

    case 'creatives':
      switch (sub) {
        case 'list': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          const fields = args.fields || 'id,name,status,object_story_spec,thumbnail_url,image_url,body,title,asset_feed_spec'
          const params = new URLSearchParams({ fields })
          result = await api('GET', `/act_${accountId}/adcreatives?${params}`)
          break
        }
        default:
          result = { error: 'Unknown creatives subcommand. Use: list' }
      }
      break

    case 'audiences':
      switch (sub) {
        case 'list': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          result = await api('GET', `/act_${accountId}/customaudiences?fields=id,name,approximate_count`)
          break
        }
        case 'create-lookalike': {
          const accountId = getAccountId()
          if (!accountId) { result = { error: '--account-id required (or set META_AD_ACCOUNT_ID)' }; break }
          if (!args['source-id'] || !args.country) { result = { error: '--source-id and --country required' }; break }
          const blocked = denyWrite('Creating audiences')
          if (blocked) { result = blocked; break }
          result = await api('POST', `/act_${accountId}/customaudiences`, {
            name: args.name || 'Lookalike Audience',
            subtype: 'LOOKALIKE',
            origin_audience_id: args['source-id'],
            lookalike_spec: JSON.stringify({ type: 'similarity', country: args.country }),
          })
          break
        }
        default:
          result = { error: 'Unknown audiences subcommand. Use: list, create-lookalike' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          accounts: 'accounts [list]',
          campaigns: 'campaigns [list|insights|create|update] [--account-id <id>] [--id <id>] [--fields impressions,...] [--date-preset last_30d] [--name <name>] [--objective <obj>] [--status <status>]',
          adsets: 'adsets [list] [--account-id <id>]',
          ads: 'ads [list|insights] [--adset-id <id>] [--id <id>] [--fields ...] [--date-preset last_30d]',
          creatives: 'creatives [list] [--account-id <id>] [--fields ...]',
          audiences: 'audiences [list|create-lookalike] [--account-id <id>] [--source-id <id>] [--country US]',
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
