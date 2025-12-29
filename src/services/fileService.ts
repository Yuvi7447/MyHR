/**
 * File Service - Handle PDF preview and download operations
 */

import {
  errorCodes,
  isErrorWithCode,
  viewDocument,
} from '@react-native-documents/viewer';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

import { Payslip } from '../types/payslip';

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Get download directory for saving files permanently
 */
function getDownloadDirectory(): string {
  if (Platform.OS === 'ios') {
    return RNFS.DocumentDirectoryPath;
  }

  const androidVersion = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);
  if (androidVersion >= 29) {
    return RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath;
  }

  // Android 9 and below: Can use public Downloads folder
  return RNFS.DownloadDirectoryPath;
}

/**
 * Get temporary directory for preview files
 */
function getAppDirectory(): string {
  return RNFS.DocumentDirectoryPath;
}

/**
 * Generate filename from payslip data
 */
function generateFileName(payslip: Payslip): string {
  return payslip.file.name;
}

/**
 * Handle errors from @react-native-documents/viewer
 */
function handleViewerError(err: unknown): string | null {
  if (isErrorWithCode(err)) {
    switch (err.code) {
      case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
        return 'Unable to open this file type. No compatible app found.';
      case errorCodes.NULL_PRESENTER:
        return 'Unable to present document viewer.';
      default:
        // Handle other codes like cancellation
        const errorStr = String(err.code).toLowerCase();
        if (errorStr.includes('cancel') || errorStr.includes('progress')) {
          return null;
        }
        return String(err);
    }
  }
  // Non-standard error - check for cancellation patterns
  const errorMessage = err instanceof Error ? err.message : String(err);
  if (
    errorMessage.toLowerCase().includes('cancel') ||
    errorMessage.toLowerCase().includes('dismiss')
  ) {
    return null; // User cancelled - ignore
  }
  return err instanceof Error ? err.message : 'Failed to open document';
}

/**
 * Request storage permission for Android 9 (API 28) and below
 */
async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version >= 29) {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'MyHR needs access to your storage to save payslip files.',
        buttonNeutral: 'Ask Later',
        buttonNegative: 'Deny',
        buttonPositive: 'Allow',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
}


/**
 * Copy bundled PDF from app bundle to accessible location
 */
async function copyAssetToReadableLocation(
  assetPath: string,
  destinationPath: string,
): Promise<void> {
  if (Platform.OS === 'android') {
    await RNFS.copyFileAssets(assetPath, destinationPath);
  } else {
    const possiblePaths = [
      `${RNFS.MainBundlePath}/${assetPath}`,
      `${RNFS.MainBundlePath}/Resources/${assetPath}`,
    ];

    let sourcePath: string | null = null;
    for (const path of possiblePaths) {
      if (await RNFS.exists(path)) {
        sourcePath = path;
        break;
      }
    }

    if (!sourcePath) {
      throw new Error(`PDF not found in bundle: ${assetPath}`);
    }

    await RNFS.copyFile(sourcePath, destinationPath);
  }
}

/**
 * Copies PDF from app bundle to Downloads/Documents folder
 */
export async function downloadPayslip(
  payslip: Payslip,
): Promise<DownloadResult> {
  try {
    // Request permission for Android 9 and below
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return {
        success: false,
        error: 'Storage permission denied. Please allow storage access in Settings.',
      };
    }

    const downloadDir = getDownloadDirectory();
    if (!downloadDir) {
      return {
        success: false,
        error: 'Unable to access download directory.',
      };
    }

    const fileName = generateFileName(payslip);
    const destinationPath = `${downloadDir}/${fileName}`;

    // Ensure directory exists
    try {
      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }
    } catch {
      // Directory might already exist or we don't have permission - continue anyway
    }

    // Replace existing file if present
    try {
      const exists = await RNFS.exists(destinationPath);
      if (exists) {
        await RNFS.unlink(destinationPath);
      }
    } catch {
      // File might not exist or we can't check - continue anyway
    }

    // Copy from bundle to storage
    await copyAssetToReadableLocation(payslip.file.assetPath, destinationPath);

    // Verify file was created
    const fileCreated = await RNFS.exists(destinationPath);
    if (!fileCreated) {
      return {
        success: false,
        error: 'Failed to save file. Please try again.',
      };
    }

    return {
      success: true,
      filePath: destinationPath,
    };
  } catch (error) {
    // Handle RNFS errors gracefully
    let errorMessage = 'Failed to download payslip';

    if (error instanceof Error) {
      // Check for common Android storage errors
      if (error.message.includes('Permission denied')) {
        errorMessage = 'Storage permission denied. Please check app permissions.';
      } else if (error.message.includes('No such file')) {
        errorMessage = 'Payslip file not found in app bundle.';
      } else if (error.message.includes('ENOSPC')) {
        errorMessage = 'Not enough storage space on device.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Copies PDF to temp location (if not already there)
 * Opens with platform-specific viewer using @react-native-documents/viewer
 */
export async function previewPayslip(payslip: Payslip): Promise<void> {
  const appDir = getAppDirectory();
  const fileName = `preview_${payslip.file.name}`;
  const tempPath = `${appDir}/${fileName}`;

  // Copy if not already cached
  const exists = await RNFS.exists(tempPath);
  if (!exists) {
    await copyAssetToReadableLocation(payslip.file.assetPath, tempPath);
  }

  try {
    await viewDocument({
      uri: `file://${tempPath}`,
      mimeType: 'application/pdf',
    });
  } catch (error) {
    const errorMessage = handleViewerError(error);
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }
}

/**
 * Opens a downloaded file using @react-native-documents/viewer
 */
export async function openFile(filePath: string): Promise<void> {
  try {
    await viewDocument({
      uri: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
      mimeType: 'application/pdf',
    });
  } catch (error) {
    const errorMessage = handleViewerError(error);
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }
}

/**
 * Check if a file exists at given path
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return RNFS.exists(filePath);
}

/**
 * Delete a file at given path
 */
export async function deleteFile(filePath: string): Promise<void> {
  const exists = await RNFS.exists(filePath);
  if (exists) {
    await RNFS.unlink(filePath);
  }
}
