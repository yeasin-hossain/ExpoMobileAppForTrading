import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ExploreHeaderProps {
  title: string;
  subtitle: string;
  showTestButton?: boolean;
  onTestButtonPress?: () => void;
}

export default function ExploreHeader({ 
  title, 
  subtitle, 
  showTestButton = false, 
  onTestButtonPress 
}: ExploreHeaderProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {showTestButton && onTestButtonPress && (
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={onTestButtonPress}
        >
          <Text style={styles.testButtonText}>Test Gallery</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.headerBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryText,
  },
  testButton: {
    marginTop: 15,
    backgroundColor: theme.selectedButton,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  testButtonText: {
    color: theme.selectedButtonText,
    fontWeight: '600',
    fontSize: 16,
  },
});
