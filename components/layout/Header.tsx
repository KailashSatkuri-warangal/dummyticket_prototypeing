'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogIn,
  UserCircle2,
  LogOut,
  Ticket,
  ShieldCheck,
  Sparkles,
  User,
  Bell,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { DummyTicketLogo } from '@/components/brand/DummyTicketLogo';
import { useDemoSession } from '@/lib/mock/use-demo-session';
import { resetPrototypeData } from '@/lib/mock/store';

const NAV_ITEMS = [
  { label: 'Flights', href: '/flights' },
  { label: 'Track Booking', href: '/track-booking' },
  { label: 'Popular Routes', href: '/routes/hyd-to-del' },
  { label: 'Destinations', href: '/destinations/dubai' },
  { label: 'Travel Guides', href: '/blog' },
  { label: 'Help', href: '/help' },
];

export function Header({
  brandName = 'DummyTicket',
}: {
  brandName?: string;
}) {
  const { user, ready, signOut } = useDemoSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const isAdmin = user
    ? ['admin', 'support_agent', 'finance_manager', 'content_editor'].includes(user.role)
    : false;

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 12;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const firstName = user?.fullName?.split(' ')[0] ?? 'Account';
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : '';

  function handleSignOut() {
    setProfileOpen(false);
    setMobileOpen(false);
    signOut();
    router.push('/');
  }

  function handleResetDemo() {
    setProfileOpen(false);
    setMobileOpen(false);
    signOut();
    resetPrototypeData();
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md'
          : 'border-b border-slate-200/60 bg-white/85 backdrop-blur-sm'
      }`}
    >
      {/* Trust bar */}
      <div className="bg-navy-950 px-4 py-1.5 text-xs text-slate-200 border-b border-slate-800/80">
        <div className="container-page flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-verified-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-verified-400 border border-verified-500/30">
              <ShieldCheck className="h-3 w-3" />
              Secure Server-Verified Bookings
            </span>
            <span className="hidden md:inline text-slate-300">
              Instant e-documents · Verified payments · 24/7 support
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/track-booking" className="hover:text-white underline-offset-2 hover:underline">
              Track Booking
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-brand-300 font-medium hover:text-white">
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label={`${brandName} Home`}
            className="flex items-center gap-2.5 text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-600 rounded-lg"
          >
            <div className="hidden sm:block">
              <DummyTicketLogo variant="full" theme="light" size="md" showTagline={!scrolled} />
            </div>
            <div className="sm:hidden">
              <DummyTicketLogo variant="compact" theme="light" size="sm" showTagline={false} />
            </div>
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700"
          >
            {NAV_ITEMS.map((item) => {
              const baseHref = item.href.split('?')[0];
              const isActive =
                pathname === baseHref ||
                (baseHref !== '/' && pathname?.startsWith(baseHref));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'text-brand-600 font-semibold' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="header-nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {ready && user && <NotificationBell />}

          {!ready ? null : user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 text-xs font-semibold text-navy-900 shadow-sm hover:border-brand-400 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {initials || <User className="h-3.5 w-3.5" />}
                </span>
                <span className="hidden sm:inline max-w-[110px] truncate">{firstName}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-elevated"
                  >
                    <div className="border-b border-slate-100 px-3 pb-2.5 pt-1.5">
                      <p className="truncate text-sm font-bold text-navy-900">{user.fullName}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                      <span className="badge badge-brand mt-1.5 capitalize">{user.role.replace('_', ' ')}</span>
                    </div>
                    <div className="py-1.5">
                      {[
                        { href: '/account', label: 'Dashboard', icon: UserCircle2 },
                        { href: '/account/bookings', label: 'My Bookings', icon: Ticket },
                        { href: '/account/notifications', label: 'Notifications', icon: Bell },
                        { href: '/account/profile', label: 'Profile', icon: User },
                        { href: '/account/security', label: 'Security', icon: Lock },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Icon className="h-3.5 w-3.5 text-slate-400" />
                            {item.label}
                          </Link>
                        );
                      })}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin Console
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-slate-100 pt-1.5">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleResetDemo}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        Reset Demo Data
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-coral-600 hover:bg-coral-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-secondary hidden px-3 py-2 text-xs sm:inline-flex"
              >
                <LogIn className="h-4 w-4 text-brand-600" />
                Sign In
              </Link>

              <Link
                href="/signup"
                className="btn btn-primary px-3.5 py-2 text-xs focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile navigation menu"
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6"
          >
            <div className="grid grid-cols-1 gap-1.5 text-sm font-medium text-slate-800">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserCircle2 className="h-4 w-4 text-blue-600" />
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-brand-700"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-lg px-3 py-2.5 hover:bg-coral-50 flex items-center gap-2 text-coral-600 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4 text-brand-600" />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-brand-600" />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
