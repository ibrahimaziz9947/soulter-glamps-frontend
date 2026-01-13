# Payables API - Usage Examples

## Overview

The Payables API provides robust response normalization to prevent data structure mismatches. It handles both array-based and object-based API responses seamlessly.

## API Structure

All responses are normalized to:
```typescript
{
  success: boolean
  data: {
    items: T[]        // Always an array, never undefined
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
```

## Functions

### 1. fetchPayables()

Fetch paginated list of payables with filters.

```typescript
import { fetchPayables } from '@/src/services/payables.api'

// Basic usage
const response = await fetchPayables({
  page: 1,
  limit: 10
})

// With filters
const response = await fetchPayables({
  page: 1,
  limit: 10,
  status: 'UNPAID,PARTIAL',          // Filter by status (comma-separated)
  search: 'Acme Corp',                // Search vendor/reference
  currency: 'PKR',                    // Filter by currency
  purchaseDateFrom: '2026-01-01',     // Purchase date range
  purchaseDateTo: '2026-01-31',
  dueDateFrom: '2026-02-01',          // Due date range
  dueDateTo: '2026-02-28'
})

// Safe access - items is ALWAYS an array
const payables = response.data.items || []
const pagination = response.data.pagination

// Example: Display in component
payables.forEach(payable => {
  console.log(`${payable.vendorName}: ${payable.outstanding} outstanding`)
})
```

**Response Shape:**
```typescript
{
  success: true,
  data: {
    items: [
      {
        id: 'payable-123',
        purchaseId: '123',
        purchaseDate: '2026-01-15',
        dueDate: '2026-02-14',
        vendorName: 'Acme Corp',
        reference: 'INV-001',
        total: 100000,      // cents
        paid: 0,            // cents
        outstanding: 100000, // cents
        currency: 'PKR',
        status: 'UNPAID',
        purchase: { ... }
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3
    }
  }
}
```

---

### 2. fetchPayablesSummary()

Get aggregated statistics about payables.

```typescript
import { fetchPayablesSummary } from '@/src/services/payables.api'

// Basic usage
const response = await fetchPayablesSummary()

// With date filters
const response = await fetchPayablesSummary({
  purchaseDateFrom: '2026-01-01',
  purchaseDateTo: '2026-01-31',
  currency: 'PKR'
})

// Safe access
const summary = response.data
console.log(`Outstanding: ${summary.outstandingAmount} cents`)
console.log(`Unpaid count: ${summary.unpaidCount}`)
```

**Response Shape:**
```typescript
{
  success: true,
  data: {
    totalPayables: 25,           // Total count
    outstandingAmount: 2500000,  // cents
    unpaidCount: 15,
    partialCount: 5,
    paidCount: 5,
    totalAmount: 5000000         // cents
  }
}
```

---

### 3. payPurchase()

Record a payment for a purchase.

```typescript
import { payPurchase } from '@/src/services/payables.api'

// Basic payment
const response = await payPurchase(
  'purchase-123',  // purchaseId
  50000           // amountCents (500.00 PKR)
)

// With payment details
const response = await payPurchase(
  'purchase-123',
  50000,
  {
    paymentDate: '2026-01-15',
    paymentMethod: 'BANK_TRANSFER',
    reference: 'TXN-456',
    notes: 'Partial payment for January invoice'
  }
)

if (response.success) {
  console.log(`Payment ID: ${response.data.paymentId}`)
  console.log(`Remaining: ${response.data.remainingBalance} cents`)
  console.log(`Status: ${response.data.status}`)
}
```

**Response Shape:**
```typescript
{
  success: true,
  data: {
    paymentId: 'PAY-789',
    purchaseId: 'purchase-123',
    amountPaid: 50000,        // cents
    remainingBalance: 50000,  // cents
    status: 'PARTIAL'         // PAID | PARTIAL | UNPAID
  },
  message: 'Payment recorded successfully'
}
```

---

## React Component Example

