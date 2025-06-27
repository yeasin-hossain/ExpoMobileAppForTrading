import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    email: string;
    joinDate: string;
  };
}

export default function ProfileHeader({ profileData }: ProfileHeaderProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={60} color={theme.selectedButtonText} />
      </View>
      <Text style={styles.name}>{profileData.name}</Text>
      <Text style={styles.email}>{profileData.email}</Text>
      <Text style={styles.joinDate}>Joined {profileData.joinDate}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: theme.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.headerBorder,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.selectedButton,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: theme.secondaryText,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: theme.secondaryText,
  },
});
