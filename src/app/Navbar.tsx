'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
    const pathname = usePathname()
    return (
        <nav className="mt-8 flex w-full justify-center gap-8 px-8">
            <Link
                href={'/'}
                className={
                    pathname === '/'
                        ? 'font-bold underline hover:text-blue-700'
                        : 'hover:text-blue-700'
                }
            >
                Upload CSV
            </Link>
            <Link
                href={'/add-module'}
                className={
                    pathname === '/add-module'
                        ? 'font-bold underline hover:text-blue-700'
                        : 'hover:text-blue-700'
                }
            >
                Add Modules
            </Link>
        </nav>
    )
}
