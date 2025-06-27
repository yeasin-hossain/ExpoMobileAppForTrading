export interface ClientConfig {
  // Branding
  appName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Features
  features: {
    trading: boolean;
    portfolio: boolean;
    news: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  
  // API Configuration
  apiEndpoints: {
    baseUrl: string;
    tradingUrl: string;
    newsUrl: string;
  };
  
  // Trading Configuration
  trading: {
    supportedAssets: string[];
    minTradeAmount: number;
    maxTradeAmount: number;
    supportedFiatCurrencies: string[];
  };
  
  // UI/UX Configuration
  theme: {
    darkMode: boolean;
    customFonts?: string[];
    borderRadius: number;
    spacing: number;
  };
  
  // Legal & Compliance
  legal: {
    termsUrl: string;
    privacyUrl: string;
    supportEmail: string;
    companyName: string;
  };
  
  // App Store Configuration
  appStore: {
    bundleId: string;
    version: string;
    buildNumber: number;
  };
}

// Default configuration
export const defaultConfig: ClientConfig = {
  appName: "StickerSmash",
  logoUrl: "/assets/images/icon.png",
  primaryColor: "#007AFF",
  secondaryColor: "#34C759",
  accentColor: "#FF3B30",
  
  features: {
    trading: true,
    portfolio: true,
    news: true,
    analytics: true,
    notifications: true,
  },
  
  apiEndpoints: {
    baseUrl: "https://api.default.com",
    tradingUrl: "https://trading.default.com",
    newsUrl: "https://news.default.com",
  },
  
  trading: {
    supportedAssets: ["BTC", "ETH", "ADA", "DOT"],
    minTradeAmount: 10,
    maxTradeAmount: 100000,
    supportedFiatCurrencies: ["USD", "EUR", "GBP"],
  },
  
  theme: {
    darkMode: true,
    borderRadius: 12,
    spacing: 16,
  },
  
  legal: {
    termsUrl: "https://default.com/terms",
    privacyUrl: "https://default.com/privacy",
    supportEmail: "support@default.com",
    companyName: "Default Company Inc.",
  },
  
  appStore: {
    bundleId: "com.default.stickersmash",
    version: "1.0.0",
    buildNumber: 1,
  },
};
