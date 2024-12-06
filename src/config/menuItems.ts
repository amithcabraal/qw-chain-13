import { Home, HelpCircle, History, Mail, Shield, Maximize, Smartphone, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Page } from '../types';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  page?: Page;
  action?: 'share' | 'fullscreen' | 'horizontal';
}

export const menuItems: MenuItem[] = [
  { icon: Home, label: 'Home', page: 'game' },
  { icon: HelpCircle, label: 'How to Play', page: 'how-to-play' },
  { icon: History, label: 'Recent Games', page: 'history' },
  { icon: Mail, label: 'Contact Us', page: 'contact' },
  { icon: Shield, label: 'Privacy Policy', page: 'privacy' },
  { icon: Share2, label: 'Share Game', action: 'share' },
  { icon: Maximize, label: 'Toggle Fullscreen', action: 'fullscreen' },
  { icon: Smartphone, label: 'Change Layout', action: 'horizontal' }
];