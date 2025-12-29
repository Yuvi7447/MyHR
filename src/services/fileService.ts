/**
 * File Service - Handle PDF preview and download operations
 *
 * This service manages payslip PDF files:
 * 1. Copy bundled PDFs to accessible locations
 * 2. Preview PDFs using native viewers (Quick Look on iOS, Intent on Android)
 * 3. Download PDFs to device storage
 */

import { PermissionsAndroid, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
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
  return Platform.OS === 'ios' 
    ? RNFS.DocumentDirectoryPath 
    : RNFS.DownloadDirectoryPath;
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
 * Request storage permission for Android 9 (API 28) and below
 * Android 10+ uses scoped storage and doesn't need this permission for Downloads
 */
async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  // Android 10 (API 29) and above don't need storage permission for Downloads folder
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
 * Returns file path on success
 *
 * Note: Requests storage permission on Android 9 and below
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
    const fileName = generateFileName(payslip);
    const destinationPath = `${downloadDir}/${fileName}`;

    // Replace existing file if present
    const exists = await RNFS.exists(destinationPath);
    if (exists) {
      await RNFS.unlink(destinationPath);
    }

    // Copy from bundle to storage
    await copyAssetToReadableLocation(payslip.file.assetPath, destinationPath);

    return {
      success: true,
      filePath: destinationPath,
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to download payslip',
    };
  }
}

/**
 * Copies PDF to temp location (if not already there)
 * Opens with platform-specific viewer
 * 
 */
export async function previewPayslip(payslip: Payslip): Promise<void> {
  try {
    // Prepare temp file for preview
    const appDir = getAppDirectory();
    const fileName = `preview_${payslip.file.name}`;
    const tempPath = `${appDir}/${fileName}`;

    // Copy if not already cached
    const exists = await RNFS.exists(tempPath);
    if (!exists) {
      await copyAssetToReadableLocation(payslip.file.assetPath, tempPath);
    }

    if (Platform.OS === 'ios') {
      await FileViewer.open(tempPath, {
        displayName: payslip.file.name,
        showOpenWithDialog: false,
        showAppsSuggestions: false,
      });
    } else {
      await ReactNativeBlobUtil.android.actionViewIntent(
        tempPath,
        'application/pdf',
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage !== 'User did not share' && errorMessage !== 'User cancelled') {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to preview payslip',
      );
    }
  }
}

/**
* Opens a downloaded file
 */
export async function openFile(filePath: string): Promise<void> {
  try {
    await FileViewer.open(filePath, {
      showOpenWithDialog: false,
      showAppsSuggestions: true,
    });
  } catch (error) {
    console.error('Open file error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to open file',
    );
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
