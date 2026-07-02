import { useCallback, useEffect, useState } from 'react'
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react'
import { fetchStats, fetchSubmissions, type Stats, type Submission } from '../lib/api'
import { clearAdminSession, getAdminUser } from '../lib/auth'
import LanguageToggle from './LanguageToggle'

type Props = {
  onLogout: () => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function Dashboard({ onLogout }: Props) {
  const admin = getAdminUser()
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async (searchTerm: string, currentPage: number) => {
    setLoading(true)
    setError('')

    try {
      const [statsData, submissionsData] = await Promise.all([
        fetchStats(),
        fetchSubmissions({ search: searchTerm, page: currentPage, limit: 20 }),
      ])

      setStats(statsData)
      setSubmissions(submissionsData.submissions)
      setTotalPages(submissionsData.pagination.pages)
      setTotal(submissionsData.pagination.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data.')
      if (err instanceof Error && err.message.includes('token')) {
        clearAdminSession()
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    loadData(search, page)
  }, [loadData, search, page])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleLogout = () => {
    clearAdminSession()
    onLogout()
  }

  const statCards = [
    {
      label: 'Total Signups',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
    },
    {
      label: 'Today',
      value: stats?.today ?? 0,
      icon: Calendar,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
    },
    {
      label: 'Newsletter Opt-in',
      value: stats?.newsletter ?? 0,
      icon: Bell,
      color: 'text-violet-400',
      bg: 'bg-violet-500/15',
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">Form Submissions</h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              All signup form queries from the main website
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <span className="hidden text-sm text-slate-400 sm:inline">{admin?.email}</span>
            <button
              type="button"
              onClick={() => loadData(search, page)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-semibold text-white">All Queries</h2>
              <p className="text-sm text-slate-500">{total} total submission{total !== 1 ? 's' : ''}</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {error && (
            <div className="border-b border-slate-800 px-5 py-4 text-sm text-red-400">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Newsletter</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading && submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      No form submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/30"
                    >
                      <td className="px-5 py-4 font-medium text-white">
                        {row.firstName} {row.lastName}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          {row.email}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {row.phone ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-300">
                            <Phone className="h-3.5 w-3.5 text-slate-500" />
                            {row.phone}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            row.newsletterConsent
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-slate-700/50 text-slate-400'
                          }`}
                        >
                          {row.newsletterConsent ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-cyan-500 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-cyan-500 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}