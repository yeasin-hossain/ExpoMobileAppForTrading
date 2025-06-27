import React from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export interface ActionSheetButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
  icon?: string;
}

interface ActionSheetProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons: ActionSheetButton[];
  onDismiss?: () => void;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleButtonPress = (button: ActionSheetButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Separate cancel buttons from other buttons
  const cancelButtons = buttons.filter(btn => btn.style === 'cancel');
  const otherButtons = buttons.filter(btn => btn.style !== 'cancel');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.actionSheetContainer,
                { transform: [{ translateY }] },
              ]}
            >
              {/* Main action sheet */}
              <View style={styles.actionSheet}>
                {(title || message) && (
                  <View style={styles.header}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}
                  </View>
                )}

                {otherButtons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'destructive' && styles.destructiveButton,
                      index === otherButtons.length - 1 && styles.lastButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === 'destructive' && styles.destructiveButtonText,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cancel buttons (separate section) */}
              {cancelButtons.length > 0 && (
                <View style={styles.cancelSection}>
                  {cancelButtons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.cancelButton}
                      onPress={() => handleButtonPress(button)}
                    >
                      <Text style={styles.cancelButtonText}>{button.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Hook for Action Sheet
export const useActionSheet = () => {
  const [sheetConfig, setSheetConfig] = React.useState<{
    visible: boolean;
    title?: string;
    message?: string;
    buttons: ActionSheetButton[];
  }>({
    visible: false,
    buttons: [],
  });

  const showActionSheet = React.useCallback((config: {
    title?: string;
    message?: string;
    buttons: ActionSheetButton[];
  }) => {
    // Schedule state update to avoid concurrent rendering issues
    setTimeout(() => {
      setSheetConfig({
        ...config,
        visible: true,
      });
    }, 0);
  }, []);

  const hideActionSheet = React.useCallback(() => {
    setSheetConfig(prev => ({ ...prev, visible: false }));
  }, []);

  const ActionSheetComponent = React.useCallback(() => (
    <ActionSheet
      {...sheetConfig}
      onDismiss={hideActionSheet}
    />
  ), [sheetConfig, hideActionSheet]);

  return {
    showActionSheet,
    hideActionSheet,
    ActionSheetComponent,
  };
};

const createStyles = (theme: any) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    paddingHorizontal: 16,
    paddingBottom: 34, // Safe area for iOS
  },
  actionSheet: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: theme.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  lastButton: {
    borderBottomWidth: 0,
  },
  destructiveButton: {
    // Keep same background, just change text color
  },
  buttonText: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  destructiveButtonText: {
    color: '#FF3B30',
  },
  cancelSection: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    fontWeight: '600',
  },
});
