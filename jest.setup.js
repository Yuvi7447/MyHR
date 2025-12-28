/**
 * Jest setup file - Mocks for third-party libraries
 * @jest-environment node
 */

/* eslint-env jest */

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  DownloadDirectoryPath: '/mock/downloads',
  MainBundlePath: '/mock/bundle',
  exists: jest.fn(() => Promise.resolve(false)),
  copyFile: jest.fn(() => Promise.resolve()),
  copyFileAssets: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
  mkdir: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-file-viewer
jest.mock('react-native-file-viewer', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  android: {
    actionViewIntent: jest.fn(() => Promise.resolve()),
  },
  fs: {
    dirs: {
      DocumentDir: '/mock/documents',
      DownloadDir: '/mock/downloads',
    },
  },
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

