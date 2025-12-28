/**
 * FilterBar - Year filter and search input for payslips
 */

import React, { memo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { FilterYear } from '../types/payslip';

interface FilterBarProps {
  availableYears: number[];
  selectedYear: FilterYear;
  onYearChange: (year: FilterYear) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  style?: ViewStyle;
}

function FilterBarComponent({
  availableYears,
  selectedYear,
  onYearChange,
  searchQuery,
  onSearchChange,
  style,
}: FilterBarProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by month, year, company, or ID..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Search payslips"
          accessibilityHint="Search by month name, year, company name, employee ID, or payslip ID"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => onSearchChange('')}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search">
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Year Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}>
        <Pressable
          style={[styles.chip, selectedYear === 'all' && styles.chipSelected]}
          onPress={() => onYearChange('all')}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedYear === 'all' }}>
          <Text
            style={[
              styles.chipText,
              selectedYear === 'all' && styles.chipTextSelected,
            ]}>
            All
          </Text>
        </Pressable>

        {availableYears.map((year) => (
          <Pressable
            key={year}
            style={[styles.chip, selectedYear === year && styles.chipSelected]}
            onPress={() => onYearChange(year)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedYear === year }}>
            <Text
              style={[
                styles.chipText,
                selectedYear === year && styles.chipTextSelected,
              ]}>
              {year}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  chipsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  chipTextSelected: {
    color: colors.textInverse,
  },
});

export const FilterBar = memo(FilterBarComponent);

