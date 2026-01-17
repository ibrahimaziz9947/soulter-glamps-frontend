# Backend API Specification: Super Admin Bookings

## CRITICAL: Missing API Endpoint

The frontend is calling `/api/super-admin/bookings` but this endpoint **DOES NOT EXIST** in the backend yet.

This is why the bookings page shows zeros while the dashboard shows 33 bookings - the dashboard likely uses a different endpoint or mock data.

## Required Endpoint Implementation

### 1. GET /api/super-admin/bookings

**Purpose:** Fetch paginated list of all bookings with aggregates for super admin

**Authentication:** Requires SUPER_ADMIN role JWT token (sent in Authorization header)

**Query Parameters:**
```typescript
{
  from?: string        // YYYY-MM-DD format (inclusive)
  to?: string          // YYYY-MM-DD format (inclusive)
  status?: string      // CONFIRMED | PENDING | CANCELLED | COMPLETED
  glampId?: string     // Filter by specific glamp
  agentId?: string     // Filter by specific agent
  page?: number        // Page number (default: 1)
  limit?: number       // Items per page (default: 10, max: 100)
}
```

**Date Filtering Logic:**
```sql
-- CRITICAL: Use createdAt for consistency with dashboard
-- Convert dates to full-day boundaries to avoid timezone issues

WHERE 
  createdAt >= startOfDay(from) UTC
  AND createdAt <= endOfDay(to) UTC

-- Example for 2025-12-18 to 2026-01-17:
-- from: 2025-12-18T00:00:00.000Z
-- to:   2026-01-17T23:59:59.999Z
```

**Response Structure:**
```typescript
{
  success: true,
  data: {
    items: [
      {
        id: string
        glampId: string
        glampName?: string              // Join from Glamp table
        customerId: string
        customerName: string            // From Customer or booking data
        customerEmail?: string
        customerPhone?: string
        checkInDate: string             // ISO date
        checkOutDate: string            // ISO date
        guests: number
        totalAmountCents?: number       // CRITICAL: Use cents, not decimal
        amountPaidCents?: number
        remainingAmountCents?: number
        status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
        paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID'
        specialRequests?: string
        addOns?: string[]
        agentId?: string
        agentName?: string              // Join from Agent/User table
        commissionCents?: number        // If commission exists
        createdAt: string               // ISO timestamp
        updatedAt: string               // ISO timestamp
      }
    ],
    meta: {
      page: number                      // Current page
      limit: number                     // Items per page
      total: number                     // Total matching records
      totalPages: number                // Math.ceil(total / limit)
    },
    range: {
      from: string                      // Echo back the date range used
      to: string
    },
    aggregates: {
      totalBookings: number             // Count of all matching bookings
      confirmedCount: number            // Count where status = CONFIRMED
      pendingCount: number              // Count where status = PENDING
      cancelledCount: number            // Count where status = CANCELLED
      completedCount: number            // Count where status = COMPLETED
      revenueCents: number              // SUM(totalAmountCents) where status = CONFIRMED
    }
  }
}
```

**Implementation Steps:**

1. **Parse Query Params:**
```typescript
const from = req.query.from || defaultFrom // Last 30 days
const to = req.query.to || defaultTo       // Today
const status = req.query.status            // Optional
const page = parseInt(req.query.page) || 1
const limit = Math.min(parseInt(req.query.limit) || 10, 100)
const skip = (page - 1) * limit
```

2. **Build Prisma Where Clause:**
```typescript
const where = {
  createdAt: {
    gte: new Date(`${from}T00:00:00.000Z`),
    lte: new Date(`${to}T23:59:59.999Z`)
  },
  ...(status && { status: status.toUpperCase() }),
  ...(glampId && { glampId }),
  ...(agentId && { agentId })
}
```

