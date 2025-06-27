import { ActionSheetIOS, Alert, Platform } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'moonlight';

export const showThemeSelector = (setTheme: (theme: ThemeType) => void) => {
  const themeOptions = [
    { name: 'Light', value: 'light' as const },
    { name: 'Dark', value: 'dark' as const },
    { name: 'Moonlight', value: 'moonlight' as const },
  ];

  if (Platform.OS === 'ios') {
    const options = [...themeOptions.map(t => t.name), 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: 'Select Theme',
      },
      (buttonIndex) => {
        if (buttonIndex < themeOptions.length) {
          setTheme(themeOptions[buttonIndex].value);
        }
      }
    );
  } else {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        ...themeOptions.map(themeOption => ({
          text: themeOption.name,
          onPress: () => setTheme(themeOption.value),
        })),
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }
};
