import { Grid3x3, Laptop, Headphones, Watch, Monitor, Camera, Cable, type LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  value: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { label: 'All Products', value: 'All', icon: Grid3x3 },
  { label: 'Laptops', value: 'Laptops', icon: Laptop },
  { label: 'Audio', value: 'Audio', icon: Headphones },
  { label: 'Wearables', value: 'Wearables', icon: Watch },
  { label: 'Monitors', value: 'Monitors', icon: Monitor },
  { label: 'Cameras', value: 'Cameras', icon: Camera },
  { label: 'Accessories', value: 'Accessories', icon: Cable },
];
