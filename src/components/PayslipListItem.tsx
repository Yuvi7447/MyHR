/**
 * PayslipListItem - Displays a single payslip in the list
 */

import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { colors, borderRadius, shadows, spacing, typography } from '../theme';
import { Payslip } from '../types/payslip';
import { formatDateRange } from '../utils/dateFormatter';

interface PayslipListItemProps {
  payslip: Payslip;
  onPress: (payslip: Payslip) => void;
  style?: ViewStyle;
}

function PayslipListItemComponent({
  payslip,
  onPress,
  style,
}: PayslipListItemProps) {
  const dateRange = formatDateRange(payslip.fromDate, payslip.toDate);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      onPress={() => onPress(payslip)}
      accessibilityRole="button"
      accessibilityLabel={`Payslip for ${dateRange}`}
      accessibilityHint="Double tap to view payslip details">
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {payslip.file.type.toUpperCase() === 'PDF' ? '📄' : '🖼️'}
          </Text>
        </View>

        <View style={styles.textContainer}>
        <Text style={styles.fileName} numberOfLines={2}>
            {payslip.file.name}
          </Text>
          <Text style={styles.dateRange} numberOfLines={1}>
            {dateRange}
          </Text>
        </View>

        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateRange: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fileName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  payslipId: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 24,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
});

export const PayslipListItem = memo(PayslipListItemComponent);

