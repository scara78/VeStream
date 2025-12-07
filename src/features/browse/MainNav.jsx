'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const MainNav = ({ className, ...props }) => {
  const pathname = usePathname()

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/browse/movie', label: 'Movies' },
    { href: '/browse/tv', label: 'TV Shows' },
    { href: '/my-list', label: 'My List' },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link key={route.href} href={route.href} className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === route.href ? "text-primary" : "text-muted-foreground"
        )}>{route.label}</Link>
      ))}
    </nav>
  )
}

export default MainNav;