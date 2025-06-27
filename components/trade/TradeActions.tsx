import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TradeActionsProps {
  tradeType: 'buy' | 'sell' | '';
  isFormValid: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function TradeActions({ 
  tradeType, 
  isFormValid, 
  onCancel, 
  onSubmit 
}: TradeActionsProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getSubmitButtonText = () => {
    if (tradeType === 'buy') return 'Place Buy Order';
    if (tradeType === 'sell') return 'Place Sell Order';
    return 'Submit Trade';
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.submitButton, !isFormValid && styles.disabledButton]}
        onPress={onSubmit}
        disabled={!isFormValid}
      >
        <Text style={[styles.submitButtonText, !isFormValid && styles.disabledButtonText]}>
          {getSubmitButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.selectedButton,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.selectedButtonText,
  },
  disabledButton: {
    backgroundColor: theme.border,
  },
  disabledButtonText: {
    color: theme.secondaryText,
  },
});
