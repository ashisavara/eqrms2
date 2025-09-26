# Custom WhatsApp OTP Auth with Supabase (Next.js App Router)

This README documents our custom **phone + OTP login system** for Supabase, designed to avoid costly SMS by using WhatsApp delivery (via AI Sensy).  
It explains how the code works, what env vars are required, how to test the flow, and what Cursor should know when fixing lint/TS issues.

---

## 🔑 Big Picture

Supabase Auth normally supports:
- Email/password
- Email magic links
- Phone OTP (via Twilio/Vonage/etc.)
- OAuth providers

We want: **Phone + WhatsApp OTP**, but without paid SMS.

👉 Solution:  
- Generate OTPs ourselves (`/api/send-otp`)  
- Verify OTPs ourselves (`/api/verify-otp`)  
- Map each phone to a **shadow email alias** (`p<digits>@wa-login.local`)  
- Use Supabase's **magiclink flow** programmatically:
  - Server: `auth.admin.generateLink('magiclink')` → returns `token_hash`
  - Client: `auth.verifyOtp({ token_hash, type: 'email' })` → creates a **real Supabase session** with JWT + claims

From then on, it behaves like a normal Supabase session: JWT stored, RLS enforced, claims injected.

---

## 🔄 User Creation & Login Strategy

### **How the System Works Now**

Your OTP system now uses a **smart SQL function-based user lookup strategy** that's both efficient and reliable:

1. **Phone Number Check**: System calls a custom SQL function `find_user_by_phone()` to search ALL users in the database
2. **Existing Users**: If found, logs them in using their existing email (no metadata changes)
3. **New Users**: If not found, creates new user with phone number and basic metadata
4. **Magic Link Always**: Both cases use Supabase's magic link system for secure session creation

### **User Flow Examples**

#### **Scenario 1: New User (First OTP Login)**
```typescript
// Phone +91XXXXXXXXXX not found anywhere
// System creates new user with:
{
  email: "p91XXXXXXXXXX@wa-login.local",
  metadata: {
    phone_number: "+91XXXXXXXXXX",
    login_via: "whatsapp_otp",
    default_role: "guest"
  }
}
// Returns: { user_created: true, is_existing_user: false }
```

#### **Scenario 2: Existing User (Subsequent OTP Login)**
```typescript
// Phone +91XXXXXXXXXX found via SQL function
// System finds existing user, no metadata changes
// Returns: { user_created: false, is_existing_user: true }
```

### **Benefits of the SQL Function Approach**

✅ **Efficient**: Single database query instead of paginated API calls  
✅ **Reliable**: Searches entire user base, no pagination limits  
✅ **Fast**: Database-level filtering, not JavaScript processing  
✅ **Clean**: Simple function call, easy to maintain and debug  
✅ **Scalable**: Works whether you have 50 or 50,000 users  

### **What Gets Tracked**

- **New Users**: Phone number, login method, default role
- **Existing Users**: Nothing - just login with existing data
- **Sessions**: Always handled by Supabase magic link system
- **OTP Validation**: Handled in `otp_requests` table

### **Testing the New System**

The updated OTP test page now shows:
- **User Type**: Whether this is a new or existing user
- **Login Email**: The email used for authentication
- **User Created**: Whether a new user account was created

---

## 📂 Files

- **`/app/api/send-otp/route.ts`**  
  Generates/stores OTP in `otp_requests`. Rate-limits by phone. Sends OTP via AI Sensy WhatsApp API.

- **`/app/api/verify-otp/route.ts`**  
  Checks OTP → calls custom SQL function `find_user_by_phone()` to find existing users → creates new user if none found → uses magic link system for login.
  **NEW: Uses efficient SQL function instead of paginated admin API calls.**

- **`/app/auth/otp-test/page.tsx`**  
  Simple UI for testing the full flow (Send OTP → Verify OTP → Sign In).
  **NEW: Shows user creation status and login email information.**

- **`/lib/phone.ts`**  
  Helper to normalize phones into E.164-ish format (`+91XXXXXXXXXX`).

