/**
 * HeroCard - Purple gradient card for payslip details hero section
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';

interface HeroCardProps {
  title: string;
  subtitle: string;
  amount: string;
  style?: ViewStyle;
}

function HeroCardComponent({ title, subtitle, amount, style }: HeroCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.gradient}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📄</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.title}>{subtitle}</Text>
          
          <Text style={styles.amountLabel}>Net pay</Text>
          <Text style={styles.amount}>{amount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  gradient: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: 160,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    marginBottom: spacing.lg,
  },
  amountLabel: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
});

export const HeroCard = memo(HeroCardComponent);

