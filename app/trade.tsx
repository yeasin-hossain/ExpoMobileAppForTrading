import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export default function TradePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState('');
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const symbols = [
    { label: 'Bitcoin (BTC)', value: 'BTC' },
    { label: 'Ethereum (ETH)', value: 'ETH' },
    { label: 'Binance Coin (BNB)', value: 'BNB' },
    { label: 'Cardano (ADA)', value: 'ADA' },
    { label: 'Solana (SOL)', value: 'SOL' },
    { label: 'Polygon (MATIC)', value: 'MATIC' },
  ];

  const tradeTypes = [
    { label: 'Buy', value: 'buy' },
    { label: 'Sell', value: 'sell' },
  ];

  const handleSymbolSelect = (symbol: { label: string; value: string }) => {
    setSelectedSymbol(symbol.value);
    setShowSymbolDropdown(false);
  };

  const handleTypeSelect = (type: { label: string; value: string }) => {
    setTradeType(type.value);
    setShowTypeDropdown(false);
  };

  const handleSubmit = () => {
    if (selectedSymbol && price && tradeType) {
      const tradeData = {
        symbol: selectedSymbol,
        price,
        type: tradeType
      };
      
      console.log('Trade submitted:', tradeData);
      
      // Show success alert
      Alert.alert(
        'Trade Submitted',
        `${tradeType === 'buy' ? 'Buy' : 'Sell'} order for ${selectedSymbol} at $${price} has been submitted successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedSymbol('');
              setPrice('');
              setTradeType('');
              // Navigate back
              router.back();
            }
          }
        ]
      );
    }
  };

  const handleCancel = () => {
    // Reset form
    setSelectedSymbol('');
    setPrice('');
    setTradeType('');
    router.back();
  };

  const isFormValid = selectedSymbol && price && tradeType;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Ionicons name="trending-up" size={28} color={theme.selectedButton} />
          <Text style={styles.title}>Trade Cryptocurrency</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={theme.selectedButton} />
            <Text style={styles.infoText}>
              Select your cryptocurrency, choose buy or sell, and enter your desired price to place a trade order.
            </Text>
          </View>

          {/* Symbol Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Cryptocurrency</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => {
                setShowSymbolDropdown(!showSymbolDropdown);
                setShowTypeDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, !selectedSymbol && styles.placeholderText]}>
                {selectedSymbol ? symbols.find(s => s.value === selectedSymbol)?.label : 'Choose a cryptocurrency'}
              </Text>
              <Ionicons 
                name={showSymbolDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.text} 
              />
            </TouchableOpacity>
            
            {showSymbolDropdown && (
              <View style={styles.dropdownList}>
                {symbols.map((symbol) => (
                  <TouchableOpacity
                    key={symbol.value}
                    style={styles.dropdownItem}
                    onPress={() => handleSymbolSelect(symbol)}
                  >
                    <Text style={styles.dropdownItemText}>{symbol.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Trade Type Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trade Type</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowSymbolDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, !tradeType && styles.placeholderText]}>
                {tradeType ? tradeTypes.find(t => t.value === tradeType)?.label : 'Select trade type'}
              </Text>
              <Ionicons 
                name={showTypeDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.text} 
              />
            </TouchableOpacity>
            
            {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {tradeTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.dropdownItem,
                      type.value === 'buy' && styles.buyOption,
                      type.value === 'sell' && styles.sellOption
                    ]}
                    onPress={() => handleTypeSelect(type)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      type.value === 'buy' && styles.buyText,
                      type.value === 'sell' && styles.sellText
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (USD)</Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price (e.g., 45000)"
              placeholderTextColor={theme.secondaryText}
              keyboardType="numeric"
            />
          </View>

          {/* Summary Card */}
          {isFormValid && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cryptocurrency:</Text>
                <Text style={styles.summaryValue}>
                  {symbols.find(s => s.value === selectedSymbol)?.label}
                </Text>
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
                <Text style={styles.summaryValue}>${price}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, !isFormValid && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={[styles.submitButtonText, !isFormValid && styles.disabledButtonText]}>
                {tradeType === 'buy' ? 'Place Buy Order' : tradeType === 'sell' ? 'Place Sell Order' : 'Submit Trade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
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
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: theme.cardBackground,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
  },
  placeholderText: {
    color: theme.secondaryText,
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    backgroundColor: theme.cardBackground,
    maxHeight: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.text,
  },
  buyOption: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  sellOption: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  buyText: {
    color: '#34c759',
    fontWeight: '600',
  },
  sellText: {
    color: '#ff3b30',
    fontWeight: '600',
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
