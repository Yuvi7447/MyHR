/**
 * PayslipListScreen - Main list of all payslips
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterBar, PayslipListItem, SortPicker } from '../components';
import { usePayslips } from '../hooks/usePayslips';
import { colors, spacing, typography } from '../theme';
import { Payslip, RootStackParamList } from '../types/payslip';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PayslipList'
>;

export function PayslipListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const {
    payslips,
    availableYears,
    sortOrder,
    setSortOrder,
    filterYear,
    setFilterYear,
    searchQuery,
    setSearchQuery,
  } = usePayslips();

  const handlePayslipPress = useCallback(
    (payslip: Payslip) => {
      navigation.navigate('PayslipDetails', { payslipId: payslip.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Payslip }) => (
      <PayslipListItem payslip={item} onPress={handlePayslipPress} />
    ),
    [handlePayslipPress],
  );

  const keyExtractor = useCallback((item: Payslip) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>No Payslips Found</Text>
        <Text style={styles.emptyMessage}>
          {searchQuery || filterYear !== 'all'
            ? 'Try adjusting your filters'
            : 'Your payslips will appear here'}
        </Text>
      </View>
    ),
    [searchQuery, filterYear],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with filters - outside FlatList to prevent keyboard dismissal */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>My Payslips</Text>
          <SortPicker value={sortOrder} onValueChange={setSortOrder} />
        </View>

        <FilterBar
          availableYears={availableYears}
          selectedYear={filterYear}
          onYearChange={setFilterYear}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Text style={styles.resultCount}>
          {payslips.length} {payslips.length === 1 ? 'payslip' : 'payslips'}
        </Text>
      </View>

      <FlatList
        data={payslips}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          payslips.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  resultCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

