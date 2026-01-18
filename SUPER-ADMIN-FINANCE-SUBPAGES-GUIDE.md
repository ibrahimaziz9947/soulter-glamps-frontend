# Super Admin Finance Subpages - Implementation Guide

## Current State
- Super admin finance overview page links to existing `/admin/finance/*` pages
- Admin finance pages are fully functional but contain inline logic
- No component extraction has been done yet to avoid regressions

## Recommended Approach for Building Super Admin Finance Subpages

### Phase 1: Extract Shared Components (When Needed)

Create reusable components in `app/components/finance/`:

#### 1. **FinanceTable Component**
```tsx
// app/components/finance/FinanceTable.tsx
export interface FinanceTableColumn {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface FinanceTableProps {
  columns: FinanceTableColumn[]
  data: any[]
  loading?: boolean
  onRowClick?: (row: any) => void
}
```

#### 2. **FinanceFilters Component**
```tsx
// app/components/finance/FinanceFilters.tsx
interface FinanceFiltersProps {
  statusFilter: string
  onStatusChange: (status: string) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
  onApply: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  additionalFilters?: React.ReactNode
}
```

#### 3. **FinanceKPICards Component**
```tsx
// app/components/finance/FinanceKPICards.tsx
interface KPICard {
  label: string
  value: string | number
  subtitle?: string
  color?: string
  icon?: React.ReactNode
}

interface FinanceKPICardsProps {
  cards: KPICard[]
  loading?: boolean
}
```

#### 4. **FinanceForm Component**
```tsx
// app/components/finance/FinanceForm.tsx
interface FinanceFormField {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea'
  options?: { value: string; label: string }[]
  required?: boolean
}

interface FinanceFormProps {
  fields: FinanceFormField[]
  values: Record<string, any>
  onChange: (name: string, value: any) => void
  onSubmit: () => void
  loading?: boolean
}
```

### Phase 2: Create Super Admin Finance Subpages

#### Example: Income Page
```tsx
// app/super-admin/finance/income/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getSuperAdminIncome } from '@/src/services/super-admin-finance.api'
import { FinanceTable } from '@/app/components/finance/FinanceTable'
import { FinanceFilters } from '@/app/components/finance/FinanceFilters'
import { FinanceKPICards } from '@/app/components/finance/FinanceKPICards'

export default function SuperAdminIncomePage() {
  // State management
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Fetch data using super-admin API endpoint
  const loadIncome = async (filters) => {
    const data = await getSuperAdminIncome(filters)
    setIncome(data.items)
  }
  
  return (
    <div className="space-y-6">
      <h1>Income Management</h1>
      
      <FinanceKPICards cards={kpiCards} loading={loading} />
      
      <FinanceFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onApply={handleApplyFilters}
      />
      
      <FinanceTable
        columns={incomeColumns}
        data={income}
        loading={loading}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
```

### Phase 3: API Endpoints

Create corresponding super-admin API clients:

```tsx
// src/services/super-admin-finance.api.ts

export async function getSuperAdminIncome(params) {
  return apiClient('/super-admin/finance/income', params)
}

export async function getSuperAdminExpenses(params) {
  return apiClient('/super-admin/finance/expenses', params)
}

export async function getSuperAdminPayables(params) {
  return apiClient('/super-admin/finance/payables', params)
}

export async function getSuperAdminPurchases(params) {
  return apiClient('/super-admin/finance/purchases', params)
}
```

### Phase 4: Migration Strategy

1. **Start with one page** (e.g., Income) as a pilot
2. **Extract components** from the admin version as you build
3. **Test thoroughly** - ensure admin pages still work
4. **Gradually migrate** other finance pages using the same pattern
5. **Share components** between admin and super-admin versions

## Benefits of This Approach

✅ **No immediate regressions** - admin pages continue working as-is
✅ **Gradual migration** - extract components only when building super-admin pages
✅ **Code reuse** - both admin and super-admin use same UI components
✅ **Minimal duplication** - only layout and API calls differ
✅ **Easy maintenance** - fix once, works everywhere

## When to Start

Build super-admin finance subpages when:
- You need different permissions/actions than admin
- You need different data views or aggregations
- You need super-admin-specific workflows
- The direct links to admin pages are insufficient

## Current Recommendation

**Keep using the navigation cards approach** for now since:
- Admin finance pages are fully functional
- Super-admin can access them without restrictions
- No duplication or maintenance overhead
- Component extraction can wait until actually needed
