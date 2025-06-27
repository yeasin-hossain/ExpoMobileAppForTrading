import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileTab() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [menuItems, setMenuItems] = useState([
    { id: 1, icon: "color-palette", title: "Theme", isTheme: true },
    { id: 2, icon: "settings", title: "Settings" },
    { id: 3, icon: "notifications", title: "Notifications" },
    { id: 4, icon: "help-circle", title: "Help & Support" },
    { id: 5, icon: "information-circle", title: "About" },
    { id: 6, icon: "log-out", title: "Logout", isLogout: true },
  ]);

  const [activeSwipeId, setActiveSwipeId] = useState<number | null>(null);

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
      handleLogout();
      return;
    }

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
            setActiveSwipeId(null);
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Navigate back to login page
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleMenuItemPress = (item: any) => {
    if (item.isLogout) {
      handleLogout();
    } else if (item.isTheme) {
      toggleTheme();
    } else {
      // Handle other menu items
      Alert.alert(item.title, `${item.title} pressed`);
    }
  };

  const resetAllSwipes = () => {
    setActiveSwipeId(null);
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.background }]} activeOpacity={1} onPress={resetAllSwipes}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.selectedButton }]}>
          <Ionicons name="person" size={60} color={theme.selectedButtonText} />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{profileData.name}</Text>
        <Text style={[styles.email, { color: theme.secondaryText }]}>{profileData.email}</Text>
        <Text style={[styles.joinDate, { color: theme.secondaryText }]}>Joined {profileData.joinDate}</Text>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground }]}>
        {profileData.stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id}
            id={item.id}
            icon={item.icon} 
            title={item.title}
            onDelete={handleDeleteItem}
            onPress={() => handleMenuItemPress(item)}
            isActive={activeSwipeId === item.id}
            onSwipeStart={() => setActiveSwipeId(item.id)}
            onSwipeReset={() => setActiveSwipeId(null)}
            isLogout={item.isLogout || false}
            isTheme={item.isTheme || false}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

function MenuItem({ 
  id, 
  icon, 
  title, 
  onDelete, 
  onPress,
  isActive, 
  onSwipeStart, 
  onSwipeReset,
  isLogout = false,
  isTheme = false
}: { 
  id: number; 
  icon: string; 
  title: string; 
  onDelete: (id: number) => void;
  onPress: () => void;
  isActive: boolean;
  onSwipeStart: () => void;
  onSwipeReset: () => void;
  isLogout?: boolean;
  isTheme?: boolean;
}) {
  const { theme } = useTheme();
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
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        // Swipe left - show delete option
        runOnJS(showDeleteOption)();
      } else {
        // Reset position
        runOnJS(resetPosition)();
      }
    });

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <View style={styles.menuItemContainer}>
      <GestureDetector gesture={panGesture}>
        <TouchableOpacity 
          style={styles.menuItemWrapper} 
          activeOpacity={1}
          onPress={(e) => {
            e.stopPropagation();
            if (isSwipedLeft) {
              resetPosition();
            } else {
              onPress();
            }
          }}
        >
          <Animated.View style={[styles.menuItem, { backgroundColor: theme.cardBackground }, animatedStyle]}>
            <Ionicons 
              name={icon as any} 
              size={24} 
              color={isLogout ? theme.errorText : isTheme ? theme.selectedButton : theme.selectedButton} 
            />
            <Text style={[styles.menuItemText, { color: theme.text }]}>{title}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: "#888",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    padding: 20,
  },
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
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff9500',
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
