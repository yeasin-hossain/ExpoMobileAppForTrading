import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface OrderSummaryProps {
  cryptocurrency: string;
  tradeType: 'buy' | 'sell';
  price: string;
  currency?: string;
}

export default function OrderSummary({ 
  cryptocurrency, 
  tradeType, 
  price, 
  currency = "USD" 
}: OrderSummaryProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Cryptocurrency:</Text>
        <Text style={styles.summaryValue}>{cryptocurrency}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Type:</Text>
        <Text style={[
          styles.summaryValue,
          tradeType === 'buy' ? styles.buyText : styles.sellText
        ]}>
          {tradeType === 'buy' ? 'Buy' : 'Sell'}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Price:</Text>
        <Text style={styles.summaryValue}>${price} {currency}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  summaryCard: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.secondaryText,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  buyText: {
    color: '#34c759',
    fontWeight: '600',
  },
  sellText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
});
