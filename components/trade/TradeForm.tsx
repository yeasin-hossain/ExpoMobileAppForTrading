import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Dropdown, { DropdownOption } from './Dropdown';
import OrderSummary from './OrderSummary';
import PriceInput from './PriceInput';
import TradeActions from './TradeActions';

export interface TradeFormData {
  symbol: string;
  price: string;
  type: 'buy' | 'sell' | '';
}

interface TradeFormProps {
  onSubmit: (data: TradeFormData) => void;
  onCancel: () => void;
  symbolOptions: DropdownOption[];
  tradeTypeOptions: DropdownOption[];
}

export default function TradeForm({ 
  onSubmit, 
  onCancel, 
  symbolOptions, 
  tradeTypeOptions 
}: TradeFormProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | ''>('');
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleSymbolSelect = (option: DropdownOption) => {
    setSelectedSymbol(option.value);
    setShowSymbolDropdown(false);
  };

  const handleTypeSelect = (option: DropdownOption) => {
    setTradeType(option.value as 'buy' | 'sell');
    setShowTypeDropdown(false);
  };

  const handleSymbolToggle = () => {
    setShowSymbolDropdown(!showSymbolDropdown);
    setShowTypeDropdown(false);
  };

  const handleTypeToggle = () => {
    setShowTypeDropdown(!showTypeDropdown);
    setShowSymbolDropdown(false);
  };

  const handleSubmit = () => {
    if (selectedSymbol && price && tradeType) {
      onSubmit({
        symbol: selectedSymbol,
        price,
        type: tradeType
      });
    }
  };

  const handleCancel = () => {
    // Reset form
    setSelectedSymbol('');
    setPrice('');
    setTradeType('');
    onCancel();
  };

  const isFormValid = !!(selectedSymbol && price && tradeType);
  const selectedSymbolLabel = symbolOptions.find(s => s.value === selectedSymbol)?.label || '';

  return (
    <View style={styles.container}>
      <Dropdown
        label="Select Cryptocurrency"
        value={selectedSymbol}
        placeholder="Choose a cryptocurrency"
        options={symbolOptions}
        isOpen={showSymbolDropdown}
        onToggle={handleSymbolToggle}
        onSelect={handleSymbolSelect}
      />

      <Dropdown
        label="Trade Type"
        value={tradeType}
        placeholder="Select trade type"
        options={tradeTypeOptions}
        isOpen={showTypeDropdown}
        onToggle={handleTypeToggle}
        onSelect={handleTypeSelect}
      />

      <PriceInput
        label="Price"
        value={price}
        placeholder="Enter price (e.g., 45000)"
        onChangeText={setPrice}
      />

      {isFormValid && (
        <OrderSummary
          cryptocurrency={selectedSymbolLabel}
          tradeType={tradeType}
          price={price}
        />
      )}

      <TradeActions
        tradeType={tradeType}
        isFormValid={isFormValid}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
});
