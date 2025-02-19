import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' }, //removing other hrefs for now
  { key: 'customers', title: 'Patients', href: '/', icon: 'users' },
  { key: 'settings', title: 'Settings', href: '/', icon: 'gear-six' },
  { key: 'account', title: 'Account', href: '/', icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
