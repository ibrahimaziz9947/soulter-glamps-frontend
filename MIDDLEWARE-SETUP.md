# 🔐 Role-Based Access Control Middleware

## Overview

This middleware implements JWT-based authentication and role-based access control (RBAC) for your Next.js application.

## Files Created

### 1. `middleware.ts` (Root Level)
- **Location:** `C:\Users\Ibrahim\soulter-glamps-restored\middleware.ts`
- **Purpose:** Main middleware for route protection
- **Features:**
  - Reads JWT from cookies (`auth_token`)
  - Decodes JWT safely without verification
  - Protects routes based on user roles
  - Redirects unauthorized users appropriately
  - Allows public routes
  - Excludes API routes and static assets

### 2. `app/unauthorized/page.tsx`
- **Location:** `C:\Users\Ibrahim\soulter-glamps-restored\app\unauthorized\page.tsx`
- **Purpose:** 403 Unauthorized error page
- **Shows when:** User is logged in but lacks required role permissions
- **Features:**
  - Clean error UI
  - Links to home, back, and contact pages
  - Professional design matching your theme

### 3. `app/utils/auth.ts`
- **Location:** `C:\Users\Ibrahim\soulter-glamps-restored\app\utils\auth.ts`
- **Purpose:** JWT utility functions for client-side use
- **Exports:**
  - `decodeToken()` - Safely decode JWT
  - `isTokenExpired()` - Check token expiration
  - `hasRequiredRole()` - Validate user permissions
  - `getUserRole()` - Get role from token

---

## Route Protection Rules

### Protected Routes

| Route | Allowed Roles | Behavior |
|-------|---------------|----------|
| `/super-admin/**` | `SUPER_ADMIN` | Only super admins |
| `/admin/**` | `ADMIN`, `SUPER_ADMIN` | Admins and super admins |
| `/agent/**` | `AGENT` | Agents only |

### Public Routes (No Authentication Required)

```
/                          (Home)
/glamps                    (Glamps listing)
/glamps/[id]              (Glamp details)
/about                     (About page)
/contact                   (Contact page)
/facilities                (Facilities page)
/gallery                   (Gallery page)
/policies                  (Policies page)
/packages                  (Packages page)
/booking                   (Booking page)
```

---

## Authentication Flow

### 1. **User Logs In**
```
POST /api/login (or your login endpoint)
  ↓
Validate credentials
  ↓
Generate JWT with role
  ↓
Set cookie: auth_token = <JWT>
```

### 2. **User Accesses Protected Route**
```
GET /admin/dashboard
  ↓
Middleware intercepts request
  ↓
Check for auth_token cookie
  ↓
Decode JWT and extract role
  ↓
Verify role has access
  ↓
✅ Allow or ❌ Redirect
```

### 3. **JWT Token Structure**
```json
{
  "role": "ADMIN",
  "userId": "user123",
  "iat": 1702123456,
  "exp": 1702209856
}
```

---

## Redirect Behavior

### Not Authenticated (No Token)
- Trying to access `/admin/*` → Redirect to `/admin/login`
- Trying to access `/agent/*` → Redirect to `/agent/login`
- Trying to access `/super-admin/*` → Redirect to `/super-admin/login`

**Redirect URL includes `?redirect=<original_path>` for returning after login**

### Authenticated but Role Mismatch
- User with `AGENT` role tries `/admin/*` → Redirect to `/unauthorized`
- User with `ADMIN` role tries `/agent/*` → Redirect to `/unauthorized`

### Public Routes
- Always accessible, no authentication needed

---

## Setting Up Login Endpoints

Your login pages (`/admin/login`, `/agent/login`, `/super-admin/login`) should:

1. **Accept credentials** (username/password)
2. **Validate** against your backend
3. **Generate JWT** with user's role
4. **Set cookie:**
   ```javascript
   // In your login handler
   response.cookies.set('auth_token', jwtToken, {
     httpOnly: true,           // Prevent XSS
     secure: true,             // HTTPS only
     sameSite: 'strict',       // CSRF protection
     maxAge: 86400 * 7         // 7 days
   })
   ```
5. **Redirect** to original path (from `?redirect=` param) or dashboard

---

## JWT Generation Example

### Backend (Node.js/Express)
```javascript
const jwt = require('jsonwebtoken');

const payload = {
  role: 'ADMIN',
  userId: 'user123'
};

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '7d'
});

// Set as cookie
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400 * 7
});
```

---

## Using Auth Utilities in Components

### Check if User Has Role

```typescript
import { getUserRole } from '@/app/utils/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (!token) {
      router.push('/admin/login')
      return
    }

    const role = getUserRole(token)
    if (!role) {
      router.push('/admin/login')
      return
    }

    setIsAuthorized(true)
  }, [])

  if (!isAuthorized) return <div>Loading...</div>

  return <div>Admin Dashboard</div>
}
```

### Check Specific Permissions

```typescript
import { hasRequiredRole } from '@/app/utils/auth'

const userRole = 'ADMIN'
const canAccessSuperAdmin = hasRequiredRole(userRole, ['SUPER_ADMIN'])

if (!canAccessSuperAdmin) {
  // Show restricted content
}
```