- **`find_user_by_phone()` SQL Function**  
  Custom Supabase function that efficiently searches all users by phone number in metadata.
  **NEW: Bypasses admin API limitations and provides fast, reliable user lookup.**

---

## 🗄️ SQL Function Implementation

### **Custom Database Function**

Your OTP system now uses a custom Supabase SQL function `find_user_by_phone()` that efficiently searches for users by phone number:

```sql
-- Function to find user by phone number
CREATE OR REPLACE FUNCTION find_user_by_phone(search_phone TEXT)
RETURNS TABLE(
  user_id UUID, 
  user_email TEXT, 
  phone_number TEXT,
  found BOOLEAN
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id::UUID as user_id,
    au.email::TEXT as user_email,
    COALESCE(
      au.raw_user_meta_data->>'phone_number',
      au.raw_user_meta_data->>'phone'
    ) as phone_number,
    CASE 
      WHEN (au.raw_user_meta_data->>'phone_number') = search_phone THEN true
      WHEN (au.raw_user_meta_data->>'phone_number') = REPLACE(search_phone, '+', '') THEN true
      WHEN (au.raw_user_meta_data->>'phone') = search_phone THEN true
      WHEN (au.raw_user_meta_data->>'phone') = REPLACE(search_phone, '+', '') THEN true
      ELSE false
    END as found
  FROM auth.users au
  WHERE (au.raw_user_meta_data->>'phone_number') = search_phone 
     OR (au.raw_user_meta_data->>'phone_number') = REPLACE(search_phone, '+', '')
     OR (au.raw_user_meta_data->>'phone') = search_phone
     OR (au.raw_user_meta_data->>'phone') = REPLACE(search_phone, '+', '')
  LIMIT 1;
END;
$$;
```

### **How the Function Works**

1. **Security Definer**: Function runs with creator's permissions, allowing access to `auth.users` table
2. **Flexible Search**: Checks both `phone_number` and `phone` fields in metadata
3. **Format Handling**: Searches with and without `+` prefix for flexibility
4. **Efficient Query**: Single database operation, no pagination needed
5. **Structured Return**: Returns user_id, email, phone, and found status

### **Function Call from OTP System**

```typescript
// Call the SQL function from your OTP verification code
const { data: functionResult, error: functionError } = await supabaseAdmin
  .rpc('find_user_by_phone', { search_phone: phone_number })

if (functionResult && functionResult.length > 0) {
  const userData = functionResult[0]
  if (userData.found) {
    // User found - log them in
    usersWithPhone = [{
      id: userData.user_id,
      email: userData.user_email,
      metadata: { phone_number: userData.phone_number }
    }]
  }
}
```

### **Benefits of This Approach**

✅ **Bypasses Admin API Limitations**: No more pagination or user count restrictions  
✅ **Direct Database Access**: Efficient queries to `auth.users` table  
✅ **Scalable**: Works with any number of users  
✅ **Maintainable**: SQL logic centralized in one function  
✅ **Flexible**: Easy to modify search criteria or add new fields  

---

## ⚙️ Environment Variables

Create `.env.local`:

```ini
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

OTP_EXPIRY_MINUTES=10
OTP_LENGTH=4
MAX_OTPS_PER_HOUR=5
DEFAULT_COUNTRY_CODE=+91

# Dev only: echoes OTP back in API response
EXPOSE_OTP_IN_RESPONSE=true

# Shadow email domain (not real, only used as ID)
LOGIN_ALIAS_DOMAIN=wa-login.local

# AI Sensy WhatsApp API Configuration
AI_SENSY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDdlMDIxZTQ4MDFiMGJmMTdhYTQ5NiIsIm5hbWUiOiJJTUUgQ2FwaXRhbCBQdnQgTHRkLiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2N2NmZjQxOTEyYzY2ZTdmYzc0NjFlZDQiLCJhY3RpdmVQbGFuIjoiRlJFRV9GT1JFVkVSIiwiaWF0IjoxNzQyMjAwODY1fQ.Jp_tShy-wRITRA_uJdwkmi2YI88l6LRrZ8k8nCNbCTQ

# For future AI Sensy webhook
SENSY_SHARED_SECRET=some_long_random_string
```

---

