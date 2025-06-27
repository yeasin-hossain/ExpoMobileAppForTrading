import React from 'react';
import { getClientConfig, isFeatureEnabled } from '../config/ClientManager';

interface FeatureGateProps {
  feature: keyof ReturnType<typeof getClientConfig>['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback = null 
}) => {
  const enabled = isFeatureEnabled(feature);
  
  return enabled ? <>{children}</> : <>{fallback}</>;
};

// Higher-order component for feature gating
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof ReturnType<typeof getClientConfig>['features'],
  fallback?: React.ComponentType<P>
) {
  return function FeatureGatedComponent(props: P) {
    const enabled = isFeatureEnabled(feature);
    
    if (!enabled && fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...props} />;
    }
    
    return enabled ? <Component {...props} /> : null;
  };
}

// Hook for feature checking
export const useFeature = (feature: keyof ReturnType<typeof getClientConfig>['features']): boolean => {
  return isFeatureEnabled(feature);
};
