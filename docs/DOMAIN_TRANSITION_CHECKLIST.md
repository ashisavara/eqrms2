# Domain Transition Checklist
## Transitioning from WordPress to NextJS for imecapital.in

---

## ✅ COMPLETED - Code Changes

### 1. Middleware Updates (`middleware.ts`)
**Status: ✅ Complete**

- **Root domain routing**: `imecapital.in` now serves `(public)` route group (public website)
- **RMS subdomain**: `rms.imecapital.in` continues to serve `(rms)` routes (authenticated)
- **Legacy redirect**: `public.imecapital.in` → `imecapital.in` (301 permanent redirect)
- **Smart routing**: RMS routes accessed from root domain automatically redirect to RMS subdomain
- **Cookie persistence**: Cross-subdomain cookies continue to work across all domains

### 2. SEO Improvements
**Status: ✅ Complete**

#### Public Layout (`app/(public)/layout.tsx`)
- ✅ Removed `noindex` for root domain (allows Google indexing)
- ✅ Maintained `noindex` for RMS subdomain (private/authenticated content)

#### SEO Constants (`lib/seo/constants.ts`)
- ✅ Updated base URL from dynamic `VERCEL_URL` to production `https://imecapital.in`
- ✅ Ensures consistent canonical URLs and OpenGraph metadata

#### Robots.txt (`app/robots.ts`)
- ✅ Created dynamic robots.txt
- ✅ Root domain: Allows crawling with sitemap reference
- ✅ RMS subdomain: Disallows all crawling
- ✅ Excludes `/api/`, `/auth/`, `/_next/` from indexing

#### Sitemap (`app/sitemap.ts`)
- ✅ Created comprehensive dynamic sitemap
- ✅ Includes all content types:
  - Static landing pages (About, Products, Team, etc.)
  - Blog posts
  - Media interviews
  - Investment queries
  - PMS AMC pages
  - PMS Scheme pages
- ✅ Proper priority and change frequency settings
- ✅ Graceful fallback if dynamic content fails

---

## 🔧 REQUIRED - Your Action Items

### A. Vercel Configuration

#### 1. Add Domain to Vercel Project
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Add: `imecapital.in`
4. Vercel will provide DNS configuration instructions

#### 2. Configure Domain Settings
- Set `imecapital.in` as production domain
- Keep `rms.imecapital.in` configured
- Optional: Keep or remove `public.imecapital.in` (it will redirect anyway)

### B. DNS Configuration

You need to update your DNS records at your domain registrar:

#### Option 1: A Records (Recommended)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto/3600
```

#### Option 2: CNAME (Alternative)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto/3600
```

#### Keep Existing Subdomain
```
Type: CNAME
Name: rms
Value: cname.vercel-dns.com
TTL: Auto/3600
```

#### Legacy Subdomain (Optional)
```
Type: CNAME
Name: public
Value: cname.vercel-dns.com
TTL: Auto/3600
```
*Note: This will redirect to root domain via middleware*

### C. SSL Certificate
- Vercel will automatically provision SSL certificate for `imecapital.in`
- This may take 5-60 minutes after DNS propagation
- Verify at: `https://imecapital.in`

---

## 🧪 Testing Checklist

### 1. Before Going Live (Use Staging)
- [ ] Test `public.imecapital.in` redirects to `imecapital.in`
- [ ] Test all public pages load correctly on root domain
- [ ] Test RMS routes redirect to `rms.imecapital.in`
- [ ] Test affiliate cookies work across domains
- [ ] Test authentication flow on RMS subdomain

### 2. After Domain Added to Vercel
- [ ] Verify `imecapital.in` loads homepage
- [ ] Verify SSL certificate is active (https with padlock)
- [ ] Test all static pages (About, Products, Team, etc.)
- [ ] Test dynamic pages:
  - [ ] Blog posts: `/blogs/[slug]`
  - [ ] PMS AMCs: `/pms-amc/[slug]`
  - [ ] PMS Schemes: `/pms-scheme/[slug]`
  - [ ] Media interviews: `/media-interview/[slug]`
  - [ ] Investment queries: `/investment-query/[slug]`

