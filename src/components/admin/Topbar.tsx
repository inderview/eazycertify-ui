'use client'

export function Topbar () {
  return (
    <div className="h-14 border-b border-gray-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur flex items-center justify-between px-4">
      <div className="font-medium">Dashboard</div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          onClick={() => {
            localStorage.removeItem('adminToken')
            location.href = '/admin/login'
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}


