import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ProductListScreen from '../screens/ProductListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, role } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        role === 'superuser' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        ) : (
          <Stack.Screen name="ProductList" component={ProductListScreen} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}