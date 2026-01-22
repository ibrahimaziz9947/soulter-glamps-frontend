/**
 * Currency Utilities
 * Handles currency formatting for monetary values
 * 
 * IMPORTANT: Most backend fields return amounts in BASE UNITS (not cents), despite field names like "amountCents"
 * - 125000 = PKR 125,000.00 (NOT PKR 1,250.00)
 * - Use formatMoney() for base units (default)
 * - Use formatMoneyFromCents() ONLY for true cents fields (rare)
 */

/* =========================
   CONVERSION FUNCTIONS
   ⚠️ DEPRECATED - Backend now uses major units
========================= */

/**
 * @deprecated Backend now sends amounts in major units (not cents). Use amount.toString() instead.
 * Convert cents (integer) to display string
 * @param amountCents - Amount in cents (integer)
 * @returns Formatted string with 2 decimal places (e.g., "123.45")
 * 
 * @example
 * centsToDisplay(12345) // "123.45"
 * centsToDisplay(5000) // "50.00"
 * centsToDisplay(0) // "0.00"
 * centsToDisplay(null) // "0.00"
 */
export function centsToDisplay(amountCents: number | null | undefined): string {
  if (amountCents == null || isNaN(amountCents)) {
    return '0.00'
  }
  
  const dollars = amountCents / 100
  return dollars.toFixed(2)
}

/**
 * @deprecated Backend now expects amounts in major units (not cents). Use parseFloat() directly.
 * Convert display string to cents (integer)
 * @param displayValue - Amount as string (e.g., "123.45")
 * @returns Amount in cents (integer)
 * 
 * @example
 * displayToCents("123.45") // 12345
 * displayToCents("50") // 5000
 * displayToCents("0.99") // 99
 * displayToCents("") // 0
 * displayToCents("invalid") // 0
 */
export function displayToCents(displayValue: string | number): number {
  const parsed = safeParseFloat(displayValue)
  return Math.round(parsed * 100)
}

/**
 * Safely parse float from user input
 * @param input - String or number to parse
 * @returns Valid number or 0 if invalid
 * 
 * @example
 * safeParseFloat("123.45") // 123.45
 * safeParseFloat("50") // 50
 * safeParseFloat("") // 0
 * safeParseFloat("abc") // 0
 * safeParseFloat(null) // 0
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
 * Format amount in base currency units (DEFAULT - use this in most cases)
 * Does NOT divide by 100 - treats input as actual PKR/USD value
 * @param amount - Amount in base units (e.g., 125000 = PKR 125,000.00)
 * @param currency - Currency code (default: "PKR")
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * formatMoney(125000) // "PKR 125,000.00"
 * formatMoney(61000) // "PKR 61,000.00"
 * formatMoney(154750) // "PKR 154,750.00"
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
 * Format amount from cents (ONLY for true cents fields)
 * Divides by 100 before formatting
 * @param cents - Amount in cents (e.g., 12345 = PKR 123.45)
 * @param currency - Currency code (default: "PKR")
 * @returns Formatted currency string
 * 
 * @example
 * formatMoneyFromCents(12345) // "PKR 123.45"
 * formatMoneyFromCents(500000) // "PKR 5,000.00"
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
 * @deprecated Use formatMoney() instead - most fields are in base units, not cents
 * Format cents as currency with PKR prefix and thousands separators
 * @param amountCents - Amount in cents (integer)
 * @param includeCurrency - Whether to include "PKR" prefix (default: true)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(12345) // "PKR 123.45"
 * formatCurrency(1234567) // "PKR 12,345.67"
 * formatCurrency(5000, false) // "50.00"
 */
export function formatCurrency(
  amountCents: number | null | undefined,
  includeCurrency: boolean = true
): string {
  const displayValue = centsToDisplay(amountCents)
  const num = parseFloat(displayValue)
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return includeCurrency ? `PKR ${formatted}` : formatted
}

/**
 * @deprecated Use formatMoney() instead
 * Format raw amount (not in cents) as currency
 * Use this when the API returns whole units (e.g., 61000 = PKR 61000, not PKR 610)
 * @param amount - Amount in whole currency units
 * @param includeCurrency - Whether to include "PKR" prefix
 * @returns Formatted currency string
 * 
 * @example
 * formatRawCurrency(61000) // "PKR 61,000.00"
 * formatRawCurrency(123456.789) // "PKR 123,456.79"
 */
export function formatRawCurrency(
  amount: number | null | undefined,
  includeCurrency: boolean = true
): string {
  return formatMoney(amount, 'PKR', { includeCurrency })
}

/**
 * Format cents as compact currency (e.g., "1.2K", "3.5M")
 * @param amountCents - Amount in cents (integer)
 * @returns Compact formatted string
 * 
 * @example
 * formatCompactCurrency(123456) // "PKR 1.23K"
 * formatCompactCurrency(12345678) // "PKR 123.46K"
 * formatCompactCurrency(123456789) // "PKR 1.23M"
 */
export function formatCompactCurrency(amountCents: number | null | undefined): string {
  const displayValue = parseFloat(centsToDisplay(amountCents))
  
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
 * @param input - String to validate
 * @returns True if valid currency format
 * 
 * @example
 * isValidCurrencyInput("123.45") // true
 * isValidCurrencyInput("50") // true
 * isValidCurrencyInput("0.99") // true
 * isValidCurrencyInput("-10") // false (negative)
 * isValidCurrencyInput("abc") // false (not a number)
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
 * @param input - String to sanitize
 * @returns Cleaned string with only valid numeric characters
 * 
 * @example
 * sanitizeCurrencyInput("123.45") // "123.45"
 * sanitizeCurrencyInput("PKR 123.45") // "123.45"
 * sanitizeCurrencyInput("1,234.56") // "1234.56"
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
 * Add two amounts in cents
 * @param a - First amount in cents
 * @param b - Second amount in cents
 * @returns Sum in cents
 */
export function addCents(a: number | null | undefined, b: number | null | undefined): number {
  const numA = a ?? 0
  const numB = b ?? 0
  return numA + numB
}

/**
 * Subtract two amounts in cents
 * @param a - First amount in cents (minuend)
 * @param b - Second amount in cents (subtrahend)
 * @returns Difference in cents
 */
export function subtractCents(a: number | null | undefined, b: number | null | undefined): number {
  const numA = a ?? 0
  const numB = b ?? 0
  return numA - numB
}

/**
 * Calculate percentage of amount
 * @param amountCents - Amount in cents
 * @param percentage - Percentage (0-100)
 * @returns Calculated amount in cents
 * 
 * @example
 * percentageOfCents(10000, 10) // 1000 (10% of PKR 100.00)
 * percentageOfCents(5000, 20) // 1000 (20% of PKR 50.00)
 */
export function percentageOfCents(
  amountCents: number | null | undefined,
  percentage: number
): number {
  const num = amountCents ?? 0
  return Math.round((num * percentage) / 100)
}
