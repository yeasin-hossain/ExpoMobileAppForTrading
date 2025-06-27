import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TradeHeaderProps {
  title: string;
  icon?: string;
  onBack?: () => void;
}

export default function TradeHeader({ title, icon = "trending-up", onBack }: TradeHeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Ionicons name={icon as any} size={28} color={theme.selectedButton} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.headerBackground,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.cardBackground,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
});
