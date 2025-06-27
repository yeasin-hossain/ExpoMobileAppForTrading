import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onHide?: () => void;
  position?: 'top' | 'bottom';
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  position = 'top',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Use setTimeout to schedule animations outside of render cycle
      const timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(duration),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, 0);

      return () => clearTimeout(timer);
    } else {
      // Reset animation value when not visible
      slideAnim.setValue(0);
    }
  }, [visible, duration, onHide, slideAnim]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  if (!visible) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: position === 'top' ? [-100, 0] : [100, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topContainer : styles.bottomContainer,
        { transform: [{ translateY }] },
      ]}
    >
      <View style={[styles.toast, getToastStyle()]}>
        <Ionicons name={getIcon()} size={24} color="#FFFFFF" />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Hook for Toast
export const useToast = () => {
  const [toastConfig, setToastConfig] = React.useState<{
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'bottom';
  }>({
    visible: false,
    message: '',
  });

  const showToast = React.useCallback((config: {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'bottom';
  }) => {
    // Use startTransition or setTimeout to avoid scheduling updates during render
    setTimeout(() => {
      setToastConfig({
        ...config,
        visible: true,
      });
    }, 0);
  }, []);

  const hideToast = React.useCallback(() => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  }, []);

  const ToastComponent = React.useCallback(() => (
    <Toast
      {...toastConfig}
      onHide={hideToast}
    />
  ), [toastConfig, hideToast]);

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  topContainer: {
    top: 60,
  },
  bottomContainer: {
    bottom: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successToast: {
    backgroundColor: '#34C759',
  },
  errorToast: {
    backgroundColor: '#FF3B30',
  },
  warningToast: {
    backgroundColor: '#FF9500',
  },
  infoToast: {
    backgroundColor: '#007AFF',
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
});
