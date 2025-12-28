/**
 * InfoSection - White card section for displaying key-value pairs
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { borderRadius, colors, shadows, spacing, typography } from '../theme';

interface InfoRow {
  label: string;
  value: string;
  valueColor?: string;
  isHighlighted?: boolean;
}

interface InfoSectionProps {
  title: string;
  rows: InfoRow[];
  style?: ViewStyle;
}

function InfoSectionComponent({ title, rows, style }: InfoSectionProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      
      {rows.map((row, index) => (
        <View
          key={index}
          style={[
            styles.row,
            row.isHighlighted && styles.rowHighlighted,
            index === rows.length - 1 && styles.rowLast,
          ]}>
          <Text style={styles.label}>{row.label}</Text>
          <Text
            style={[
              styles.value,
              row.valueColor && { color: row.valueColor },
              row.isHighlighted && styles.valueHighlighted,
            ]}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowHighlighted: {
    backgroundColor: colors.successLight,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: 'right',
  },
  valueHighlighted: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
});

export const InfoSection = memo(InfoSectionComponent);

