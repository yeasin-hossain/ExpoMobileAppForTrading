import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface MenuItemProps {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
  onDelete: (id: number) => void;
  onPress: () => void;
  isActive: boolean;
  onSwipeStart: () => void;
  onSwipeReset: () => void;
  isLogout?: boolean;
  isTheme?: boolean;
}

export default function MenuItem({
  id,
  icon,
  title,
  subtitle,
  onDelete,
  onPress,
  isActive,
  onSwipeStart,
  onSwipeReset,
  isLogout = false,
  isTheme = false,
}: MenuItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const translateX = useSharedValue(0);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);

  // Reset this item when another item becomes active
  useEffect(() => {
    if (!isActive && isSwipedLeft) {
      setIsSwipedLeft(false);
      translateX.value = withSpring(0);
    }
  }, [isActive, isSwipedLeft, translateX]);

  const showDeleteOption = () => {
    setIsSwipedLeft(true);
    translateX.value = withSpring(-80);
    onSwipeStart();
  };

  const resetPosition = () => {
    setIsSwipedLeft(false);
    translateX.value = withSpring(0);
    onSwipeReset();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate for horizontal gestures
    .failOffsetY([-10, 10])   // Fail for vertical gestures to allow ScrollView
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        runOnJS(showDeleteOption)();
      } else {
        runOnJS(resetPosition)();
      }
    });

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Animated.View style={styles.menuItemContainer}>
      <GestureDetector gesture={panGesture}>
        <TouchableOpacity
          style={styles.menuItemWrapper}
          activeOpacity={0.7}
          onPress={() => {
            if (isSwipedLeft) {
              resetPosition();
            } else {
              onPress();
            }
          }}
        >
          <Animated.View style={[styles.menuItem, animatedStyle]}>
            <Ionicons
              name={icon as any}
              size={24}
              color={isLogout ? theme.errorText : isTheme ? theme.selectedButton : theme.selectedButton}
            />
            <Animated.View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{title}</Text>
              {subtitle && (
                <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
              )}
            </Animated.View>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
          </Animated.View>
        </TouchableOpacity>
      </GestureDetector>

      {isSwipedLeft && (
        <TouchableOpacity
          style={[styles.deleteButton, isLogout && styles.logoutButton]}
          onPress={handleDelete}
        >
          <Ionicons
            name={isLogout ? "log-out" : "trash"}
            size={20}
            color="#fff"
          />
          {isLogout && <Text style={styles.logoutButtonText}>Logout</Text>}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  menuItemContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  menuItemWrapper: {
    width: '100%',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.cardBackground,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.text,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: theme.secondaryText,
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: theme.errorText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: theme.warningText,
    width: 100,
    flexDirection: 'row',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