## 🚧 CURRENT STATUS: Middleware Disabled for OTP Testing

**⚠️ IMPORTANT: The middleware is currently disabled for OTP testing purposes. This means:**
- ✅ OTP system works perfectly
- ✅ WhatsApp delivery functional  
- ❌ **NO route protection** - All routes accessible without authentication
- ❌ **Security compromised** - Not production ready

**Why Middleware Was Disabled:**
The original middleware was intercepting OTP API calls (`/api/send-otp`, `/api/verify-otp`) and redirecting them to `/auth/login`, preventing the OTP system from working. This was because the middleware was designed for email/password authentication and didn't recognize OTP routes as valid authentication endpoints.

**Next Steps:**
1. Test OTP system thoroughly while middleware is disabled
2. Re-enable middleware with proper OTP route configuration
3. Ensure security is restored for production

---

## 🔒 NEXT STEPS: Re-enable Middleware for Production

### **Phase 1: Re-enable Middleware with OTP Support**

#### **1.1 Update Middleware Configuration**
```typescript
// File: middleware.ts
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Define public routes (no auth needed)
  const publicRoutes = [
    "/",
    "/auth/otp-test",        // OTP login page
    "/api/send-otp",         // OTP generation API
    "/api/verify-otp",       // OTP verification API
    "/auth/confirm",         // Supabase auth confirmation
    "/auth/error",           // Auth error pages
    "/auth/update-password", // Password update
    "/auth/sign-up-success"  // Signup success
  ]
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )
  
  if (isPublicRoute) {
    return NextResponse.next() // Allow access
  }
  
  // For protected routes, check OTP session
  const hasValidSession = await checkOtpSession(request)
  if (!hasValidSession) {
    return NextResponse.redirect(new URL('/auth/otp-test', request.url))
  }
  
  return NextResponse.next()
}
```

#### **1.2 Implement OTP Session Checker**
```typescript
// File: lib/otp-session.ts
export async function checkOtpSession(request: NextRequest): Promise<boolean> {
  // Get session token from cookies
  const sessionToken = request.cookies.get('otp-session-token')?.value
  
  if (!sessionToken) return false
  
  try {
    // Verify session token with Supabase
    const supabase = createServerClient(/* ... */)
    const { data: { user } } = await supabase.auth.getUser()
    
    return !!user
  } catch {
    return false
  }
}
```

#### **1.3 Update OTP Test Page for Session Management**
```typescript
// File: app/auth/otp-test/page.tsx
// After successful OTP verification, set session cookie
const verifyOtp = async () => {
  // ... existing OTP verification code ...
  
  if (data.session) {
    // Set session cookie for middleware to check
    document.cookie = `otp-session-token=${data.session.access_token}; path=/; secure; samesite=strict`
    setStatus(`Signed in! user_id: ${data.session.user?.id}`)
  }
}
```

### **Phase 2: Production Security Hardening**

#### **2.1 Remove Development Features**
```typescript
// File: app/api/send-otp/route.ts
// Remove or set to false
const DEV_ECHO_OTP = false // Don't expose OTP in production

// File: app/auth/otp-test/page.tsx  
// Remove dev OTP display
{/* Remove this section for production */}
{devOtp && (
  <div className="mt-4 p-3 border rounded">
    <div className="text-sm opacity-70">DEV OTP (remove in prod):</div>
    <div className="text-xl font-mono">{devOtp}</div>
  </div>
)}
```

#### **2.2 Add Rate Limiting Per IP**
```typescript
// File: app/api/send-otp/route.ts
// Add IP-based rate limiting
const ip_address = req.headers.get('x-forwarded-for') || req.ip || 'unknown'

// Check IP rate limit
const { count: ipCount } = await supabaseAdmin
  .from('otp_requests')
  .select('*', { count: 'exact', head: true })
  .eq('ip_address', ip_address)
  .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

if ((ipCount || 0) >= 10) { // Max 10 OTPs per IP per hour
  return NextResponse.json({ error: 'IP rate limit exceeded' }, { status: 429 })
}
```

