import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FeatureCard, { FeatureData } from './FeatureCard';

interface FeatureGridProps {
  features: FeatureData[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  featuresContainer: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
