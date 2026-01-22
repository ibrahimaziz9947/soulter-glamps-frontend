'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/src/services/apiClient'
import { formatMoney } from '@/src/utils/currency'

interface Expense {
  id: string
  title: string
  category: string | { id: string; name: string }
  amount: number
  date: string
  addedBy?: string
  createdBy?: {
    id?: string
    name?: string
    email?: string
  }
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ExpensesResponse {
  expenses: Expense[]
  pagination: PaginationMeta
  totalAmount: number
  approvedCount: number
  pendingCount: number
}

export default function ExpensesPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)

  // Add expense modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete expense state
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null)

  // Workflow action states
  const [submittingExpenseId, setSubmittingExpenseId] = useState<string | null>(null)
  const [approvingExpenseId, setApprovingExpenseId] = useState<string | null>(null)
  const [rejectingExpenseId, setRejectingExpenseId] = useState<string | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Categories from API
  interface Category {
    id: string
    name: string
  }
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000) // Auto-dismiss after 4 seconds
  }

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await apiClient<any>('/finance/categories', {
          method: 'GET',
        })
        console.log('[Expenses] Categories API response:', response)
        
        // Handle different response structures
        let categoriesData: Category[] = []
        if (Array.isArray(response)) {
          // Response is directly an array
          categoriesData = response
        } else if (response.categories && Array.isArray(response.categories)) {
          // Response has categories property
          categoriesData = response.categories
        } else if (response.data && Array.isArray(response.data)) {
          // Response has data property that's an array
          categoriesData = response.data
        } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
          // Response has data.categories
          categoriesData = response.data.categories
        }
        
        console.log('[Expenses] Categories array:', categoriesData)
        setCategories(categoriesData)
      } catch (err: any) {
        console.error('[Expenses] Failed to fetch categories:', err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch expenses from API with filters and pagination
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query params
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', '10')
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim())
        }
        
        // Note: We don't send category or status filters to API
        // We'll do client-side filtering for better UX and accurate counts

        const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, {
          method: 'GET',
        })

        console.log('[Expenses] GET /finance/expenses response:', response)
        
        // Handle different response structures
        let expensesData = []
        let paginationData = { page: 1, limit: 10, total: 0, totalPages: 0 }
        let totalAmount = 0
        let approved = 0
        let pending = 0
        
        if (Array.isArray(response)) {
          // Response is directly an array
          expensesData = response
        } else if (response.success && response.data) {
          // Backend returns { success: true, data: {...} }
          const data = response.data
          expensesData = Array.isArray(data) ? data : (data.expenses || [])
          paginationData = data.pagination || paginationData
          totalAmount = data.totalAmount || 0
          approved = data.approvedCount || 0
          pending = data.pendingCount || 0
        } else if (response.data) {
          // Backend returns { data: {...} } without success flag
          const data = response.data
          expensesData = Array.isArray(data) ? data : (data.expenses || [])
          paginationData = data.pagination || paginationData
          totalAmount = data.totalAmount || 0
          approved = data.approvedCount || 0
          pending = data.pendingCount || 0
        } else if (response.expenses) {
          // Direct expenses property
          expensesData = response.expenses
          paginationData = response.pagination || paginationData
          totalAmount = response.totalAmount || 0
          approved = response.approvedCount || 0
          pending = response.pendingCount || 0
        }
        
        console.log('[Expenses] Parsed expensesData:', expensesData)
        console.log('[Expenses] Parsed paginationData:', paginationData)

        // Store all expenses (unfiltered)
        setAllExpenses(expensesData)
        
        // Apply client-side filtering
        let filteredExpenses: Expense[] = expensesData
        
        // Filter by status
        if (statusFilter !== 'all') {
          filteredExpenses = filteredExpenses.filter((exp: Expense) => 
            (exp.status || 'DRAFT') === statusFilter
          )
        }
        
        // Filter by category
        if (filter !== 'all') {
          filteredExpenses = filteredExpenses.filter((exp: Expense) => {
            const expCategoryName = typeof exp.category === 'string' 
              ? exp.category 
              : exp.category?.name || ''
            return expCategoryName === filter
          })
        }
        
        // Filter by search query (client-side)
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase()
          filteredExpenses = filteredExpenses.filter((exp: Expense) => {
            const title = (exp.title || '').toLowerCase()
            const id = (exp.id || '').toLowerCase()
            const categoryName = typeof exp.category === 'string' 
              ? exp.category.toLowerCase()
              : (exp.category?.name || '').toLowerCase()
            return title.includes(query) || id.includes(query) || categoryName.includes(query)
          })
        }
        
        console.log('[Expenses] Filtered expenses:', filteredExpenses.length, 'of', expensesData.length)
        
        setExpenses(filteredExpenses)
        setPagination(paginationData)
        setTotalExpenses(totalAmount)
        setApprovedCount(approved)
        setPendingCount(pending)
      } catch (err: any) {
        console.error('Failed to fetch expenses:', err)
        setError(err.message || 'Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    // Debounce search input
    const timeoutId = setTimeout(() => {
      fetchExpenses()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery])
  
  // Apply client-side filtering when filters change
  useEffect(() => {
    if (allExpenses.length === 0) return
    
    let filteredExpenses: Expense[] = allExpenses
    
    // Filter by status
    if (statusFilter !== 'all') {
      filteredExpenses = filteredExpenses.filter((exp: Expense) => 
        (exp.status || 'DRAFT') === statusFilter
      )
    }
    
    // Filter by category
    if (filter !== 'all') {
      filteredExpenses = filteredExpenses.filter((exp: Expense) => {
        const expCategoryName = typeof exp.category === 'string' 
          ? exp.category 
          : exp.category?.name || ''
        return expCategoryName === filter
      })
    }
    
    // Filter by search query (already applied in API call, but reapply for consistency)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      filteredExpenses = filteredExpenses.filter((exp: Expense) => {
        const title = (exp.title || '').toLowerCase()
        const id = (exp.id || '').toLowerCase()
        const categoryName = typeof exp.category === 'string' 
          ? exp.category.toLowerCase()
          : (exp.category?.name || '').toLowerCase()
        return title.includes(query) || id.includes(query) || categoryName.includes(query)
      })
    }
    
    console.log('[Expenses] Client-side filter applied:', filteredExpenses.length, 'of', allExpenses.length)
    setExpenses(filteredExpenses)
  }, [statusFilter, filter, searchQuery, allExpenses])

  // Calculate status counts for badges from allExpenses
  const statusCounts = {
    all: allExpenses.length,
    DRAFT: allExpenses.filter((exp: Expense) => (exp.status || 'DRAFT') === 'DRAFT').length,
    SUBMITTED: allExpenses.filter((exp: Expense) => exp.status === 'SUBMITTED').length,
    APPROVED: allExpenses.filter((exp: Expense) => exp.status === 'APPROVED').length,
    REJECTED: allExpenses.filter((exp: Expense) => exp.status === 'REJECTED').length,
    CANCELLED: allExpenses.filter((exp: Expense) => exp.status === 'CANCELLED').length,
  }
  
  // Compute summary stats from loaded expenses (single source of truth)
  const computedSummary = useMemo(() => {
    // Calculate total expenses from current loaded data
    const totalExpensesCents = allExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    
    // Count approved and pending from loaded data
    const approvedCount = allExpenses.filter(exp => exp.status === 'APPROVED').length
    const pendingCount = allExpenses.filter(exp => exp.status === 'SUBMITTED').length
    
    return {
      totalExpensesCents,
      approvedCount,
      pendingCount
    }
  }, [allExpenses])
  
  // Debug: Log expenses state changes
  useEffect(() => {
    console.log('[Expenses] Expenses state updated:', expenses)
    console.log('[Expenses] Expenses count:', expenses.length)
  }, [expenses])

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1)
    }
  }

  const handleOpenAddModal = () => {
    setShowAddModal(true)
    setEditingExpense(null)
    setFormData({ title: '', amount: '', category: '', description: '' })
    setFormError(null)
  }

  const handleOpenEditModal = (expense: Expense) => {
    setShowAddModal(true)
    setEditingExpense(expense)
    
    // Get category name (handle both string and object)
    const categoryName = typeof expense.category === 'string' 
      ? expense.category 
      : expense.category?.name || ''
    
    // Find category ID by name
    const category = categories.find(cat => cat.name === categoryName)
    
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: category?.id || '', // Use category ID, not name
      description: ''
    })
    setFormError(null)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingExpense(null)
    setFormData({ title: '', amount: '', category: '', description: '' })
    setFormError(null)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      setFormError('Title is required')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFormError('Valid amount is required')
      return
    }
    if (!formData.category) {
      setFormError('Category is required')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        categoryId: formData.category, // formData.category is now the UUID
        description: formData.description.trim() || undefined
      }

      if (editingExpense) {
        // Edit mode - PATCH request
        await apiClient(`/finance/expenses/${editingExpense.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
      } else {
        // Add mode - POST request
        await apiClient('/finance/expenses', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }

      // Success - close modal and refetch
      handleCloseAddModal()
      
      console.log('[Expenses] Add/Edit success, refetching...')
      
      // Only reset to page 1 when adding new expense
      if (!editingExpense) {
        setPage(1)
      }
      
      // Refetch expenses
      const params = new URLSearchParams()
      params.append('page', editingExpense ? page.toString() : '1')
      params.append('limit', '10')
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (filter !== 'all') {
        const category = categories.find(cat => cat.name === filter)
        if (category) {
          params.append('categoryId', category.id)
        }
      }

      const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, {
        method: 'GET',
      })

      console.log('[Expenses] Refetch response:', response)
      
      // Handle different response structures
      let expensesData = []
      let paginationData = { page: editingExpense ? page : 1, limit: 10, total: 0, totalPages: 0 }
      let totalAmount = 0
      let approved = 0
      let pending = 0
      
      if (Array.isArray(response)) {
        expensesData = response
      } else if (response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
        paginationData = data.pagination || paginationData
        totalAmount = data.totalAmount || 0
        approved = data.approvedCount || 0
        pending = data.pendingCount || 0
      } else if (response.expenses) {
        expensesData = response.expenses
        paginationData = response.pagination || paginationData
        totalAmount = response.totalAmount || 0
        approved = response.approvedCount || 0
        pending = response.pendingCount || 0
      }
      
      console.log('[Expenses] Refetch parsed expenses:', expensesData)

      setExpenses(expensesData)
      setPagination(paginationData)
      setTotalExpenses(totalAmount)
      setApprovedCount(approved)
      setPendingCount(pending)
    } catch (err: any) {
      console.error('Failed to add expense:', err)
      const statusCode = err.statusCode || err.status
      if (statusCode === 409) {
        setFormError('Cannot modify: Expense is in a protected state')
      } else if (statusCode === 403) {
        setFormError('You do not have permission to perform this action')
      } else {
        setFormError(err.message || 'Failed to save expense. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteExpense = async (expense: Expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this expense?\n\n${expense.title} - PKR ${expense.amount.toLocaleString()}`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingExpenseId(expense.id)

      await apiClient(`/finance/expenses/${expense.id}`, {
        method: 'DELETE',
      })

      console.log('[Expenses] Delete success, refetching...')

      // Success - refetch expenses
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (filter !== 'all') {
        const category = categories.find(cat => cat.name === filter)
        if (category) {
          params.append('categoryId', category.id)
        }
      }

      const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, {
        method: 'GET',
      })

      console.log('[Expenses] Delete refetch response:', response)
      
      // Handle different response structures
      let expensesData = []
      let paginationData = { page, limit: 10, total: 0, totalPages: 0 }
      let totalAmount = 0
      let approved = 0
      let pending = 0
      
      if (Array.isArray(response)) {
        expensesData = response
      } else if (response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
        paginationData = data.pagination || paginationData
        totalAmount = data.totalAmount || 0
        approved = data.approvedCount || 0
        pending = data.pendingCount || 0
      } else if (response.expenses) {
        expensesData = response.expenses
        paginationData = response.pagination || paginationData
        totalAmount = response.totalAmount || 0
        approved = response.approvedCount || 0
        pending = response.pendingCount || 0
      }

      setExpenses(expensesData)
      setPagination(paginationData)
      setTotalExpenses(totalAmount)
      setApprovedCount(approved)
      setPendingCount(pending)

      // If current page is empty and not page 1, go to previous page
      if (expensesData.length === 0 && page > 1) {
        setPage(page - 1)
      }
    } catch (err: any) {
      console.error('Failed to delete expense:', err)
      const statusCode = err.statusCode || err.status
      if (statusCode === 409) {
        showToast('Cannot delete: Expense has already been submitted or approved', 'error')
      } else if (statusCode === 403) {
        showToast('You do not have permission to delete this expense', 'error')
      } else {
        showToast(err.message || 'Failed to delete expense', 'error')
      }
    } finally {
      setDeletingExpenseId(null)
    }
  }

  const handleSubmitForApproval = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to submit this expense for approval?')) {
      return
    }

    try {
      setSubmittingExpenseId(expenseId)
      await apiClient(`/finance/expenses/${expenseId}/submit`, {
        method: 'POST',
      })
      
      showToast('Expense submitted for approval successfully', 'success')
      
      // Refetch expenses
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      
      const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, { method: 'GET' })
      
      // Parse response
      let expensesData = []
      if (Array.isArray(response)) {
        expensesData = response
      } else if (response.success && response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.expenses) {
        expensesData = response.expenses
      }
      
      // Update allExpenses
      setAllExpenses(expensesData)
      
      // Apply client-side filtering
      let filteredExpenses: Expense[] = expensesData
      
      if (statusFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => 
          (exp.status || 'DRAFT') === statusFilter
        )
      }
      
      if (filter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const expCategoryName = typeof exp.category === 'string' 
            ? exp.category 
            : exp.category?.name || ''
          return expCategoryName === filter
        })
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const title = (exp.title || '').toLowerCase()
          const id = (exp.id || '').toLowerCase()
          const categoryName = typeof exp.category === 'string' 
            ? exp.category.toLowerCase()
            : (exp.category?.name || '').toLowerCase()
          return title.includes(query) || id.includes(query) || categoryName.includes(query)
        })
      }
      
      setExpenses(filteredExpenses)
    } catch (err: any) {
      const statusCode = err.statusCode || err.status
      if (statusCode === 409) {
        showToast('Cannot submit: Expense is already submitted or in a different state', 'error')
      } else if (statusCode === 403) {
        showToast('You do not have permission to submit this expense', 'error')
      } else {
        showToast(err.message || 'Failed to submit expense', 'error')
      }
    } finally {
      setSubmittingExpenseId(null)
    }
  }

  const handleApproveExpense = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to approve this expense?')) {
      return
    }

    const comment = window.prompt('Add an optional comment (or leave blank):')
    
    try {
      setApprovingExpenseId(expenseId)
      
      const payload = comment?.trim() ? { comment: comment.trim() } : {}
      
      await apiClient(`/finance/expenses/${expenseId}/approve`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      
      showToast('Expense approved successfully', 'success')
      
      // Refetch expenses
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      
      const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, { method: 'GET' })
      
      // Parse response
      let expensesData = []
      if (Array.isArray(response)) {
        expensesData = response
      } else if (response.success && response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.expenses) {
        expensesData = response.expenses
      }
      
      // Update allExpenses
      setAllExpenses(expensesData)
      
      // Apply client-side filtering
      let filteredExpenses: Expense[] = expensesData
      
      if (statusFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => 
          (exp.status || 'DRAFT') === statusFilter
        )
      }
      
      if (filter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const expCategoryName = typeof exp.category === 'string' 
            ? exp.category 
            : exp.category?.name || ''
          return expCategoryName === filter
        })
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const title = (exp.title || '').toLowerCase()
          const id = (exp.id || '').toLowerCase()
          const categoryName = typeof exp.category === 'string' 
            ? exp.category.toLowerCase()
            : (exp.category?.name || '').toLowerCase()
          return title.includes(query) || id.includes(query) || categoryName.includes(query)
        })
      }
      
      setExpenses(filteredExpenses)
    } catch (err: any) {
      const statusCode = err.statusCode || err.status
      if (statusCode === 409) {
        showToast('Cannot approve: Expense is not in submitted state', 'error')
      } else if (statusCode === 403) {
        showToast('You do not have permission to approve expenses', 'error')
      } else {
        showToast(err.message || 'Failed to approve expense', 'error')
      }
    } finally {
      setApprovingExpenseId(null)
    }
  }

  const handleRejectExpense = async (expenseId: string) => {
    const reason = window.prompt('Please provide a reason for rejection (required):')
    
    if (!reason || !reason.trim()) {
      showToast('Rejection reason is required', 'error')
      return
    }
    
    try {
      setRejectingExpenseId(expenseId)
      
      await apiClient(`/finance/expenses/${expenseId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: reason.trim() })
      })
      
      showToast('Expense rejected', 'success')
      
      // Refetch expenses
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      
      const response = await apiClient<any>(`/finance/expenses?${params.toString()}`, { method: 'GET' })
      
      // Parse response
      let expensesData = []
      if (Array.isArray(response)) {
        expensesData = response
      } else if (response.success && response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.data) {
        const data = response.data
        expensesData = Array.isArray(data) ? data : (data.expenses || [])
      } else if (response.expenses) {
        expensesData = response.expenses
      }
      
      // Update allExpenses
      setAllExpenses(expensesData)
      
      // Apply client-side filtering
      let filteredExpenses: Expense[] = expensesData
      
      if (statusFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => 
          (exp.status || 'DRAFT') === statusFilter
        )
      }
      
      if (filter !== 'all') {
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const expCategoryName = typeof exp.category === 'string' 
            ? exp.category 
            : exp.category?.name || ''
          return expCategoryName === filter
        })
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        filteredExpenses = filteredExpenses.filter((exp: Expense) => {
          const title = (exp.title || '').toLowerCase()
          const id = (exp.id || '').toLowerCase()
          const categoryName = typeof exp.category === 'string' 
            ? exp.category.toLowerCase()
            : (exp.category?.name || '').toLowerCase()
          return title.includes(query) || id.includes(query) || categoryName.includes(query)
        })
      }
      
      setExpenses(filteredExpenses)
    } catch (err: any) {
      const statusCode = err.statusCode || err.status
      if (statusCode === 409) {
        showToast('Cannot reject: Expense is not in submitted state', 'error')
      } else if (statusCode === 403) {
        showToast('You do not have permission to reject expenses', 'error')
      } else {
        showToast(err.message || 'Failed to reject expense', 'error')
      }
    } finally {
      setRejectingExpenseId(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow border-t-transparent"></div>
            <p className="mt-4 text-text-light">Loading expenses...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Failed to load expenses</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' ? 'bg-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Daily Expenses</h1>
          <p className="text-text-light mt-1">Track and manage operational expenses</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-yellow text-green px-6 py-3 rounded-lg font-semibold hover:bg-yellow-light transition-smooth"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Summary Cards - Computed from loaded data */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Total Expenses</p>
            <p className="font-serif text-3xl font-bold text-green">{(() => {
              console.log('[Expenses] Raw totalExpensesCents:', computedSummary.totalExpensesCents);
              const formatted = formatMoney(computedSummary.totalExpensesCents);
              console.log('[Expenses] Formatted display:', formatted);
              return formatted;
            })()}</p>
            <p className="text-xs text-text-light mt-1">From loaded expenses</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Approved Expenses</p>
            <p className="font-serif text-3xl font-bold text-green">{computedSummary.approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-text-light text-sm mb-2">Pending Approval</p>
            <p className="font-serif text-3xl font-bold text-yellow">{computedSummary.pendingCount}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Status Filters */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Status Filter</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'all'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'DRAFT'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Draft ({statusCounts.DRAFT})
            </button>
            <button
              onClick={() => setStatusFilter('SUBMITTED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'SUBMITTED'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Submitted ({statusCounts.SUBMITTED})
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'APPROVED'
                  ? 'bg-green text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.APPROVED})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'REJECTED'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.REJECTED})
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                statusFilter === 'CANCELLED'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gray-200'
              }`}
            >
              Cancelled ({statusCounts.CANCELLED})
            </button>
          </div>
        </div>

        {/* Category Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
              <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              key="all"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                filter === 'all'
                  ? 'bg-yellow text-green'
                  : 'bg-cream text-text-dark hover:bg-yellow/20'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  filter === category.name
                    ? 'bg-yellow text-green'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Expense ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Expense Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Added By</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-light">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-cream/50 transition-smooth">
                    <td className="py-4 px-6">
                      <span className="font-medium text-yellow">{expense.id}</span>
                    </td>
                    <td className="py-4 px-6 text-text-dark">{expense.title}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cream text-text-dark">
                        {typeof expense.category === 'string' ? expense.category : (expense.category?.name || 'N/A')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-red-500">PKR {(expense.amount || 0).toLocaleString()}</td>
                    <td className="py-4 px-6 text-text-light text-sm">{expense.date || 'N/A'}</td>
                    <td className="py-4 px-6 text-text-dark">{expense.createdBy?.name || expense.createdBy?.email || '—'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        (expense.status || 'DRAFT') === 'DRAFT' 
                          ? 'bg-gray-200 text-gray-700' 
                          : expense.status === 'SUBMITTED'
                          ? 'bg-blue-100 text-blue-700'
                          : expense.status === 'APPROVED' 
                          ? 'bg-green/10 text-green' 
                          : expense.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {expense.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {/* View - Available for all statuses */}
                        <button 
                          onClick={() => router.push(`/admin/finance/expenses/${expense.id}`)}
                          className="p-2 text-green hover:bg-cream rounded-lg transition-smooth"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Edit - Available for DRAFT and REJECTED */}
                        {((expense.status || 'DRAFT') === 'DRAFT' || expense.status === 'REJECTED') && (
                          <button 
                            onClick={() => handleOpenEditModal(expense)}
                            className="p-2 text-yellow hover:bg-cream rounded-lg transition-smooth"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}

                        {/* Delete - Available for DRAFT only */}
                        {(expense.status || 'DRAFT') === 'DRAFT' && (
                          <button 
                            onClick={() => handleDeleteExpense(expense)}
                            disabled={deletingExpenseId === expense.id}
                            className={`p-2 rounded-lg transition-smooth ${
                              deletingExpenseId === expense.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-500 hover:bg-cream'
                            }`}
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}

                        {/* Submit - Available for DRAFT only */}
                        {(expense.status || 'DRAFT') === 'DRAFT' && (
                          <button 
                            onClick={() => handleSubmitForApproval(expense.id)}
                            disabled={submittingExpenseId === expense.id}
                            className={`px-3 py-1 text-xs font-semibold text-white rounded-lg transition-smooth ${
                              submittingExpenseId === expense.id
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            title="Submit for Approval"
                          >
                            {submittingExpenseId === expense.id ? 'Submitting...' : 'Submit'}
                          </button>
                        )}

                        {/* Resubmit - Available for REJECTED only */}
                        {expense.status === 'REJECTED' && (
                          <button 
                            onClick={() => handleSubmitForApproval(expense.id)}
                            disabled={submittingExpenseId === expense.id}
                            className={`px-3 py-1 text-xs font-semibold text-white rounded-lg transition-smooth ${
                              submittingExpenseId === expense.id
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            title="Resubmit for Approval"
                          >
                            {submittingExpenseId === expense.id ? 'Submitting...' : 'Resubmit'}
                          </button>
                        )}

                        {/* Approve - Available for SUBMITTED only */}
                        {expense.status === 'SUBMITTED' && (
                          <button 
                            onClick={() => handleApproveExpense(expense.id)}
                            disabled={approvingExpenseId === expense.id}
                            className={`px-3 py-1 text-xs font-semibold text-white rounded-lg transition-smooth ${
                              approvingExpenseId === expense.id
                                ? 'bg-green/50 cursor-not-allowed'
                                : 'bg-green hover:bg-green/90'
                            }`}
                            title="Approve Expense"
                          >
                            {approvingExpenseId === expense.id ? 'Approving...' : 'Approve'}
                          </button>
                        )}

                        {/* Reject - Available for SUBMITTED only */}
                        {expense.status === 'SUBMITTED' && (
                          <button 
                            onClick={() => handleRejectExpense(expense.id)}
                            disabled={rejectingExpenseId === expense.id}
                            className={`px-3 py-1 text-xs font-semibold text-white rounded-lg transition-smooth ${
                              rejectingExpenseId === expense.id
                                ? 'bg-red-300 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                            title="Reject Expense"
                          >
                            {rejectingExpenseId === expense.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-text-light">
              Showing {expenses.length > 0 ? ((pagination.page - 1) * pagination.limit + 1) : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} expenses
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-text-dark">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  pagination.page === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-cream text-text-dark hover:bg-yellow/20'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-green">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={handleCloseAddModal}
                  className="text-text-light hover:text-text-dark transition-smooth"
                  disabled={submitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    placeholder="e.g., Office Supplies"
                    disabled={submitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Amount (PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={submitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    disabled={submitting || categoriesLoading}
                    required
                  >
                    <option value="">
                      {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {!categoriesLoading && categories.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">No categories available. Please contact support.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent resize-none"
                    placeholder="Optional notes..."
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-text-dark hover:bg-gray-50 transition-smooth"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow text-green rounded-lg font-semibold hover:bg-yellow-light transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting 
                      ? (editingExpense ? 'Updating...' : 'Adding...') 
                      : (editingExpense ? 'Update Expense' : 'Add Expense')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