3. **Fetch Data with Relations:**
```typescript
const [items, total] = await Promise.all([
  prisma.booking.findMany({
    where,
    skip,
    take: limit,
    include: {
      glamp: { select: { name: true } },
      customer: { select: { name: true, email: true, phone: true } },
      agent: { select: { name: true } },
      // Include commission if relation exists
    },
    orderBy: { createdAt: 'desc' }
  }),
  prisma.booking.count({ where })
])
```

4. **Calculate Aggregates:**
```typescript
const aggregates = await prisma.booking.aggregate({
  where,
  _count: { id: true },
  _sum: { totalAmountCents: true }
})

const statusCounts = await prisma.booking.groupBy({
  by: ['status'],
  where,
  _count: { id: true }
})

// Map to response format
const aggregatesResponse = {
  totalBookings: aggregates._count.id,
  confirmedCount: statusCounts.find(s => s.status === 'CONFIRMED')?._count.id || 0,
  pendingCount: statusCounts.find(s => s.status === 'PENDING')?._count.id || 0,
  cancelledCount: statusCounts.find(s => s.status === 'CANCELLED')?._count.id || 0,
  completedCount: statusCounts.find(s => s.status === 'COMPLETED')?._count.id || 0,
  revenueCents: aggregates._sum.totalAmountCents || 0
}
```

5. **Format Response:**
```typescript
return res.json({
  success: true,
  data: {
    items: items.map(formatBookingResponse), // Map Prisma model to API response
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    range: { from, to },
    aggregates: aggregatesResponse
  }
})
```

**Error Handling:**
```typescript
{
  success: false,
  error: "Unauthorized - SUPER_ADMIN role required",
  message: "Access denied"
}
```

### 2. GET /api/super-admin/bookings/:id

**Purpose:** Fetch single booking detail

**Response:**
```typescript
{
  success: true,
  data: {
    // Same structure as items above, but single object
  }
}
```

## Testing Checklist

After implementation, test with:

1. **curl/Postman:**
```bash
curl -X GET \
  'https://backend.url/api/super-admin/bookings?from=2025-12-18&to=2026-01-17&page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN'
```

2. **Expected Result:**
   - Should return ~33 bookings for the date range 2025-12-18 to 2026-01-17
   - aggregates.totalBookings should match dashboard count (33)
   - Response time should be < 500ms

3. **Edge Cases:**
   - No date params → defaults to last 30 days
   - Invalid status → ignore filter
   - Page > totalPages → return empty items array
   - No bookings found → return empty array with zero aggregates

## Database Schema Notes

Ensure Booking model has these fields:
- `id`, `glampId`, `customerId`, `agentId` (optional)
- `checkInDate`, `checkOutDate`, `guests`
- `totalAmountCents` (INTEGER, not DECIMAL)
- `amountPaidCents`, `remainingAmountCents`
- `status`, `paymentStatus`
- `specialRequests`, `addOns` (JSON or TEXT)
- `commissionCents`
- `createdAt`, `updatedAt`

Relations needed:
- Booking → Glamp (many-to-one)
- Booking → Customer (many-to-one)
- Booking → Agent (many-to-one, optional)

## Critical Issues to Avoid

1. **DO NOT** return amounts in decimal format - always use cents (integers)
2. **DO NOT** use `bookingDate` or `checkInDate` for date filtering - use `createdAt` for consistency with dashboard
3. **DO NOT** forget to set proper CORS headers if frontend and backend are on different domains
4. **DO NOT** return sensitive data like payment tokens or internal IDs
5. **ENSURE** timezone handling is consistent (use UTC)
6. **ENSURE** date filtering is inclusive on both ends
7. **ENSURE** status filter is case-insensitive and handles "all" or empty string

## Logging for Debug (NODE_ENV !== 'production')

Add temporary logs:
```typescript
console.log('[Super Admin Bookings API] Parsed filters:', { from, to, status, page, limit })
console.log('[Super Admin Bookings API] Prisma where:', where)
console.log('[Super Admin Bookings API] Results count:', items.length, 'Total:', total)
console.log('[Super Admin Bookings API] Aggregates:', aggregates)
```

Remove or gate behind DEBUG flag before production deployment.
