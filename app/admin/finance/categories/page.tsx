'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/src/services/apiClient'

interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

interface FormData {
  name: string
  description: string
  active: boolean
}

export default function CategoriesPage() {
  // State
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Disable state
  const [disablingCategoryId, setDisablingCategoryId] = useState<string | null>(null)

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient<any>('/finance/categories', {
        method: 'GET',
      })

      console.log('[Categories] API response:', response)

      // Handle different response structures
      let categoriesData: Category[] = []
      if (response.data) {
        categoriesData = Array.isArray(response.data) ? response.data : (response.data.categories || [])
      } else if (response.categories) {
        categoriesData = response.categories
      } else if (Array.isArray(response)) {
        categoriesData = response
      }

      setCategories(categoriesData)
    } catch (err: any) {
      console.error('[Categories] Failed to fetch:', err)
      setError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      active: true,
    })
    setFormError(null)
    setShowAddModal(true)
  }

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      active: category.active,
    })
    setFormError(null)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      active: true,
    })
    setFormError(null)
  }

  // Submit handler (Add or Edit)
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      setFormError('Category name is required')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        active: formData.active,
      }

      if (editingCategory) {
        // Edit existing category
        await apiClient(`/finance/categories/${editingCategory.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        // Add new category
        await apiClient('/finance/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      // Refresh categories list
      await fetchCategories()
      handleCloseAddModal()
    } catch (err: any) {
      console.error('[Categories] Failed to submit:', err)
      setFormError(err.message || `Failed to ${editingCategory ? 'update' : 'create'} category`)
    } finally {
      setSubmitting(false)
    }
  }

  // Disable category handler
  const handleDisableCategory = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to ${category.active ? 'disable' : 'enable'} "${category.name}"?`)) {
      return
    }

    try {
      setDisablingCategoryId(category.id)
      setError(null)

      await apiClient(`/finance/categories/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !category.active }),
      })

      // Refresh categories list
      await fetchCategories()
    } catch (err: any) {
      console.error('[Categories] Failed to toggle status:', err)
      
      // Check if category is in use
      if (err.message?.toLowerCase().includes('in use') || err.message?.toLowerCase().includes('cannot disable')) {
        alert(`Cannot disable "${category.name}": This category is currently in use by existing expenses.`)
      } else {
        setError(err.message || 'Failed to update category status')
      }
    } finally {
      setDisablingCategoryId(null)
    }
  }

  // Statistics
  const activeCount = categories.filter(c => c.active).length
  const inactiveCount = categories.filter(c => !c.active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green">Expense Categories</h1>
          <p className="text-text-light mt-1">Manage expense categories for your organization</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-yellow text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow/90 transition-smooth shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light text-sm font-medium">Total Categories</p>
              <p className="text-3xl font-bold text-green mt-2">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-green/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-green mt-2">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light text-sm font-medium">Inactive</p>
              <p className="text-3xl font-bold text-yellow mt-2">{inactiveCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-green uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow border-t-transparent"></div>
                      <span className="ml-3 text-text-light">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-light">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-text-dark">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-dark text-sm max-w-md">
                        {category.description || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        category.active 
                          ? 'bg-green/10 text-green' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="text-yellow hover:text-yellow/80 font-medium transition-colors"
                          title="Edit Category"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDisableCategory(category)}
                          disabled={disablingCategoryId === category.id}
                          className={`font-medium transition-colors ${
                            category.active
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-green hover:text-green/80'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={category.active ? 'Disable Category' : 'Enable Category'}
                        >
                          {disablingCategoryId === category.id ? 'Processing...' : (category.active ? 'Disable' : 'Enable')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-green">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={handleCloseAddModal}
                className="text-text-light hover:text-text-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  placeholder="e.g., Utilities, Salaries, Marketing"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  placeholder="Optional description for this category"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-yellow focus:ring-yellow border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm font-semibold text-text-dark cursor-pointer">
                  Active (users can select this category)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-text-dark hover:bg-gray-50 transition-smooth"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow text-white rounded-lg font-semibold hover:bg-yellow/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
