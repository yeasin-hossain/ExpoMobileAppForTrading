import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    email: string;
    joinDate: string;
  };
  scrollY: SharedValue<number>;
}

export default function ProfileHeader({ profileData, scrollY }: ProfileHeaderProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const HEADER_MAX_HEIGHT = 220;
  const HEADER_MIN_HEIGHT = 100;
  const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      'clamp'
    );

    return {
      height,
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [1, 0.65],
      'clamp'
    );

    return {
      transform: [{ scale }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE * 0.4],
      [1, 0],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -30],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const compactTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.6, SCROLL_DISTANCE],
      [0, 1],
      'clamp'
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      {/* Main content */}
      <Animated.View style={[styles.mainContent, textAnimatedStyle]}>
        <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
          <Ionicons name="person" size={60} color={theme.selectedButtonText} />
        </Animated.View>
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
        <Text style={styles.joinDate}>Joined {profileData.joinDate}</Text>
      </Animated.View>

      {/* Compact header that appears when scrolled */}
      <Animated.View style={[styles.compactHeader, compactTextStyle]}>
        <Animated.View style={[styles.compactAvatar, avatarAnimatedStyle]}>
          <Ionicons name="person" size={30} color={theme.selectedButtonText} />
        </Animated.View>
        <Text style={styles.compactName}>{profileData.name}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    backgroundColor: theme.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.headerBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: 200,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.selectedButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: theme.secondaryText,
    marginBottom: 10,
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 14,
    color: theme.secondaryText,
    textAlign: 'center',
  },
  compactHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.headerBackground,
  },
  compactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.selectedButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
});
