import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface DropdownOption {
  label: string;
  value: string;
  style?: 'normal' | 'buy' | 'sell';
}

interface DropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: DropdownOption) => void;
}

export default function Dropdown({ 
  label, 
  value, 
  placeholder, 
  options, 
  isOpen, 
  onToggle, 
  onSelect 
}: DropdownProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={theme.text} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownItem,
                option.style === 'buy' && styles.buyOption,
                option.style === 'sell' && styles.sellOption
              ]}
              onPress={() => onSelect(option)}
            >
              <Text style={[
                styles.dropdownItemText,
                option.style === 'buy' && styles.buyText,
                option.style === 'sell' && styles.sellText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
});
