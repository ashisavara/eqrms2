"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu, User } from "lucide-react";

const menuItems = [
  {
    label: "About Us",
    href: "#",
    subItems: [
      { label: "About us", href: "/about-us" },
      { label: "Our Team", href: "/our-team" },
      { label: "Expertise", href: "/expertise" },
      { label: "Transparency", href: "/rms" },
      { label: "Customisation", href: "/client-dedication" },
    ],
  },
  {
    label: "Solutions",
    href: "#",
    subItems: [
      { label: "Products", href: "/products" },
      { label: "Individuals & Families", href: "/family-solutions" },
      { label: "Retirees", href: "/retiree-solutions" },
      { label: "Family Offices / Ultra HNI", href: "/family-office-and-ultra-hni" },
      { label: "Corporate Treasury", href: "/corporate-solutions" },
      { label: "NRI/OCI/PIO", href: "/nri-investment-solutions" },
    ],
  },
  {
    label: "Insights",
    href: "#",
    subItems: [
      { label: "Blog", href: "/blogs" },
      { label: "Queries", href: "/investment-query" },
      { label: "Media", href: "/media-interview" },
      { label: "Calculators", href: "/financial-calculator" },
    ],
  },
];

export function PublicNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ime-logo.png"
                  alt="IME Capital"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Menu Items */}
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.label} asChild>
                        <Link href={subItem.href}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            {/* Create Account Button */}
            <div className="flex-shrink-0">
              <Button asChild>
                <Link href="/15-minute-introductory-call">Book Introduction Call</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Hamburger Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 px-4">
                  {menuItems.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className="block text-sm bg-gray-100 p-2 font-medium text-gray-900 mb-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <div className="ml-4 space-y-2 text-base">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center">
                <img
                  src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ime-logo.png"
                  alt="IME Capital"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Mobile Login Icon */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/15-minute-introductory-call">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
