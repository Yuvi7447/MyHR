/**
 * FileTypeIndicator - Shows PDF or Image icon with file type badge
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';

interface FileTypeIndicatorProps {
  fileType: 'pdf' | 'image';
  fileName?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const FILE_TYPE_CONFIG = {
  pdf: {
    icon: '📄',
    label: 'PDF',
    color: colors.error,
    backgroundColor: colors.errorLight,
  },
  image: {
    icon: '🖼️',
    label: 'Image',
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
};

const SIZE_CONFIG = {
  small: {
    iconSize: 32,
    iconFontSize: 16,
    badgeFontSize: 10,
  },
  medium: {
    iconSize: 64,
    iconFontSize: 28,
    badgeFontSize: 12,
  },
  large: {
    iconSize: 96,
    iconFontSize: 42,
    badgeFontSize: 14,
  },
};

function FileTypeIndicatorComponent({
  fileType,
  fileName,
  size = 'medium',
  style,
}: FileTypeIndicatorProps) {
  const typeConfig = FILE_TYPE_CONFIG[fileType];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
            backgroundColor: typeConfig.backgroundColor,
          },
        ]}>
        <Text style={{ fontSize: sizeConfig.iconFontSize }}>
          {typeConfig.icon}
        </Text>
      </View>

      <View
        style={[styles.badge, { backgroundColor: typeConfig.backgroundColor }]}>
        <Text
          style={[
            styles.badgeText,
            { fontSize: sizeConfig.badgeFontSize, color: typeConfig.color },
          ]}>
          {typeConfig.label}
        </Text>
      </View>

      {fileName && (
        <Text style={styles.fileName} numberOfLines={1}>
          {fileName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  fileName: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    maxWidth: 200,
    textAlign: 'center',
  },
});

export const FileTypeIndicator = memo(FileTypeIndicatorComponent);

