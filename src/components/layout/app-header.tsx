
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import ThemeToggleButton from '@/components/ui/theme-toggle-button';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, LogOut, Settings as SettingsIcon, UserCircle, LayoutDashboard, Home, ShoppingBag as ProductsIcon, ShoppingCart, Menu, UserSquare2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const AppHeader = () => {
  const { user, loading, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { t } = useLanguage();
  const { getCartTotalItems } = useCart();
  const pathname = usePathname();
  const totalCartItems = getCartTotalItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: t('home'), icon: <Home size={18} /> },
    { href: '/products', label: t('products'), icon: <ProductsIcon size={18} /> },
  ];

  const desktopNavItems = isAdmin
    ? [...navItems, { href: '/admin', label: t('admin'), icon: <LayoutDashboard size={18} /> }]
    : navItems;

  const MobileNavLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <SheetClose asChild>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          pathname === href ? 'bg-muted text-primary font-semibold' : ''
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {icon}
        {children}
      </Link>
    </SheetClose>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                  {navItems.map((item) => (
                    <MobileNavLink key={item.href} href={item.href} icon={item.icon}>
                      {item.label}
                    </MobileNavLink>
                  ))}
                  {isAdmin && (
                    <MobileNavLink href="/admin" icon={<LayoutDashboard size={18}/>}>
                      {t('admin')}
                    </MobileNavLink>
                  )}
                </nav>
                <Separator className="my-4" />
                <div className="mt-auto flex flex-col gap-2">
                  {loading ? (
                     <Skeleton className="h-10 w-full" />
                  ) : user ? (
                    <>
                      <MobileNavLink href="/account" icon={<UserSquare2 size={18}/>}>
                        {t('account')}
                      </MobileNavLink>
                      <MobileNavLink href="/settings" icon={<SettingsIcon size={18}/>}>
                        {t('settings')}
                      </MobileNavLink>
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={signOut} className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-destructive">
                          <LogOut size={18}/> {t('logout')}
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Button onClick={signInWithGoogle} variant="outline" className="w-full justify-start gap-3 px-3 py-2">
                         <LogIn size={18}/> {t('loginWithGoogle')}
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-primary ${
                pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/70'
              }`}
            >
              <span className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors">
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button asChild variant="ghost" size="icon" className="relative hover:bg-accent/50 transition-colors">
            <Link href="/cart">
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {totalCartItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full animate-in fade-in zoom-in-75">
                  {totalCartItems}
                </Badge>
              )}
              <span className="sr-only">{t('shoppingCart')}</span>
            </Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggleButton />
          <div className="hidden md:block">
            {loading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-10 w-10 border hover:opacity-90 transition-opacity">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {t('roleLabel')}: <span className="font-medium">{isAdmin ? t('roleAdmin') : t('roleUser')}</span>
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{t('admin')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center cursor-pointer">
                      <UserSquare2 className="mr-2 h-4 w-4" />
                      <span>{t('account')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>{t('settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={signInWithGoogle} variant="outline" size="sm" className="hidden sm:inline-flex">
                <LogIn className="mr-2 h-4 w-4" />
                {t('loginWithGoogle')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
