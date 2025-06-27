import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface FeatureData {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  isHighlighted?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

interface FeatureCardProps {
  feature: FeatureData;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      style={[
        styles.featureCard,
        feature.isHighlighted && styles.highlightCard
      ]}
      onPress={feature.onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={feature.icon as any} 
        size={32} 
        color={feature.isHighlighted ? "#fff" : theme.selectedButton}
        style={styles.featureIcon}
      />
      <Text style={[
        styles.featureTitle,
        feature.isHighlighted && styles.highlightTitle
      ]}>
        {feature.title}
      </Text>
      <Text style={[
        styles.featureDescription,
        feature.isHighlighted && styles.highlightDescription
      ]}>
        {feature.description}
      </Text>
      {feature.showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{feature.badgeText || 'NEW'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  featureCard: {
    width: "48%",
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  highlightCard: {
    backgroundColor: theme.selectedButton,
    borderColor: theme.selectedButton,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.text,
  },
  highlightTitle: {
    color: theme.selectedButtonText,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.secondaryText,
    textAlign: "center",
  },
  highlightDescription: {
    color: theme.selectedButtonText,
    opacity: 0.8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
