import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PriceInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  currency?: string;
}

export default function PriceInput({ 
  label, 
  value, 
  placeholder, 
  onChangeText, 
  currency = "USD" 
}: PriceInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} ({currency})</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.secondaryText}
        keyboardType="numeric"
      />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.cardBackground,
  },
});
