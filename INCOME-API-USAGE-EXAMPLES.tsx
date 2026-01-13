/**
 * Income API & Currency Utils - Usage Examples
 * 
 * This file demonstrates how to use the Income API service and currency utilities
 * Copy these patterns into your components as needed
 */

import { useState } from 'react'
import {
  getIncomeList,
  getIncomeSummary,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  submitIncome,
  approveIncome,
  rejectIncome,
  type Income,
  type IncomePayload,
} from '@/src/services/income.api'

import {
  centsToDisplay,
  displayToCents,
  formatCurrency,
  formatCompactCurrency,
  isValidCurrencyInput,
  sanitizeCurrencyInput,
  safeParseFloat,
  addCents,
  subtractCents,
  percentageOfCents,
} from '@/src/utils/currency'

/* =========================
   CURRENCY CONVERSION EXAMPLES
========================= */

// ✅ CORRECT: Convert user input to cents before sending to backend
export function handleFormSubmit(formAmount: string) {
  const amountInCents = displayToCents(formAmount) // "123.45" → 12345
  
  const payload: IncomePayload = {
    source: 'BOOKING', // BOOKING | MANUAL | OTHER
    status: 'CONFIRMED', // DRAFT | CONFIRMED | CANCELLED
    amount: amountInCents, // ✅ Send as cents (integer)
    currency: 'PKR', // PKR | USD | EUR | GBP
    dateReceived: '2026-01-15', // ISO date string
    reference: 'INV-12345',
    notes: 'Booking payment received',
    bookingId: 'uuid-here', // Required when source is BOOKING
  }
  
  return createIncome(payload)
}

// ✅ CORRECT: Convert cents from backend to display value
export function displayIncomeAmount(income: Income) {
  const displayValue = centsToDisplay(income.amount) // 12345 → "123.45"
  const formattedValue = formatCurrency(income.amount) // 12345 → "PKR 123.45"
  
  return {
    raw: displayValue, // For input fields: "123.45"
    formatted: formattedValue, // For display: "PKR 123.45"
  }
}

// ❌ WRONG: Do NOT send decimal strings to backend
export function incorrectUsage(formAmount: string) {
  const payload = {
    source: 'MANUAL',
    amount: parseFloat(formAmount), // ❌ WRONG: 123.45 (decimal)
    dateReceived: '2026-01-15',
  }
  // Backend expects integer cents, not decimal!
}

/* =========================
   API USAGE EXAMPLES
========================= */

// Example 1: Fetch income list with filters
export async function fetchFilteredIncome() {
  try {
    const response = await getIncomeList({
      page: 1,
      limit: 10,
      status: 'APPROVED',
      category: 'booking',
      search: 'payment',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    })
    
    console.log('Total records:', response.data.pagination.total)
    console.log('Total amount (cents):', response.data.totalAmount)
    console.log('Total amount (display):', formatCurrency(response.data.totalAmount))
    
    // Convert each income amount to display
    const incomeWithDisplayAmounts = response.data.income.map(inc => ({
      ...inc,
      displayAmount: centsToDisplay(inc.amount),
      formattedAmount: formatCurrency(inc.amount),
    }))
    
    return incomeWithDisplayAmounts
  } catch (error) {
    console.error('Failed to fetch income:', error)
    throw error
  }
}

// Example 2: Get income summary
export async function fetchIncomeSummary() {
  try {
    const response = await getIncomeSummary({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    })
    
    // All amounts are in cents, convert to display
    return {
      total: formatCurrency(response.data.totalIncome),
      approved: formatCurrency(response.data.approvedIncome),
      pending: formatCurrency(response.data.pendingIncome),
      draft: formatCurrency(response.data.draftIncome),
      rejected: formatCurrency(response.data.rejectedIncome),
    }
  } catch (error) {
    console.error('Failed to fetch summary:', error)
    throw error
  }
}

// Example 3: Create new income (form submission)
export async function handleCreateIncome(formData: {
  source: string // BOOKING | MANUAL | OTHER
  amount: string // User input as string: "123.45"
  currency: string // PKR | USD | EUR | GBP
  dateReceived: string
  notes: string
  bookingId?: string
}) {
  try {
    // Validate input
    if (!isValidCurrencyInput(formData.amount)) {
      throw new Error('Invalid amount format')
    }
    
    // Convert to cents
    const amountInCents = displayToCents(formData.amount)
    
    const payload: IncomePayload = {
      source: formData.source,
      status: 'DRAFT',
      amount: amountInCents, // ✅ Send as cents
      currency: formData.currency,
      dateReceived: formData.dateReceived,
      notes: formData.notes,
      bookingId: formData.bookingId,
    }
    
    const response = await createIncome(payload)
    
    console.log('Income created:', response.data.id)
    return response.data
  } catch (error) {
    console.error('Failed to create income:', error)
    throw error
  }
}

