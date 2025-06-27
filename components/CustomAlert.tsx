import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  showCloseButton?: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
  showCloseButton = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleBackdropPress = () => {
    if (onDismiss && showCloseButton) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <BlurView intensity={20} style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.alertContainer}>
              <View style={styles.alertContent}>
                {title && (
                  <Text style={styles.title}>{title}</Text>
                )}
                
                {message && (
                  <Text style={styles.message}>{message}</Text>
                )}

                <View style={styles.buttonContainer}>
                  {buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        button.style === 'cancel' && styles.cancelButton,
                        button.style === 'destructive' && styles.destructiveButton,
                        buttons.length === 1 && styles.singleButton,
                        index === 0 && buttons.length > 1 && styles.firstButton,
                        index === buttons.length - 1 && buttons.length > 1 && styles.lastButton,
                      ]}
                      onPress={() => handleButtonPress(button)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === 'cancel' && styles.cancelButtonText,
                          button.style === 'destructive' && styles.destructiveButtonText,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Custom Alert Hook for easy usage
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    title?: string;
    message?: string;
    buttons?: AlertButton[];
  }>({
    visible: false,
  });

  const showAlert = React.useCallback((config: {
    title?: string;
    message?: string;
    buttons?: AlertButton[];
  }) => {
    // Schedule state update to avoid conflicts with concurrent features
    setTimeout(() => {
      setAlertConfig({
        ...config,
        visible: true,
      });
    }, 0);
  }, []);

  const hideAlert = React.useCallback(() => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = React.useCallback(() => (
    <CustomAlert
      {...alertConfig}
      onDismiss={hideAlert}
    />
  ), [alertConfig, hideAlert]);

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

// Simple alert functions (similar to native Alert API)
let currentAlert: {
  setVisible: (visible: boolean) => void;
  setConfig: (config: any) => void;
} | null = null;

export const CustomAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title?: string;
    message?: string;
    buttons?: AlertButton[];
  }>({});

  React.useEffect(() => {
    currentAlert = { setVisible, setConfig };
    return () => {
      currentAlert = null;
    };
  }, []);

  return (
    <>
      {children}
      <CustomAlert
        visible={visible}
        {...config}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
};

// Static methods (similar to React Native Alert)
export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    if (currentAlert) {
      // Schedule the alert to avoid concurrent rendering issues
      setTimeout(() => {
        if (currentAlert) {
          currentAlert.setConfig({ title, message, buttons });
          currentAlert.setVisible(true);
        }
      }, 0);
    }
  },
};

const createStyles = (theme: any) => StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: Dimensions.get('window').width * 0.85,
    maxWidth: 400,
  },
  alertContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: theme.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.buttonBackground,
    borderRadius: 12,
    alignItems: 'center',
  },
  singleButton: {
    flex: 1,
  },
  firstButton: {
    marginRight: 6,
  },
  lastButton: {
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: theme.border,
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.buttonText || '#FFFFFF',
  },
  cancelButtonText: {
    color: theme.text,
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
});
