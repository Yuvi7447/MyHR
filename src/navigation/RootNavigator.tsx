/**
 * RootNavigator - Main navigation stack
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { PayslipDetailsScreen, PayslipListScreen } from '../screens';
import { colors, typography } from '../theme';
import { RootStackParamList } from '../types/payslip';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PayslipList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: typography.weights.semibold,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          name="PayslipList"
          component={PayslipListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PayslipDetails"
          component={PayslipDetailsScreen}
          options={{
            title: 'Payslip Details',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