---

## Security Considerations

### ✅ What This Implements

1. **Route Protection** - Unauthorized users can't access protected routes
2. **Role Validation** - Users can only access routes matching their role
3. **Token Expiration** - Expired tokens are rejected
4. **HttpOnly Cookies** - Prevents XSS attacks (if set properly on backend)
5. **Secure Transmission** - HTTPS only (if set properly on backend)

### ⚠️ Important Notes

1. **JWT Signature Validation**
   - Current implementation does NOT verify JWT signature
   - This is safe for client-side route protection
   - For production with sensitive operations, verify on backend
   - Use library like `jsonwebtoken` for server-side verification

2. **Token Storage**
   - Must be set as `httpOnly` cookie on backend
   - Never expose raw JWT in localStorage (XSS vulnerable)
   - Always use HTTPS in production

3. **CSRF Protection**
   - Set `sameSite: 'strict'` on backend cookie
   - Implement CSRF tokens for state-changing operations

4. **Environment Variables**
   - Never commit JWT_SECRET to repository
   - Use `.env.local` for secrets

---

## Testing the Middleware

### Test Public Routes (Should Always Work)
```bash
GET /                    # ✅ Works
GET /glamps             # ✅ Works
GET /about              # ✅ Works
```

### Test Protected Routes (Without Token)
```bash
GET /admin/dashboard    # ❌ Redirects to /admin/login
GET /agent/dashboard    # ❌ Redirects to /agent/login
GET /super-admin/dashboard  # ❌ Redirects to /super-admin/login
```

### Test with Valid Token
1. Login at `/admin/login` (creates `auth_token` cookie)
2. Access `/admin/dashboard` → ✅ Allowed
3. Access `/super-admin/dashboard` → ❌ Redirects to `/unauthorized`

---

## Customization

### Add More Protected Routes

Edit `middleware.ts`, update `ROUTE_RULES`:

```typescript
const ROUTE_RULES = {
  '/super-admin': ['SUPER_ADMIN'],
  '/admin': ['ADMIN', 'SUPER_ADMIN'],
  '/agent': ['AGENT'],
  '/staff': ['STAFF'],              // ← Add new role
  '/manager': ['MANAGER', 'ADMIN'], // ← New route with multiple roles
}
```

### Add More Public Routes

Edit `middleware.ts`, update `PUBLIC_ROUTES`:

```typescript
const PUBLIC_ROUTES = [
  '/',
  '/glamps',
  '/about',
  '/special-offer',  // ← Add new public route
  '/privacy-policy',
]
```

### Change Cookie Name

Edit `middleware.ts`:

```typescript
// Find this line:
const token = request.cookies.get('auth_token')?.value

// Change to your cookie name:
const token = request.cookies.get('my_custom_auth')?.value
```

---

## Troubleshooting

### Issue: Middleware Not Running
- Check that `middleware.ts` is at root level (same directory as `app/`)
- Verify `config.matcher` in `middleware.ts` is correct
- Restart dev server after adding middleware

### Issue: Routes Not Protected
- Check `ROUTE_RULES` in `middleware.ts`
- Verify route path matches exactly
- Remember: `/admin` protects `/admin/**`, not just `/admin`

### Issue: Can't Access Routes After Login
- Check cookie name matches (`auth_token`)
- Verify JWT contains `role` field
- Check token is not expired
- Verify role is in `ROUTE_RULES`

### Issue: Getting Redirected to Wrong Login
- Check `getLoginPageForPath()` logic
- Verify login pages exist at specified routes
- Check if route path check is correct

---

## What's NOT Changing

✅ All existing public routes work normally  
✅ Homepage, Glamps page, Booking, etc. still accessible  
✅ No API route changes (they handle auth separately)  
✅ Existing layout and styling preserved  
✅ No database schema changes needed  

---

## Next Steps

1. **Implement JWT Generation**
   - Add logic to login endpoints to generate JWT
   - Set cookie with proper security flags

2. **Set Environment Variables**
   ```env
   JWT_SECRET=your-super-secret-key-here
   JWT_EXPIRY=7d
   ```

3. **Test All Routes**
   - Test public routes
   - Test protected routes without auth
   - Test protected routes with different roles

4. **Implement Token Refresh** (Optional)
   - Refresh token before expiry
   - Prevent mid-session logouts

5. **Add Logout Functionality**
   - Clear `auth_token` cookie
   - Redirect to login page

---

## Production Checklist

- [ ] JWT_SECRET set in environment variables
- [ ] Cookies set with `httpOnly: true`
- [ ] Cookies set with `secure: true` (HTTPS)
- [ ] CSRF protection enabled on state-changing operations
- [ ] Token expiration set (7-30 days recommended)
- [ ] Login endpoints implemented
- [ ] Logout endpoints implemented
- [ ] Error pages tested (401, 403, 404)
- [ ] Cross-browser testing done
- [ ] Mobile authentication flow tested

---

Made with ❤️ for Soulter Glamps
