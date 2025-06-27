import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TradeBottomSheetProps {
  onClose: () => void;
  onSubmit: (data: { symbol: string; price: string; type: string }) => void;
  onChange?: (index: number) => void;
}

const TradeBottomSheet = forwardRef<BottomSheet, TradeBottomSheetProps>(
  ({ onClose, onSubmit, onChange }, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    
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
        onSubmit({
          symbol: selectedSymbol,
          price,
          type: tradeType
        });
        // Reset form
        setSelectedSymbol('');
        setPrice('');
        setTradeType('');
        onClose();
      }
    };

    const handleCancel = () => {
      // Reset form
      setSelectedSymbol('');
      setPrice('');
      setTradeType('');
      onClose();
    };

    const isFormValid = selectedSymbol && price && tradeType;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={onChange}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="trending-up" size={28} color={theme.selectedButton} />
              <Text style={styles.title}>Quick Trade</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Symbol Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Cryptocurrency</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowSymbolDropdown(!showSymbolDropdown)}
              >
                <Text style={[styles.dropdownText, !selectedSymbol && styles.placeholder]}>
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
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text style={[styles.dropdownText, !tradeType && styles.placeholder]}>
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
                placeholder="Enter price"
                placeholderTextColor={theme.secondaryText}
                keyboardType="numeric"
              />
            </View>

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
                  {tradeType === 'buy' ? 'Buy' : tradeType === 'sell' ? 'Sell' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const createStyles = (theme: any) => StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: theme.border,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.background,
  },
  formContainer: {
    flex: 1,
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
    backgroundColor: theme.background,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
  },
  placeholder: {
    color: theme.secondaryText,
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    backgroundColor: theme.background,
    maxHeight: 200,
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
    backgroundColor: theme.background,
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
    backgroundColor: theme.background,
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

TradeBottomSheet.displayName = 'TradeBottomSheet';

export default TradeBottomSheet;
