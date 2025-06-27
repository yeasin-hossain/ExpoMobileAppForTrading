import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InfoCardProps {
  text: string;
  icon?: string;
}

export default function InfoCard({ text, icon = "information-circle" }: InfoCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon as any} size={24} color={theme.selectedButton} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: theme.secondaryText,
    lineHeight: 20,
  },
});