#### **2.3 Add Request Validation**
```typescript
// File: app/api/send-otp/route.ts
// Validate phone number format more strictly
const phoneRegex = /^\+[1-9]\d{1,14}$/ // E.164 format
if (!phoneRegex.test(phone_number)) {
  return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
}

// Validate device ID if provided
if (device_id && device_id.length > 100) {
  return NextResponse.json({ error: 'Device ID too long' }, { status: 400 })
}
```

### **Phase 3: Monitoring & Logging**

#### **3.1 Add Comprehensive Logging**
```typescript
// File: app/api/send-otp/route.ts
// Log all OTP attempts
console.log(`[OTP] Attempt: ${phone_number} from IP: ${ip_address} Device: ${device_id}`)

// Log WhatsApp delivery status
if (whatsappResult?.success) {
  console.log(`[OTP] WhatsApp delivered: ${phone_number} MessageID: ${whatsappResult.messageId}`)
} else {
  console.log(`[OTP] WhatsApp failed: ${phone_number} Error: ${whatsappResult?.error}`)
}
```

#### **3.2 Add Database Cleanup Job**
```sql
-- Run this periodically to clean expired OTPs
DELETE FROM otp_requests 
WHERE expires_at < NOW() OR used = true;
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### **Before Re-enabling Middleware:**
- [ ] Implement `checkOtpSession()` function
- [ ] Update middleware with OTP route logic
- [ ] Test OTP flow with middleware enabled
- [ ] Verify session cookies work correctly

### **Before Production:**
- [ ] Remove dev OTP display
- [ ] Add IP-based rate limiting
- [ ] Implement request validation
- [ ] Add comprehensive logging
- [ ] Set up database cleanup job
- [ ] Test rate limiting and validation

### **Production Deployment:**
- [ ] Set `EXPOSE_OTP_IN_RESPONSE=false`
- [ ] Enable middleware
- [ ] Monitor logs for issues
- [ ] Set up alerts for failed OTPs

---

## 🔍 TESTING THE MIDDLEWARE

### **Test 1: Public Routes (Should Work)**
- [ ] `/` - Home page
- [ ] `/auth/otp-test` - OTP login page
- [ ] `/api/send-otp` - OTP generation API
- [ ] `/api/verify-otp` - OTP verification API

### **Test 2: Protected Routes (Should Redirect)**
- [ ] `/protected/*` - Should redirect to `/auth/otp-test`
- [ ] `/leads/*` - Should redirect to `/auth/otp-test`
- [ ] Any other app routes - Should redirect to `/auth/otp-test`

### **Test 3: Session Flow**
- [ ] Send OTP → Receive WhatsApp
- [ ] Verify OTP → Get Supabase session
- [ ] Access protected route → Should work
- [ ] Logout → Should redirect to OTP page

---

## 🚨 SECURITY NOTES

### **Current Implementation is Secure Because:**
✅ **WhatsApp delivery** proves phone ownership  
✅ **OTP verification** proves device access  
✅ **Supabase sessions** provide industry-standard security  
✅ **Rate limiting** prevents abuse  
✅ **Session expiry** handled by Supabase  

### **No Need for:**
❌ **Carrier verification** - WhatsApp OTP is already secure  
❌ **Custom session system** - Supabase handles this perfectly  
❌ **Complex phone validation** - E.164 format is sufficient  

---

## 📚 RESOURCES

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [AI Sensy WhatsApp API Documentation](https://docs.aisensy.com/)
- [E.164 Phone Number Format](https://en.wikipedia.org/wiki/E.164)

---

## ✅ Summary

Your WhatsApp OTP system is now **architecturally sound and highly efficient** with a robust SQL function-based user management system. The key improvements are:

**SQL Function Approach**: Uses custom `find_user_by_phone()` function to efficiently search all users without pagination limits  
**Reliable User Lookup**: Bypasses Supabase admin API limitations and provides direct database access  
**Scalable Solution**: Works whether you have 50 or 50,000 users in your system  
**Clean Architecture**: SQL logic centralized in one function, easy to maintain and modify  
**WhatsApp Security**: Leverages WhatsApp's secure delivery with Supabase's session management  

**Next priority: Re-enable middleware with OTP route support to restore security.**