```typescript
'use client'

import { useState, useEffect } from 'react'
import { 
  fetchPayables, 
  fetchPayablesSummary,
  payPurchase,
  type Payable,
  type PayablesSummary
} from '@/src/services/payables.api'
import { formatCurrency } from '@/src/utils/currency'

export default function PayablesExample() {
  const [payables, setPayables] = useState<Payable[]>([])
  const [summary, setSummary] = useState<PayablesSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('UNPAID,PARTIAL')

  // Load payables list
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        const response = await fetchPayables({
          page,
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter : undefined
        })

        // Safe access - items is ALWAYS an array
        setPayables(response.data.items || [])
        
      } catch (err) {
        console.error('Failed to load payables:', err)
        setPayables([]) // Safe fallback
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [page, statusFilter])

  // Load summary
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetchPayablesSummary()
        setSummary(response.data)
      } catch (err) {
        console.error('Failed to load summary:', err)
      }
    }

    loadSummary()
  }, [])

  // Handle payment
  const handlePay = async (purchaseId: string, amount: number) => {
    try {
      const response = await payPurchase(purchaseId, amount)
      
      if (response.success) {
        alert('Payment recorded!')
        // Refresh data
        setPage(1)
      }
    } catch (err) {
      console.error('Payment failed:', err)
      alert('Failed to record payment')
    }
  }

  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div>
          <p>Total: {summary.totalPayables}</p>
          <p>Outstanding: {formatCurrency(summary.outstandingAmount)}</p>
          <p>Unpaid: {summary.unpaidCount}</p>
        </div>
      )}

      {/* Payables List */}
      {loading ? (
        <p>Loading...</p>
      ) : payables.length === 0 ? (
        <p>No payables found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Due Date</th>
              <th>Outstanding</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payables.map(payable => (
              <tr key={payable.id}>
                <td>{payable.vendorName}</td>
                <td>{payable.dueDate}</td>
                <td>{formatCurrency(payable.outstanding)}</td>
                <td>
                  <button onClick={() => handlePay(payable.purchaseId, payable.outstanding)}>
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

---

## Error Handling

All functions throw errors that should be caught:

```typescript
try {
  const response = await fetchPayables({ page: 1 })
  
  // Safe access - items is ALWAYS an array
  const payables = response.data.items || []
  
} catch (error: any) {
  console.error('API Error:', error)
  
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 404) {
    // Show not found message
  } else {
    // Show generic error
    alert(error.message || 'Something went wrong')
  }
}
```

---

## Response Normalization

The API handles multiple response shapes:

### Shape A (Array)
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### Shape B (Object with items)
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {...}
  }
}
```

### Shape C (Legacy)
```json
{
  "success": true,
  "data": {
    "payables": [...],
    "pagination": {...}
  }
}
```

**All normalized to:**
```typescript
{
  success: true,
  data: {
    items: [...],
    pagination: {...}
  }
}
```

This ensures your components never crash due to inconsistent data structures!

---

## V1 vs V2

### V1 (Current)
- Fetches confirmed purchases
- Computes payables client-side
- Mock payment recording

### V2 (Future)
- Direct `/finance/payables` endpoint
- Server-side computation
- Real payment tracking with history

The API is designed to be forward-compatible. When V2 endpoints are ready, uncomment the API calls in `payables.api.ts` and your components will work without changes!

---

## TypeScript Types

```typescript
import { 
  Payable,
  PayablesSummary,
  PayableListParams,
  PaymentPayload,
  PayableListResponse,
  PayablesSummaryResponse,
  PaymentResponse
} from '@/src/services/payables.api'

// Use in your components
const [payables, setPayables] = useState<Payable[]>([])
const [summary, setSummary] = useState<PayablesSummary | null>(null)
```

---

## Best Practices

1. **Always use optional chaining for safety:**
   ```typescript
   const items = response.data?.items || []
   ```

2. **Handle loading and error states:**
   ```typescript
   if (loading) return <Spinner />
   if (error) return <ErrorMessage error={error} />
   if (payables.length === 0) return <EmptyState />
   ```

3. **Use debouncing for search/filters:**
   ```typescript
   useEffect(() => {
     const timeoutId = setTimeout(() => {
       loadPayables()
     }, 300)
     return () => clearTimeout(timeoutId)
   }, [searchQuery])
   ```

4. **Reset page when filters change:**
   ```typescript
   const handleFilterChange = (newFilter: string) => {
     setFilter(newFilter)
     setPage(1) // Reset to first page
   }
   ```

5. **Show toast notifications for actions:**
   ```typescript
   const handlePay = async () => {
     try {
       await payPurchase(...)
       showToast('Payment recorded successfully', 'success')
     } catch (err) {
       showToast('Failed to record payment', 'error')
     }
   }
   ```
