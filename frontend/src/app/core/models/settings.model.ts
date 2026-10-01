export interface SiteSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  storeEnabled: boolean;
  showPrices: boolean;
  currency: string;
  defaultTheme: string;
  social: {
    instagram: string;
    facebook: string;
    email: string;
  };
}

/** Used until /api/settings responds, or if the API is unreachable. */
export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'Gulora',
  tagline: 'Herbs & Jewels',
  whatsappNumber: '923712331745',
  storeEnabled: false,
  showPrices: false,
  currency: 'PKR',
  defaultTheme: 'blush',
  social: { instagram: 'https://www.instagram.com/gulora.herbs.jewels/', facebook: '', email: '' },
};
