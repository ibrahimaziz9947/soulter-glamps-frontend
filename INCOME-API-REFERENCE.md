# Income API & Currency Utils - Quick Reference

## 🎯 Key Principle: Backend uses CENTS (integer), Frontend uses DISPLAY (string)

```typescript
// Backend: 12345 cents = PKR 123.45
// Frontend input: "123.45"
// Frontend display: "PKR 123.45"
```

---

## 📦 Import Statements

```typescript
// Income API
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
} from '@/src/services/income.api'

// Currency utilities
import {
  centsToDisplay,
  displayToCents,
  formatCurrency,
  isValidCurrencyInput,
  sanitizeCurrencyInput,
} from '@/src/utils/currency'
```

---

## 🔄 Currency Conversion Cheat Sheet

| Function | Input | Output | Use Case |
|----------|-------|--------|----------|
| `displayToCents("123.45")` | String | `12345` | Form submission to API |
| `centsToDisplay(12345)` | Integer | `"123.45"` | API response to input field |
| `formatCurrency(12345)` | Integer | `"PKR 123.45"` | Display to user |
| `sanitizeCurrencyInput("PKR 1,234.56")` | String | `"1234.56"` | Clean user input |
| `isValidCurrencyInput("123.45")` | String | `true/false` | Validate before submit |

---

## 📝 Common Patterns

### Pattern 1: Form Submission (User → API)
```typescript
const handleSubmit = async (formAmount: string) => {
  // Step 1: Validate
  if (!isValidCurrencyInput(formAmount)) {
    setError('Invalid amount')
    return
  }
  
  // Step 2: Convert to cents
  const amountInCents = displayToCents(formAmount) // "123.45" → 12345
  
  // Step 3: Send to API
  await createIncome({
    title: 'Payment',
    amount: amountInCents, // ✅ Integer cents
    date: '2026-01-15',
  })
}
```

### Pattern 2: Display Income (API → User)
```typescript
const IncomeRow = ({ income }: { income: Income }) => (
  <tr>
    <td>{income.title}</td>
    <td>{formatCurrency(income.amount)}</td> {/* 12345 → "PKR 123.45" */}
  </tr>
)
```

### Pattern 3: Edit Form (Pre-fill Input)
```typescript
const [amount, setAmount] = useState('')

useEffect(() => {
  if (income) {
    // Convert cents to display string for input field
    setAmount(centsToDisplay(income.amount)) // 12345 → "123.45"
  }
}, [income])
```

### Pattern 4: Real-time Input Validation
```typescript
const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const input = e.target.value
  
  // Clean input
  const cleaned = sanitizeCurrencyInput(input)
  setAmount(cleaned)
  
  // Validate
  if (cleaned && !isValidCurrencyInput(cleaned)) {
    setError('Invalid format')
  } else {
    setError('')
  }
}
```

---

## 🔌 API Functions

### Fetch Income List
```typescript
const response = await getIncomeList({
  page: 1,
  limit: 10,
  status: 'APPROVED',
  search: 'booking',
  startDate: '2026-01-01',
  endDate: '2026-01-31',
})

// Access data
const incomeArray = response.data.income
const total = response.data.totalAmount // In cents
const totalDisplay = formatCurrency(total) // "PKR 123.45"
```

### Get Single Income
```typescript
const response = await getIncomeById('income-id')
const income = response.data

// Display amount
const displayAmount = centsToDisplay(income.amount)
```

### Create Income
```typescript
await createIncome({
  title: 'Booking Payment',
  amount: displayToCents(formAmount), // Convert to cents!
  date: '2026-01-15',
  category: 'booking',
  description: 'From customer XYZ',
  status: 'DRAFT', // or 'SUBMITTED'
})
```

### Update Income
```typescript
await updateIncome('income-id', {
  amount: displayToCents(newAmount), // Convert to cents!
  description: 'Updated description',
})
```

### Workflow Actions
```typescript
// Submit for approval
await submitIncome('income-id')

// Approve
await approveIncome('income-id', 'Looks good!')

// Reject
await rejectIncome('income-id', 'Missing receipt')
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Send decimal to backend
```typescript
await createIncome({
  amount: parseFloat("123.45"), // ❌ WRONG: 123.45 (decimal)
})
```

### ✅ DO: Convert to cents first
```typescript
await createIncome({
  amount: displayToCents("123.45"), // ✅ CORRECT: 12345 (cents)
})
```

---

### ❌ DON'T: Display raw cents value
```typescript
<p>Amount: {income.amount}</p> // Shows "12345" ❌
```

### ✅ DO: Format for display
```typescript
<p>Amount: {formatCurrency(income.amount)}</p> // Shows "PKR 123.45" ✅
```

---

### ❌ DON'T: Pre-fill input with cents
```typescript
<input value={income.amount} /> // Shows "12345" in input ❌
```

### ✅ DO: Convert to display value
```typescript
<input value={centsToDisplay(income.amount)} /> // Shows "123.45" ✅
```

---

## 🧪 Testing Examples

```typescript
// Test currency conversion
console.log(displayToCents("123.45")) // 12345
console.log(centsToDisplay(12345))    // "123.45"
console.log(formatCurrency(12345))    // "PKR 123.45"

// Test validation
console.log(isValidCurrencyInput("123.45"))  // true
console.log(isValidCurrencyInput("123"))     // true
console.log(isValidCurrencyInput("-10"))     // false
console.log(isValidCurrencyInput("abc"))     // false

// Test sanitization
console.log(sanitizeCurrencyInput("PKR 1,234.56")) // "1234.56"
console.log(sanitizeCurrencyInput("$123.45"))      // "123.45"
```

---

## 📋 Response Structure

```typescript
// List response
{
  success: true,
  data: {
    income: Income[],
    pagination: {
      page: 1,
      limit: 10,
      total: 50,
      totalPages: 5
    },
    totalAmount: 123456 // In cents
  }
}

// Single income response
{
  success: true,
  data: {
    id: "inc-123",
    title: "Booking Payment",
    amount: 12345, // In cents
    date: "2026-01-15",
    status: "APPROVED",
    // ... other fields
  }
}
```

---

## 🎨 UI Component Examples

### Currency Input Component
```typescript
<input
  type="text"
  value={amount}
  onChange={(e) => setAmount(sanitizeCurrencyInput(e.target.value))}
  placeholder="0.00"
/>
{amount && !isValidCurrencyInput(amount) && (
  <span className="text-red-500">Invalid amount</span>
)}
```

### Amount Display
```typescript
<span className="text-2xl font-bold">
  {formatCurrency(income.amount)}
</span>
```

### Summary Card
```typescript
<div>
  <p className="text-sm text-gray-500">Total Income</p>
  <p className="text-3xl font-bold text-green">
    {formatCurrency(totalAmount)}
  </p>
</div>
```

---

## 🔍 Error Handling

```typescript
try {
  const response = await getIncomeById(id)
  return response.data
} catch (error: any) {
  if (error.status === 404) {
    // Handle not found
  } else if (error.status === 403) {
    // Handle permission denied
  } else if (error.status === 401) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

---

## 📚 Related Files

- API Service: `src/services/income.api.ts`
- Currency Utils: `src/utils/currency.ts`
- Usage Examples: `INCOME-API-USAGE-EXAMPLES.tsx`
- Income Pages: `app/admin/finance/income/**/*.tsx`
