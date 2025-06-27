import { Router } from 'expo-router';
import { Alert } from 'react-native';

export const showDeleteConfirmation = (
  itemTitle: string,
  onConfirm: () => void
) => {
  Alert.alert(
    "Delete Item",
    `Are you sure you want to delete ${itemTitle}?`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onConfirm
      }
    ]
  );
};

export const showLogoutConfirmation = (router: Router) => {
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
          router.replace('/login');
        }
      }
    ]
  );
};

export const showMenuItemAlert = (title: string) => {
  Alert.alert(title, `${title} pressed`);
};
