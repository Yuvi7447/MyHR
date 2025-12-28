/**
 * PayslipDetailsScreen - View payslip details and download
 */

import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FileTypeIndicator } from '../components';
import { usePayslip } from '../hooks/usePayslips';
import { downloadPayslip, openFile, previewPayslip } from '../services/fileService';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '../theme';
import { RootStackParamList } from '../types/payslip';
import { formatDateFull, formatDateRange } from '../utils/dateFormatter';

type DetailsRouteProp = RouteProp<RootStackParamList, 'PayslipDetails'>;

export function PayslipDetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { payslipId } = route.params;

  const payslip = usePayslip(payslipId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!payslip) return;

    setIsDownloading(true);

    try {
      const result = await downloadPayslip(payslip);

      if (result.success && result.filePath) {
        Alert.alert(
          'Download Complete',
          `Payslip saved to:\n${result.filePath}`,
          [
            { text: 'OK' },
            {
              text: 'Open',
              onPress: () => openFile(result.filePath!),
            },
          ],
        );
      } else {
        Alert.alert(
          'Download Failed',
          result.error || 'An unknown error occurred',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      Alert.alert(
        'Download Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred',
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
        error instanceof Error ? error.message : 'Failed to open payslip',
        [{ text: 'OK' }],
      );
    } finally {
      setIsPreviewing(false);
    }
  }, [payslip]);

  if (!payslip) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Payslip Not Found</Text>
        <Text style={styles.errorMessage}>
          The requested payslip could not be found.
        </Text>
      </View>
    );
  }

  const dateRange = formatDateRange(payslip.fromDate, payslip.toDate);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}>
      {/* File Type Card */}
      <View style={styles.fileCard}>
        <FileTypeIndicator
          fileType={payslip.file.type}
          fileName={payslip.file.name}
          size="large"
        />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Payslip Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID</Text>
          <Text style={styles.detailValue}>{payslip.id}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Period</Text>
          <Text style={styles.detailValue}>{dateRange}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From</Text>
          <Text style={styles.detailValue}>
            {formatDateFull(payslip.fromDate)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To</Text>
          <Text style={styles.detailValue}>
            {formatDateFull(payslip.toDate)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>File Type</Text>
          <Text style={styles.detailValue}>
            {payslip.file.type.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
      <Button
          title="Preview"
          variant="secondary"
          onPress={handlePreview}
          loading={isPreviewing}
          accessibilityHint="Double tap to open and preview this payslip"
        />
        <Button
          title="Download"
          variant="primary"
          onPress={handleDownload}
          loading={isDownloading}
          accessibilityHint="Double tap to download this payslip to your device"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  actionsContainer: {
    gap: spacing.md,
  },
});

