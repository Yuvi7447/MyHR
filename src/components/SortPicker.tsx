/**
 * SortPicker - Dropdown/modal for selecting sort order
 */

import React, { memo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import { SortOrder } from '../types/payslip';

interface SortPickerProps {
  value: SortOrder;
  onValueChange: (order: SortOrder) => void;
  style?: ViewStyle;
}

interface SortOption {
  value: SortOrder;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest first', icon: '↓' },
  { value: 'oldest', label: 'Oldest first', icon: '↑' },
];

function SortPickerComponent({ value, onValueChange, style }: SortPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  const handleSelect = (order: SortOrder) => {
    onValueChange(order);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.trigger, style]}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${selectedOption?.label}`}
        accessibilityHint="Double tap to change sort order">
        <Text style={styles.triggerIcon}>{selectedOption?.icon}</Text>
        <Text style={styles.triggerText}>{selectedOption?.label}</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>

            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionItem,
                  value === option.value && styles.optionItemSelected,
                ]}
                onPress={() => handleSelect(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: value === option.value }}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    value === option.value && styles.optionLabelSelected,
                  ]}>
                  {option.label}
                </Text>
                {value === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    ...shadows.sm,
  },
  triggerIcon: {
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
    color: colors.primary,
  },
  triggerText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  optionItemSelected: {
    backgroundColor: colors.primaryLight + '10',
  },
  optionIcon: {
    fontSize: typography.sizes.lg,
    marginRight: spacing.md,
    color: colors.primary,
  },
  optionLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  optionLabelSelected: {
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  checkmark: {
    fontSize: typography.sizes.lg,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});

export const SortPicker = memo(SortPickerComponent);

