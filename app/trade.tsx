import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DropdownOption } from '../components/trade/Dropdown';
import InfoCard from '../components/trade/InfoCard';
import TradeForm, { TradeFormData } from '../components/trade/TradeForm';
import TradeHeader from '../components/trade/TradeHeader';
import { useTheme } from '../contexts/ThemeContext';

export default function TradePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const symbolOptions: DropdownOption[] = [
    { label: 'Bitcoin (BTC)', value: 'BTC' },
    { label: 'Ethereum (ETH)', value: 'ETH' },
    { label: 'Binance Coin (BNB)', value: 'BNB' },
    { label: 'Cardano (ADA)', value: 'ADA' },
    { label: 'Solana (SOL)', value: 'SOL' },
    { label: 'Polygon (MATIC)', value: 'MATIC' },
  ];

  const tradeTypeOptions: DropdownOption[] = [
    { label: 'Buy', value: 'buy', style: 'buy' },
    { label: 'Sell', value: 'sell', style: 'sell' },
  ];

  const handleTradeSubmit = (data: TradeFormData) => {
    console.log('Trade submitted:', data);
    
    // Show success alert
    Alert.alert(
      'Trade Submitted',
      `${data.type === 'buy' ? 'Buy' : 'Sell'} order for ${data.symbol} at $${data.price} has been submitted successfully!`,
      [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TradeHeader title="Trade Cryptocurrency" />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <InfoCard text="Select your cryptocurrency, choose buy or sell, and enter your desired price to place a trade order." />
        
        <TradeForm
          onSubmit={handleTradeSubmit}
          onCancel={handleCancel}
          symbolOptions={symbolOptions}
          tradeTypeOptions={tradeTypeOptions}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
});