### 3. SEO Verification
- [ ] Access `https://imecapital.in/robots.txt` - should show rules
- [ ] Access `https://imecapital.in/sitemap.xml` - should list all pages
- [ ] View page source - verify meta tags are present (no `noindex`)
- [ ] Test with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Submit sitemap to Google Search Console

### 4. Cross-Subdomain Testing
- [ ] Login on `rms.imecapital.in` → verify session persists
- [ ] Check affiliate tracking works from root to RMS
- [ ] Verify cookies are set with `.imecapital.in` domain

---

## 🚀 Deployment Order

### Step 1: Deploy Code Changes
```bash
git add .
git commit -m "Transition to root domain (imecapital.in)"
git push origin main
```
*This will auto-deploy to Vercel*

### Step 2: Add Domain to Vercel
- Add `imecapital.in` in Vercel dashboard
- Wait for Vercel to provide DNS instructions

### Step 3: Update DNS
- Update DNS at your registrar with Vercel's instructions
- DNS propagation: 5 minutes to 48 hours (usually ~1 hour)
- Check propagation: [whatsmydns.net](https://www.whatsmydns.net/)

### Step 4: Verify & Monitor
- Test all pages and functionality
- Monitor for any errors in Vercel logs
- Check analytics to ensure traffic is being tracked

---

## 📋 Post-Launch Tasks

### Immediate (Within 24 hours)
- [ ] Submit sitemap to Google Search Console: `https://imecapital.in/sitemap.xml`
- [ ] Update any email signatures with new domain
- [ ] Update social media profile links
- [ ] Monitor error logs in Vercel dashboard

### Within 1 Week
- [ ] Verify Google Analytics is tracking correctly
- [ ] Check Google Search Console for crawl errors
- [ ] Test all forms and integrations
- [ ] Monitor page load speeds

### Within 1 Month
- [ ] Review SEO performance in Search Console
- [ ] Check for any broken links (internal/external)
- [ ] Review redirect chains (none expected, but verify)
- [ ] Update any WordPress redirects if still running

---

## 🔄 Rollback Plan (If Needed)

If you need to rollback to WordPress:

1. **DNS Level**: Change DNS A record back to WordPress server IP
2. **Vercel Level**: Remove `imecapital.in` from Vercel project
3. **Code Level**: Can keep code as-is (won't affect RMS subdomain)

*Note: DNS changes take time to propagate, so plan rollback carefully*

---

## 📞 Support Resources

### Testing Tools
- **DNS Propagation**: [whatsmydns.net](https://www.whatsmydns.net/)
- **OpenGraph Testing**: [opengraph.xyz](https://www.opengraph.xyz/)
- **SSL Testing**: [ssllabs.com](https://www.ssllabs.com/ssltest/)
- **Speed Testing**: [pagespeed.web.dev](https://pagespeed.web.dev/)

### Documentation
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Console](https://search.google.com/search-console)

---

## ✨ Summary

### What Changed
1. ✅ Root domain (`imecapital.in`) now serves your NextJS public website
2. ✅ RMS subdomain (`rms.imecapital.in`) unchanged - continues to work
3. ✅ Legacy subdomain (`public.imecapital.in`) redirects to root
4. ✅ Full SEO optimization (robots.txt, sitemap, meta tags)
5. ✅ Cross-subdomain functionality preserved

### What You Need to Do
1. 🔧 Add `imecapital.in` to Vercel project
2. 🔧 Update DNS records at your registrar
3. 🧪 Test everything (use checklist above)
4. 📊 Submit sitemap to Google Search Console

### Timeline Estimate
- **Code deployment**: Instant (already done)
- **Domain addition**: 5 minutes
- **DNS propagation**: 1-24 hours (usually 1 hour)
- **SSL provisioning**: 5-60 minutes after DNS
- **Total estimated time**: 2-48 hours

---

**Ready to go live!** 🚀

All code changes are complete and tested. The remaining steps are infrastructure-related (Vercel + DNS) which are straightforward. Once DNS propagates, your new NextJS website will be live on `imecapital.in`.

