'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavItem ({ href, label }: { href: string, label: string }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm transition ${
        active
          ? 'bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-blue-300'
          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
      }`}
    >
      {label}
    </Link>
  )
}

export function Sidebar () {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="h-14 flex items-center px-4 border-b border-gray-200/70 dark:border-zinc-800">
        <div className="font-semibold">EazyCertify Admin</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 px-2 mb-1">Navigation</div>
        <NavItem href="/admin" label="Dashboard" />
        <NavItem href="/admin/providers" label="Providers" />
        <NavItem href="/admin/exams" label="Exams" />
        <NavItem href="/admin/questions" label="Questions" />
        <NavItem href="/admin/users" label="Users" />
        <NavItem href="/admin/locked-accounts" label="Locked Accounts" />
        <NavItem href="/admin/revenue" label="Revenue" />
        <NavItem href="/admin/contact-requests" label="Contact Requests" />
        <NavItem href="/admin/settings" label="Settings" />
      </nav>
      <div className="p-3 text-xs text-gray-500 dark:text-gray-400">v1.0</div>
    </aside>
  )
}


