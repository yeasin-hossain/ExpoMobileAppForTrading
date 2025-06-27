import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import MenuItem from './MenuItem';

export interface MenuItemData {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
  isTheme?: boolean;
  isLogout?: boolean;
}

interface ProfileMenuProps {
  menuItems: MenuItemData[];
  activeSwipeId: number | null;
  onDeleteItem: (id: number) => void;
  onMenuItemPress: (item: MenuItemData) => void;
  onSwipeStart: (id: number) => void;
  onSwipeReset: () => void;
}

export default function ProfileMenu({
  menuItems,
  activeSwipeId,
  onDeleteItem,
  onMenuItemPress,
  onSwipeStart,
  onSwipeReset,
}: ProfileMenuProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          onDelete={onDeleteItem}
          onPress={() => onMenuItemPress(item)}
          isActive={activeSwipeId === item.id}
          onSwipeStart={() => onSwipeStart(item.id)}
          onSwipeReset={onSwipeReset}
          isLogout={item.isLogout || false}
          isTheme={item.isTheme || false}
        />
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  menuContainer: {
    padding: 20,
    backgroundColor: theme.cardBackground,
    paddingBottom: 40,
  },
});
