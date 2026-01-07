
export type Tab = 'home' | 'create' | 'profile' | 'business' | 'search';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified: boolean; // NID/Passport Verified
  earnings: number; // In PGK (Kina) - This is the user's 60% cut
  accountType: 'personal' | 'business';
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string; // The text content
  category: 'Education' | 'Culture' | 'Development' | 'Business' | 'Sponsored' | 'AI Art';
  likes: number;
  comments: number;
  shares: number;
  isVerified: boolean;
  backgroundGradient: string; // For the visual card style
  isAd?: boolean;
  ctaLink?: string;
  ctaText?: string;
  imageUrl?: string; // Optional image attachment
  videoUrl?: string; // Optional video attachment
}

export interface AdCampaign {
  id: string;
  headline: string;
  content: string;
  budget: number;
  status: 'draft' | 'scanning' | 'approved' | 'rejected' | 'active';
  complianceLog: string[];
}

export type PaymentProvider = 'BSP' | 'Kina Bank' | 'CellMoni' | 'MiBank';

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isMapResult?: boolean;
  mapData?: any;
}
