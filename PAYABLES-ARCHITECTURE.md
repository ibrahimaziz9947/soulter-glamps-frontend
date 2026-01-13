# Payables API Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYABLES PAGE COMPONENT                       │
│                  (app/admin/finance/payables)                    │
│                                                                  │
│  • useState/useEffect hooks                                      │
│  • User interactions (filters, pay button)                       │
│  • Display logic (table, cards, modals)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ import { fetchPayables, ... }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PAYABLES API SERVICE                          │
│                 (src/services/payables.api.ts)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  fetchPayables(params)                                │      │
│  │  • Calls fetchPurchases()                             │      │
│  │  • Computes payables from purchases                   │      │
│  │  • Applies filters                                     │      │
│  │  • Returns normalized: { items, pagination }          │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  fetchPayablesSummary(params)                         │      │
│  │  • Fetches all payables                               │      │
│  │  • Computes aggregations                              │      │
│  │  • Returns summary stats                              │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  payPurchase(id, amount, details)                     │      │
│  │  • V1: Mock response                                  │      │
│  │  • V2: POST /finance/payments                         │      │
│  │  • Returns payment result                             │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  normalizeListResponse<T>()                           │      │
│  │  • Handles Shape A: { data: [...] }                   │      │
│  │  • Handles Shape B: { data: { items } }               │      │
│  │  • Handles Shape C: { data: { purchases } }           │      │
│  │  • Always returns: { items, pagination }              │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ import { apiClient }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PURCHASES API SERVICE                       │
│                 (src/services/purchases.api.ts)                  │
│                                                                  │
│  • fetchPurchases() - Get purchase records                       │
│  • Already has normalization logic                              │
│  • Returns: { purchases, pagination }                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ import { apiClient }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API CLIENT                               │
│                   (src/services/apiClient.ts)                    │
│                                                                  │
│  • Base fetch wrapper                                            │
│  • Adds auth headers                                             │
│  • Error handling                                                │
│  • JSON parsing                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│                                                                  │
│  V1: GET /finance/purchases?status=CONFIRMED                     │
│  V2: GET /finance/payables (future)                              │
│      POST /finance/payments (future)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Response Flow

```
Backend Response → API Client → Purchases API → Payables API → Component
     (varies)        (parsed)     (normalized)    (normalized)   (safe)
```

### Example Response Transformations:

**Backend returns Shape A:**
```json
{ "success": true, "data": [...], "pagination": {...} }
```
↓
**After normalizeListResponse():**
```json
{ "success": true, "data": { "items": [...], "pagination": {...} } }
```

**Backend returns Shape B:**
```json
{ "success": true, "data": { "purchases": [...] }, "pagination": {...} }
```
↓
**After normalizeListResponse():**
```json
{ "success": true, "data": { "items": [...], "pagination": {...} } }
```

## Data Flow for Payment

```
User clicks "Pay"
    │
    ├─> Opens modal
    │
    ├─> User enters amount
    │
    ├─> Clicks "Record Payment"
    │
    ▼
payPurchase(id, amount)
    │
    ├─> V1: Returns mock success
    │   V2: POST /finance/payments
    │
    ├─> Returns normalized response
    │
    ▼
Component updates
    │
    ├─> Shows success toast
    │
    ├─> Closes modal
    │
    ├─> Refreshes payables list
    │
    └─> Updates summary cards
```

## Filter Flow

```
User changes filter
    │
    ├─> Updates state (statusFilter, searchQuery, etc.)
    │
    ├─> useEffect triggers (debounced 300ms)
    │
    ▼
fetchPayables({ ...params })
    │
    ├─> V1: Fetches all confirmed purchases
    │   V2: Passes params to backend
    │
    ├─> Applies filters (V1: client-side, V2: server-side)
    │
    ├─> Returns normalized: { items, pagination }
    │
    ▼
Component re-renders
    │
    ├─> Updates table
    │
    ├─> Updates pagination
    │
    └─> Shows loading → data → empty state
```

## Type Safety Chain

```typescript
// 1. API defines types
export interface Payable { ... }
export interface PayableListResponse {
  success: boolean
  data: {
    items: Payable[]
    pagination: PaginationMeta
  }
}

// 2. API returns typed response
async function fetchPayables(): Promise<PayableListResponse>

// 3. Component uses types
const [payables, setPayables] = useState<Payable[]>([])
const response = await fetchPayables()
setPayables(response.data.items) // Type-safe!
```

## Error Handling Chain

```
Backend Error
    │
    ├─> apiClient catches fetch error
    │
    ├─> Throws ApiError with status/message
    │
    ▼
Payables API catches
    │
    ├─> Logs error
    │
    ├─> Re-throws or returns error response
    │
    ▼
Component catches
    │
    ├─> Sets error state
    │
    ├─> Shows error toast
    │
    └─> Displays error message in UI
```

## State Management

```
Component State:
├─ payables: Payable[]           (list data)
├─ summary: PayablesSummary      (aggregated stats)
├─ loading: boolean              (fetch in progress)
├─ error: string | null          (error message)
├─ page: number                  (current page)
├─ pagination: PaginationMeta    (pagination info)
├─ statusFilter: string          (filter value)
├─ searchQuery: string           (search value)
├─ dateFilters: string×4         (date ranges)
├─ payModalOpen: boolean         (modal state)
└─ toast: Toast | null           (notification)
```

## Key Principles

1. **Single Source of Truth**: API service handles all data logic
2. **Separation of Concerns**: Component only handles UI
3. **Type Safety**: Full TypeScript throughout
4. **Error Boundaries**: Errors handled at each layer
5. **Normalization**: Consistent data structure
6. **Immutability**: State updates use new objects
7. **Declarative**: React patterns (hooks, effects)
8. **Performance**: Debouncing, pagination, memoization ready
