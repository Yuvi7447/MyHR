/**
 * PayslipDetailsScreen - Detailed view of a single payslip (Figma design)
 */

import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';

import { Button, HeroCard, InfoSection } from '../components';
import { usePayslip } from '../hooks/usePayslips';
import { downloadPayslip, previewPayslip } from '../services/fileService';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../types/payslip';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'PayslipDetails'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PayslipDetails'
>;

export function PayslipDetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { payslipId } = route.params;

  const payslip = usePayslip(payslipId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Set header title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Payslip Details',
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const handleDownload = useCallback(async () => {
    if (!payslip) return;

    setIsDownloading(true);
    try {
      const result = await downloadPayslip(payslip);

      if (result.success) {
        Alert.alert(
          'Download Successful',
          `Payslip saved to:\n${result.filePath}`,
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert('Download Failed', result.error || 'Unknown error occurred', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Download Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }],
      );
    } finally {
      setIsDownloading(false);
    }
  }, [payslip]);

  const handlePreview = useCallback(async () => {
    if (!payslip) return;

    setIsPreviewing(true);
    try {
      await previewPayslip(payslip);
    } catch (error) {
      Alert.alert(
        'Preview Failed',
        error instanceof Error ? error.message : 'Unable to preview payslip',
        [{ text: 'OK' }],
      );
    } finally {
      setIsPreviewing(false);
    }
  }, [payslip]);

  if (!payslip) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const monthYear = moment(payslip.fromDate).format('MMMM YYYY');
  const formattedNetPay = `$${payslip.netPay.toLocaleString()}`;
  const formattedGrossPay = `$${payslip.grossPay.toLocaleString()}`;
  const formattedDeductions = `-$${payslip.deductions.toLocaleString()}`;
  const startDate = moment(payslip.fromDate).format('MMMM D, YYYY');
  const endDate = moment(payslip.toDate).format('MMMM D, YYYY');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Card */}
        <HeroCard
          title="Payment period"
          subtitle={monthYear}
          amount={formattedNetPay}
          style={styles.heroCard}
        />

        {/* Payment Details */}
        <InfoSection
          title="Payment details"
          rows={[
            { label: 'Payslip ID', value: payslip.id },
            { label: 'Start date', value: startDate },
            { label: 'End date', value: endDate },
            { label: 'File type', value: 'PDF', valueColor: colors.primary },
          ]}
        />

        {/* Employee Information */}
        <InfoSection
          title="Employee information"
          rows={[
            { label: 'Name', value: payslip.employee.name },
            { label: 'Department', value: payslip.employee.department },
          ]}
        />

        {/* Earnings Breakdown */}
        <InfoSection
          title="Earnings breakdown"
          rows={[
            { label: 'Gross pay', value: formattedGrossPay },
            { label: 'Deductions', value: formattedDeductions, valueColor: colors.error },
            { label: 'Net pay', value: formattedNetPay, valueColor: colors.success, isHighlighted: true },
          ]}
        />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Preview"
          variant="secondary"
          onPress={handlePreview}
          loading={isPreviewing}
          style={styles.previewButton}
          accessibilityHint="Double tap to open and preview this payslip"
        />
        <Button
          title="Download"
          variant="primary"
          onPress={handleDownload}
          loading={isDownloading}
          style={styles.downloadButton}
          accessibilityHint="Double tap to download this payslip to your device"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  heroCard: {
    marginTop: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  previewButton: {
    flex: 1,
  },
  downloadButton: {
    flex: 1,
  },
});