// Example 4: Update existing income
export async function handleUpdateIncome(
  incomeId: string,
  formData: { amount: string; notes: string; currency: string }
) {
  try {
    const amountInCents = displayToCents(formData.amount)
    
    const response = await updateIncome(incomeId, {
      amount: amountInCents,
      currency: formData.currency,
      notes: formData.notes,
    })
    
    return response.data
  } catch (error) {
    console.error('Failed to update income:', error)
    throw error
  }
}

// Example 5: Workflow actions
export async function handleWorkflowActions(incomeId: string) {
  try {
    // Submit for approval
    await submitIncome(incomeId)
    
    // Approve with optional comment
    await approveIncome(incomeId, 'Looks good!')
    
    // Reject with required reason
    await rejectIncome(incomeId, 'Missing receipt')
    
  } catch (error) {
    console.error('Workflow action failed:', error)
    throw error
  }
}

/* =========================
   FORM INPUT HANDLING EXAMPLES
========================= */

// Example: Currency input field with validation
export function CurrencyInputExample() {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    
    // Sanitize input
    const cleaned = sanitizeCurrencyInput(input)
    setAmount(cleaned)
    
    // Validate
    if (cleaned && !isValidCurrencyInput(cleaned)) {
      setError('Invalid amount format')
    } else {
      setError('')
    }
  }
  
  const handleSubmit = () => {
    const amountInCents = displayToCents(amount)
    console.log('Amount in cents:', amountInCents)
    // Send to API...
  }
  
  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={handleChange}
        placeholder="0.00"
      />
      {error && <p className="text-red-500">{error}</p>}
      <p>Preview: {formatCurrency(displayToCents(amount))}</p>
    </div>
  )
}

/* =========================
   DISPLAY FORMATTING EXAMPLES
========================= */

// Example: Display income in table
export function IncomeTableRow({ income }: { income: Income }) {
  // Generate derived title based on source
  const title = income.source === 'BOOKING' 
    ? 'Booking Income' 
    : income.source === 'MANUAL' 
    ? 'Manual Income' 
    : 'Other Income'
    
  return (
    <tr>
      <td>{title}</td>
      <td>{formatCurrency(income.amount)}</td> {/* PKR 123.45 */}
      <td>{income.dateReceived || income.createdAt}</td>
      <td>{income.status}</td>
    </tr>
  )
}

// Example: Display summary cards
export function IncomeSummaryCard({ totalCents }: { totalCents: number }) {
  return (
    <div>
      <p>Total Income</p>
      <p className="text-3xl">{formatCurrency(totalCents)}</p>
      <p className="text-sm">{formatCompactCurrency(totalCents)}</p>
    </div>
  )
}

/* =========================
   CALCULATION EXAMPLES
========================= */

// Example: Calculate totals
export function calculateTotals(incomeList: Income[]) {
  const totalCents = incomeList.reduce((sum, inc) => addCents(sum, inc.amount), 0)
  
  return {
    totalCents,
    totalDisplay: formatCurrency(totalCents),
    averageCents: Math.round(totalCents / incomeList.length),
  }
}

// Example: Calculate commission (10% of income)
export function calculateCommission(incomeCents: number) {
  const commissionCents = percentageOfCents(incomeCents, 10)
  
  return {
    income: formatCurrency(incomeCents),
    commission: formatCurrency(commissionCents),
    net: formatCurrency(subtractCents(incomeCents, commissionCents)),
  }
}

/* =========================
   ERROR HANDLING EXAMPLES
========================= */

// Example: Comprehensive error handling
export async function fetchIncomeWithErrorHandling(id: string) {
  try {
    const response = await getIncomeById(id)
    return response.data
  } catch (error: any) {
    // ApiError has status, message, and data properties
    if (error.status === 404) {
      console.error('Income record not found')
      // Show 404 page or message
    } else if (error.status === 403) {
      console.error('Permission denied')
      // Redirect to login or show permission error
    } else if (error.status === 401) {
      console.error('Not authenticated')
      // Redirect to login
    } else {
      console.error('Unexpected error:', error.message)
      // Show generic error message
    }
    throw error
  }
}

/* =========================
   RESPONSE UNWRAPPING EXAMPLES
========================= */

// Backend responses follow { success: boolean, data: T } pattern
export async function unwrapResponseExample() {
  // ✅ CORRECT: API client already unwraps the response
  const response = await getIncomeList()
  const incomeArray = response.data.income // Access data directly
  
  // ❌ WRONG: Do NOT unwrap manually
  // const json = await fetch(...).then(r => r.json())
  // const incomeArray = json.data.income // Already done by apiClient!
}
