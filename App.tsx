/**
 * MyHR Payslips App
 * React Native application for managing and viewing payslips
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PayslipsProvider } from './src/context/PayslipsContext';
import { RootNavigator } from './src/navigation';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <PayslipsProvider>
        <RootNavigator />
      </PayslipsProvider>
    </SafeAreaProvider>
  );
}

export default App;
