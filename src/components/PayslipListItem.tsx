/**
 * PayslipListItem - Displays a single payslip in the list (Figma design)
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
import moment from 'moment';

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
  const monthYear = moment(payslip.fromDate).format('MMMM YYYY');
  const formattedNetPay = `$${payslip.netPay.toLocaleString()}`;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      onPress={() => onPress(payslip)}
      accessibilityRole="button"
      accessibilityLabel={`Payslip for ${monthYear}, net pay ${formattedNetPay}`}
      accessibilityHint="Double tap to view payslip details">
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📄</Text>
        </View>

        <View style={styles.textContainer}>
          {/* Header: Month Year + Chevron */}
          <View style={styles.header}>
            <Text style={styles.monthYear} numberOfLines={1}>
              {monthYear}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          {/* Date Range */}
          <Text style={styles.dateRange} numberOfLines={1}>
            {dateRange}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      {/* Footer: Net Pay + ID */}
      <View style={styles.footer}>
        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>ID</Text>
          <Text style={styles.idValue}>{payslip.id}</Text>
        </View>
        <View style={styles.netPayContainer}>
          <Text style={styles.netPayLabel}>Net pay</Text>
          <Text style={styles.netPayValue}>{formattedNetPay}</Text>
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
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  monthYear: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 24,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
  },
  dateRange: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  netPayContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
  },
  netPayLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  netPayValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  idContainer: {
    alignItems: 'flex-start',
  },
  idLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  idValue: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});

export const PayslipListItem = memo(PayslipListItemComponent);

