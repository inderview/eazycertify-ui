'use client'

import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

interface LockedAccount {
  id: number
  userId: string
  examId: number
  examCode: string
  examTitle: string
  deviceFingerprint: string
  lockReason: string | null
  lockedAt: string
  lastAccessedAt: string
}

interface AccessHistoryItem {
  id: number
  action: string
  adminEmail?: string
  reason?: string
  metadata: any
  ipAddress?: string
  createdAt: string
}

interface PaginatedResponse {
  data: LockedAccount[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function LockedAccountsPage() {
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlocking, setUnlocking] = useState<number | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  
  // Filters
  const [examFilter, setExamFilter] = useState('')
  const [dateFromFilter, setDateFromFilter] = useState('')
  const [dateToFilter, setDateToFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Detail modal
  const [selectedAccount, setSelectedAccount] = useState<LockedAccount | null>(null)
  const [accessHistory, setAccessHistory] = useState<AccessHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    fetchLockedAccounts()
  }, [currentPage, pageSize])

  const fetchLockedAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
      })
      
      if (examFilter) params.append('examId', examFilter)
      if (dateFromFilter) params.append('dateFrom', dateFromFilter)
      if (dateToFilter) params.append('dateTo', dateToFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`${API_BASE}/purchases/locked?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch locked accounts')
      }

      const data: PaginatedResponse = await response.json()
      setLockedAccounts(data.data)
      setTotalPages(data.totalPages)
      setTotalRecords(data.total)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchAccessHistory = async (purchaseId: number) => {
    try {
      setLoadingHistory(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_BASE}/purchases/history/${purchaseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch access history')
      }

      const data = await response.json()
      setAccessHistory(data)
    } catch (err: any) {
      console.error('Failed to load history:', err)
      setAccessHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleViewDetails = async (account: LockedAccount) => {
    setSelectedAccount(account)
    await fetchAccessHistory(account.id)
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    fetchLockedAccounts()
  }

  const handleClearFilters = () => {
    setExamFilter('')
    setDateFromFilter('')
    setDateToFilter('')
    setSearchQuery('')
    setCurrentPage(1)
    setTimeout(() => fetchLockedAccounts(), 0)
  }

  const handleUnlock = async (purchaseId: number) => {
    if (!confirm('Are you sure you want to unlock this account? The user will be able to access the course from their original device.')) {
      return
    }

    try {
      setUnlocking(purchaseId)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`${API_BASE}/purchases/unlock/${purchaseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to unlock account')
      }

      // Remove the unlocked account from the list
      setLockedAccounts(prev => prev.filter(acc => acc.id !== purchaseId))
      setTotalRecords(prev => prev - 1)
      
      if (selectedAccount?.id === purchaseId) {
        setSelectedAccount(null)
      }
      
      alert('Account unlocked successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to unlock account')
    } finally {
      setUnlocking(null)
    }
  }

  if (loading && currentPage === 1) {
    return (
      <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Locked Accounts</h2>
        <div className="mt-4 text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading locked accounts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Locked Accounts</h2>
        <div className="mt-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-400">Error: {error}</p>
          <button
            onClick={fetchLockedAccounts}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Locked Accounts</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {totalRecords} account(s) locked due to multi-device access attempts
            </p>
          </div>
          <button
            onClick={fetchLockedAccounts}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search User ID
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter user ID..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam ID
              </label>
              <input
                type="number"
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                placeholder="Filter by exam..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 rounded-md transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Pagination Controls Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>

        {lockedAccounts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No locked accounts</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All user accounts are currently active and accessible
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">User ID</th>
                  <th className="pb-3 pr-4">Exam</th>
                  <th className="pb-3 pr-4">Device</th>
                  <th className="pb-3 pr-4">Lock Reason</th>
                  <th className="pb-3 pr-4">Locked At</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {lockedAccounts.map((account) => (
                  <tr key={account.id} className="text-sm">
                    <td className="py-4 pr-4 font-mono text-xs text-gray-900 dark:text-gray-100">
                      {account.userId.substring(0, 12)}...
                    </td>
                    <td className="py-4 pr-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {account.examCode}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {account.examTitle}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {account.deviceFingerprint.substring(0, 20)}...
                    </td>
                    <td className="py-4 pr-4">
                      <div className="max-w-xs truncate text-gray-700 dark:text-gray-300" title={account.lockReason || 'N/A'}>
                        {account.lockReason || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                      <div className="whitespace-nowrap">
                        {new Date(account.lockedAt).toLocaleDateString()} <br/>
                        <span className="text-xs">{new Date(account.lockedAt).toLocaleTimeString()}</span>
                        {(() => {
                          const unlockTime = new Date(new Date(account.lockedAt).getTime() + 48 * 60 * 60 * 1000);
                          const now = new Date();
                          const hoursRemaining = Math.max(0, Math.floor((unlockTime.getTime() - now.getTime()) / (1000 * 60 * 60)));
                          if (hoursRemaining > 0) {
                            return (
                              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                Auto-unlocks in {hoursRemaining}h
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(account)}
                          className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleUnlock(account.id)}
                          disabled={unlocking === account.id}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {unlocking === account.id ? 'Unlocking...' : 'Unlock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls Bottom */}
        {lockedAccounts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} ({totalRecords} total)
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Account Details</h3>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">User ID</label>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">{selectedAccount.userId}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Exam</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAccount.examCode} - {selectedAccount.examTitle}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Device Fingerprint</label>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">{selectedAccount.deviceFingerprint}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Locked At</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedAccount.lockedAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Lock Reason</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAccount.lockReason || 'N/A'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                <h4 className="text-md font-semibold mb-3">Access History</h4>
                {loadingHistory ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : accessHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No access history available</p>
                ) : (
                  <div className="space-y-3">
                    {accessHistory.map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                item.action === 'unlocked' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                item.action === 'locked' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {item.action}
                              </span>
                              {item.adminEmail && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  by {item.adminEmail}
                                </span>
                              )}
                            </div>
                            {item.reason && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{item.reason}</p>
                            )}
                            {item.ipAddress && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">IP: {item.ipAddress}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUnlock(selectedAccount.id)
                }}
                disabled={unlocking === selectedAccount.id}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {unlocking === selectedAccount.id ? 'Unlocking...' : 'Unlock Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
