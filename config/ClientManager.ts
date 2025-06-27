import { ClientConfig, defaultConfig } from './ClientConfig';

// Client-specific configurations
const clientConfigs: Record<string, ClientConfig> = {
  'client-a': {
    ...defaultConfig,
    appName: "CryptoTrader Pro",
    logoUrl: "/assets/images/client-a-logo.png",
    primaryColor: "#1E40AF",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    
    apiEndpoints: {
      baseUrl: "https://api.clienta.com",
      tradingUrl: "https://trading.clienta.com",
      newsUrl: "https://news.clienta.com",
    },
    
    trading: {
      supportedAssets: ["BTC", "ETH", "USDT", "BNB"],
      minTradeAmount: 50,
      maxTradeAmount: 50000,
      supportedFiatCurrencies: ["USD", "EUR"],
    },
    
    legal: {
      termsUrl: "https://clienta.com/terms",
      privacyUrl: "https://clienta.com/privacy",
      supportEmail: "support@clienta.com",
      companyName: "Client A Trading Ltd.",
    },
    
    appStore: {
      bundleId: "com.clienta.cryptotrader",
      version: "1.0.0",
      buildNumber: 1,
    },
  },
  
  'client-b': {
    ...defaultConfig,
    appName: "InvestMate",
    logoUrl: "/assets/images/client-b-logo.png",
    primaryColor: "#7C3AED",
    secondaryColor: "#06B6D4",
    accentColor: "#EF4444",
    
    features: {
      ...defaultConfig.features,
      news: false, // Client B doesn't want news feature
      analytics: false,
    },
    
    apiEndpoints: {
      baseUrl: "https://api.clientb.com",
      tradingUrl: "https://trading.clientb.com",
      newsUrl: "https://news.clientb.com",
    },
    
    trading: {
      supportedAssets: ["BTC", "ETH", "ADA"],
      minTradeAmount: 25,
      maxTradeAmount: 25000,
      supportedFiatCurrencies: ["USD", "GBP"],
    },
    
    theme: {
      darkMode: false, // Client B prefers light theme
      borderRadius: 8,
      spacing: 12,
    },
    
    legal: {
      termsUrl: "https://clientb.com/terms",
      privacyUrl: "https://clientb.com/privacy",
      supportEmail: "help@clientb.com",
      companyName: "Client B Investments Inc.",
    },
    
    appStore: {
      bundleId: "com.clientb.investmate",
      version: "1.0.0",
      buildNumber: 1,
    },
  },
};

// Get current client from environment or build config
const getCurrentClient = (): string => {
  // You can set this via environment variables, build flavors, or remote config
  return process.env.EXPO_PUBLIC_CLIENT_ID || 'default';
};

// Get configuration for current client
export const getClientConfig = (): ClientConfig => {
  const clientId = getCurrentClient();
  return clientConfigs[clientId] || defaultConfig;
};

// Helper to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof ClientConfig['features']): boolean => {
  const config = getClientConfig();
  return config.features[feature];
};

export { clientConfigs };
