export interface MiniTool {
  id: string;
  title: string;
  tagline: string;
  category: string;
  prompt: string;
  features: string[];
  instructions: string;
  html: string;
  createdAt: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

export type ViewTab = 'home' | 'my-tools' | 'about';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
