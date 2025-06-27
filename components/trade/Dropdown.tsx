import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  onSelect: (option: DropdownOption) => void;
  defaultSnapPoint?: number; // Index of the snap point to open at (0, 1, or 2)
}

export default function Dropdown({ 
  label, 
  value, 
  placeholder, 
  options, 
  onSelect,
  defaultSnapPoint = 1 // Default to '60%' (index 1)
}: DropdownProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const searchInputRef = useRef<TextInput>(null);
  
  const snapPoints = useMemo(() => ['40%', '60%', '80%', '95%'], []); // Added 40% as first option
  
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss(); // Dismiss any open keyboard first
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSearchQuery(''); // Clear search when sheet is closed
    }
  }, []);

  const handleOptionSelect = useCallback((option: DropdownOption) => {
    onSelect(option);
    setSearchQuery('');
    bottomSheetModalRef.current?.dismiss();
  }, [onSelect]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderOptionItem = useCallback(({ item: option }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        option.value === value && styles.selectedOption,
        option.style === 'buy' && styles.buyOption,
        option.style === 'sell' && styles.sellOption
      ]}
      onPress={() => handleOptionSelect(option)}
    >
      <Text style={[
        styles.optionText,
        option.value === value && styles.selectedOptionText,
        option.style === 'buy' && styles.buyText,
        option.style === 'sell' && styles.sellText
      ]}>
        {option.label}
      </Text>
      {option.value === value && (
        <Ionicons name="checkmark" size={20} color={theme.selectedButton} />
      )}
    </TouchableOpacity>
  ), [value, handleOptionSelect, theme, styles]);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>No options found</Text>
    </View>
  ), [styles]);

  const keyExtractor = useCallback((item: DropdownOption) => item.value, []);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={handlePresentModalPress}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={theme.text} 
        />
      </TouchableOpacity>
      
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={defaultSnapPoint}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.bottomSheetBackground]}
        handleIndicatorStyle={[styles.bottomSheetIndicator]}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label}</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.secondaryText} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search options..."
              placeholderTextColor={theme.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }} 
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color={theme.secondaryText} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={filteredOptions}
              renderItem={renderOptionItem}
              keyExtractor={keyExtractor}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContainer}
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={renderEmptyComponent}
              nestedScrollEnabled={true}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: theme.cardBackground,
  },
  bottomSheetIndicator: {
    backgroundColor: theme.border,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sheetHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Options List Styles
  listContainer: {
    flex: 1,
    minHeight: 200,
    maxHeight: '70%',
  },
  optionsList: {
    flex: 1,
  },
  optionsListContainer: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionText: {
    fontSize: 16,
    color: theme.text,
    flex: 1,
  },
  selectedOption: {
    backgroundColor: theme.selectedButton + '20',
  },
  selectedOptionText: {
    color: theme.selectedButton,
    fontWeight: '600',
  },
  // Buy/Sell Option Styles
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
  // No Results Styles
  noResults: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: theme.secondaryText,
    textAlign: 'center',
  },
});
