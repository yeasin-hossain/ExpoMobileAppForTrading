import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileMenu, { MenuItemData } from '../../components/profile/ProfileMenu';
import ProfileStats from '../../components/profile/ProfileStats';
import { useTheme } from '../../contexts/ThemeContext';
import { showDeleteConfirmation, showLogoutConfirmation, showMenuItemAlert } from '../../utils/profileActions';
import { showThemeSelector } from '../../utils/themeSelector';

export default function ProfileTab() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const styles = createStyles(theme);

  const [menuItems, setMenuItems] = useState<MenuItemData[]>([
    { id: 1, icon: "color-palette", title: "Theme", subtitle: theme.name, isTheme: true },
    { id: 2, icon: "person", title: "Edit Profile", subtitle: "Update your information" },
    { id: 3, icon: "settings", title: "Settings", subtitle: "App preferences" },
    { id: 4, icon: "notifications", title: "Notifications", subtitle: "Push notifications" },
    { id: 5, icon: "shield-checkmark", title: "Privacy & Security", subtitle: "Account protection" },
    { id: 6, icon: "card", title: "Payment Methods", subtitle: "Manage cards & billing" },
    { id: 7, icon: "download", title: "Downloads", subtitle: "Offline content" },
    { id: 8, icon: "language", title: "Language", subtitle: "English" },
    { id: 9, icon: "moon", title: "Dark Mode", subtitle: "Automatic" },
    { id: 10, icon: "accessibility", title: "Accessibility", subtitle: "Display & interaction" },
    { id: 11, icon: "analytics", title: "Usage Analytics", subtitle: "Data & statistics" },
    { id: 12, icon: "cloud", title: "Backup & Sync", subtitle: "iCloud sync enabled" },
    { id: 13, icon: "help-circle", title: "Help & Support", subtitle: "FAQs & contact" },
    { id: 14, icon: "star", title: "Rate App", subtitle: "Share your feedback" },
    { id: 15, icon: "share", title: "Invite Friends", subtitle: "Share the app" },
    { id: 16, icon: "information-circle", title: "About", subtitle: "Version 1.0.0" },
    { id: 17, icon: "document-text", title: "Terms of Service" },
    { id: 18, icon: "lock-closed", title: "Privacy Policy" },
    { id: 19, icon: "log-out", title: "Logout", isLogout: true },
  ]);

  const [activeSwipeId, setActiveSwipeId] = useState<number | null>(null);
  const scrollY = useSharedValue(0);

  // Update theme subtitle when theme changes
  useEffect(() => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.isTheme
          ? { ...item, subtitle: theme.name }
          : item
      )
    );
  }, [theme.name]);

  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "March 2024",
    stats: [
      { label: "Photos", value: "156" },
      { label: "Followers", value: "2.4K" },
      { label: "Following", value: "180" },
    ]
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  }, []);

  const handleDeleteItem = (id: number) => {
    const item = menuItems.find(menuItem => menuItem.id === id);

    if (item?.isLogout) {
      showLogoutConfirmation(router);
      return;
    }

    if (item) {
      showDeleteConfirmation(item.title, () => {
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
        setActiveSwipeId(null);
      });
    }
  };

  const handleMenuItemPress = (item: MenuItemData) => {
    if (item.isLogout) {
      showLogoutConfirmation(router);
    } else if (item.isTheme) {
      showThemeSelector(setTheme);
    } else {
      showMenuItemAlert(item.title);
    }
  };

  const resetAllSwipes = () => {
    setActiveSwipeId(null);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onTouchStart={resetAllSwipes}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        onScroll={scrollHandler}
        bounces={true}
        bouncesZoom={false}
      >
        <ProfileHeader profileData={profileData} scrollY={scrollY} />
        <ProfileStats stats={profileData.stats} />
        <ProfileMenu
          menuItems={menuItems}
          activeSwipeId={activeSwipeId}
          onDeleteItem={handleDeleteItem}
          onMenuItemPress={handleMenuItemPress}
          onSwipeStart={setActiveSwipeId}
          onSwipeReset={resetAllSwipes}
        />
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
