import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from "react-native";
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
    { id: 2, icon: "settings", title: "Settings" },
    { id: 3, icon: "notifications", title: "Notifications" },
    { id: 4, icon: "help-circle", title: "Help & Support" },
    { id: 5, icon: "information-circle", title: "About" },
    { id: 6, icon: "log-out", title: "Logout", isLogout: true },
  ]);

  const [activeSwipeId, setActiveSwipeId] = useState<number | null>(null);

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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onTouchStart={resetAllSwipes}
      >
        <ProfileHeader profileData={profileData} />
        <ProfileStats stats={profileData.stats} />
        <ProfileMenu
          menuItems={menuItems}
          activeSwipeId={activeSwipeId}
          onDeleteItem={handleDeleteItem}
          onMenuItemPress={handleMenuItemPress}
          onSwipeStart={setActiveSwipeId}
          onSwipeReset={resetAllSwipes}
        />
      </ScrollView>
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
