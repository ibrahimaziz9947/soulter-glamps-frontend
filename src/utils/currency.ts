/**
 * Currency Utilities
 * Handles currency formatting for monetary values
 * 
 * IMPORTANT: All backend fields return amounts in MAJOR UNITS (PKR/USD).
 * - 125000 = PKR 125,000.00
 * - No multiplication/division by 100 should occur in the frontend.
 */

/* =========================
   CONVERSION FUNCTIONS
========================= */

/**
 * Convert amount (major units) to display string
 * @param amount - Amount in major units (PKR)
 * @returns Formatted string with 2 decimal places (e.g., "123.45")
 * 
 * @example
 * centsToDisplay(123.45) // "123.45"
 * centsToDisplay(50) // "50.00"
 */
export function centsToDisplay(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) {
    return '0.00'
  }
  
  return amount.toFixed(2)
}

/**
 * Convert display string to amount (major units)
 * @param displayValue - Amount as string (e.g., "123.45")
 * @returns Amount in major units (PKR)
 * 
 * @example
 * displayToCents("123.45") // 123.45
 * displayToCents("50") // 50
 */
export function displayToCents(displayValue: string | number): number {
  return safeParseFloat(displayValue)
}

/**
 * Safely parse float from user input
 * @param input - String or number to parse
 * @returns Valid number or 0 if invalid
 * 
 * @example
 * safeParseFloat("123.45") // 123.45
 * safeParseFloat("50") // 50
 */
export function safeParseFloat(input: string | number | null | undefined): number {
  if (input == null) return 0
  
  const num = typeof input === 'string' ? parseFloat(input) : input
  
  if (isNaN(num) || !isFinite(num)) {
    return 0
  }
  
  return num
}

/* =========================
   FORMATTING FUNCTIONS
========================= */

/**
 * Format amount in base currency units (Standard Helper)
 * @param amount - Amount in base units (e.g., 125000 = PKR 125,000.00)
 * @param currency - Currency code (default: "PKR")
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * formatMoney(125000) // "PKR 125,000.00"
 * formatMoney(1250, "USD") // "USD 1,250.00"
 */
export function formatMoney(
  amount: number | null | undefined,
  currency: string = 'PKR',
  options?: { includeCurrency?: boolean }
): string {
  if (amount == null || isNaN(amount)) {
    amount = 0
  }
  
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  const includeCurrency = options?.includeCurrency !== false
  return includeCurrency ? `${currency} ${formatted}` : formatted
}

/**
 * @deprecated Legacy function for cents. Prefer formatMoney().
 * Format amount from cents (divides by 100)
 */
export function formatMoneyFromCents(
  cents: number | null | undefined,
  currency: string = 'PKR'
): string {
  if (cents == null || isNaN(cents)) {
    cents = 0
  }
  
  const amount = cents / 100
  return formatMoney(amount, currency)
}

/**
 * @deprecated Use formatMoney() instead.
 * Format amount as currency with PKR prefix
 */
export function formatCurrency(
  amount: number | null | undefined,
  includeCurrency: boolean = true
): string {
  const displayValue = centsToDisplay(amount)
  const num = parseFloat(displayValue)
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return includeCurrency ? `PKR ${formatted}` : formatted
}

/**
 * @deprecated Use formatMoney() instead
 * Format raw amount as currency
 */
export function formatRawCurrency(
  amount: number | null | undefined,
  includeCurrency: boolean = true
): string {
  return formatMoney(amount, 'PKR', { includeCurrency })
}

/**
 * Format large amounts compactly (e.g., "1.2K", "3.5M")
 * @param amount - Amount in major units
 */
export function formatCompactCurrency(amount: number | null | undefined): string {
  const displayValue = parseFloat(centsToDisplay(amount))
  
  if (displayValue >= 1_000_000) {
    return `PKR ${(displayValue / 1_000_000).toFixed(2)}M`
  }
  
  if (displayValue >= 1_000) {
    return `PKR ${(displayValue / 1_000).toFixed(2)}K`
  }
  
  return `PKR ${displayValue.toFixed(2)}`
}

/* =========================
   VALIDATION FUNCTIONS
========================= */

/**
 * Validate if input is a valid currency amount
 */
export function isValidCurrencyInput(input: string): boolean {
  if (!input || input.trim() === '') return false
  
  const num = parseFloat(input)
  
  if (isNaN(num) || !isFinite(num)) return false
  if (num < 0) return false
  
  // Check format: allow up to 2 decimal places
  const decimalRegex = /^\d+(\.\d{0,2})?$/
  return decimalRegex.test(input.trim())
}

/**
 * Sanitize currency input (remove invalid characters)
 */
export function sanitizeCurrencyInput(input: string): string {
  if (!input) return ''
  
  // Remove currency symbols, commas, and whitespace
  let cleaned = input.replace(/[^\d.]/g, '')
  
  // Allow only one decimal point
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].slice(0, 2)
  }
  
  return cleaned
}

/* =========================
   CALCULATION HELPERS
========================= */

/**
 * Add two amounts
 */
export function addMoney(a: number | null | undefined, b: number | null | undefined): number {
  const numA = a ?? 0
  const numB = b ?? 0
  return numA + numB
}

/**
 * @deprecated Use addMoney instead
 */
export function addCents(a: number | null | undefined, b: number | null | undefined): number {
  return addMoney(a, b)
}

/**
 * Subtract two amounts
 */
export function subtractMoney(a: number | null | undefined, b: number | null | undefined): number {
  const numA = a ?? 0
  const numB = b ?? 0
  return numA - numB
}

/**
 * @deprecated Use subtractMoney instead
 */
export function subtractCents(a: number | null | undefined, b: number | null | undefined): number {
  return subtractMoney(a, b)
}
