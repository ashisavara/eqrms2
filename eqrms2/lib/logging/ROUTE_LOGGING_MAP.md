# RMS Logging Route Map

Quick checklist of `(rms)` route coverage and expected log props.

## Primary static routes

| Route | segment | pagePath |
|---|---|---|
| `/mandate` | `mandate` | `/mandate` |
| `/investments` | `investments` | `/investments` |
| `/shortlist` | `investments` | `/shortlist` |
| `/categories` | `funds` | `/categories` |
| `/categories/conservative` | `funds` | `/categories/conservative` |
| `/categories/balanced` | `funds` | `/categories/balanced` |
| `/categories/aggressive` | `funds` | `/categories/aggressive` |
| `/funds` | `funds` | `/funds` |
| `/funds/all` | `rms` | `/funds/all` |
| `/funds/changelog` | `rms` | `/funds/changelog` |
| `/crm` | `crm` | `/crm` |
| `/crm/sales` | `crm` | `/crm/sales` |
| `/crm/all` | `crm` | `/crm/all` |
| `/crm/tags` | `crm` | `/crm/tags` |
| `/companies` | `eqrms` | `/companies` |
| `/sectors` | `eqrms` | `/sectors` |
| `/academy` | `blogs` | `/academy` |
| `/kyc` | `internal` | `/kyc` |
| `/ime-view` | `internal` | `/ime-view` |
| `/internal/documents` | `internal` | `/internal/documents` |
| `/internal/link-login-lead` | `internal` | `/internal/link-login-lead` |
| `/internal/public-site` | `internal` | `/internal/public-site` |
| `/internal/public-site/blog` | `internal` | `/internal/public-site/blog` |
| `/internal/public-site/blog/add` | `internal` | `/internal/public-site/blog/add` |
| `/internal/public-site/pmsblog` | `internal` | `/internal/public-site/pmsblog` |
| `/internal/public-site/pmsblog/add` | `internal` | `/internal/public-site/pmsblog/add` |
| `/internal/public-site/media-interview` | `internal` | `/internal/public-site/media-interview` |
| `/internal/public-site/media-interview/add` | `internal` | `/internal/public-site/media-interview/add` |
| `/internal/public-site/investment-query` | `internal` | `/internal/public-site/investment-query` |
| `/internal/public-site/investment-query/add` | `internal` | `/internal/public-site/investment-query/add` |
| `/protected` | `auth` | `/protected` |
| `/uservalidation` | `auth` | `/uservalidation` |

## Dynamic routes (`[id]` / `[slug]`)

| Route template | segment | id/slug source |
|---|---|---|
| `/funds/[slug]` | `funds` | `entitySlug=slug`, `entityId=fund.fund_id` |
| `/categories/[slug]` | `categories` | `entitySlug=slug`, `entityId=category.category_id` |
| `/assetclass/[slug]` | `assetclass` | `entitySlug=slug`, `entityId=assetClass.asset_class_id` |
| `/structure/[slug]` | `structure` | `entitySlug=slug`, `entityId=structure.structure_id` |
| `/amc/[slug]` | `amc` | `entitySlug=slug`, `entityId=AMC.id` |
| `/recommendations/[slug]` | `recommendations` | `entitySlug=slug`, `entityId=blog.id` |
| `/internal/edit/blogs/[slug]` | `internal-edit-blogs` | `entitySlug=slug`, `entityId=blog.id` |
| `/companies/[id]` | `companies` | `entityId=Number(id)` |
| `/crm/[id]` | `crm` | `entityId=Number(id)` |
| `/kyc/[id]` | `kyc` | `entityId=Number(id)` |
| `/internal/public-site/blog/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=blog.slug` |
| `/internal/public-site/blog/edit/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=blogData.slug` |
| `/internal/public-site/pmsblog/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=blog.slug` |
| `/internal/public-site/pmsblog/edit/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=blogData.slug` |
| `/internal/public-site/media-interview/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=mediaInterview.slug` |
| `/internal/public-site/media-interview/edit/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=mediaInterviewData.slug` |
| `/internal/public-site/investment-query/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=investmentQuery.slug` |
| `/internal/public-site/investment-query/edit/[id]` | `internal-public-site` | `entityId=Number(id)`, `entitySlug=investmentQueryData.slug` |

## Redirect-only primary routes

These call `logUserPageView(...)` directly before `redirect(...)`:

- `/assetclass`
- `/structure`
- `/recommendations`
- `/amc`
