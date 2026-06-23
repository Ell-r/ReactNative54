import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {router, Stack} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import {Provider} from "react-redux";
import {useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {loginSuccess} from "@/store/reducers/AuthSlice";
import { store } from "@/store";
import {useAppDispatch} from "@/hooks/redux";

export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {
  const colorScheme = useColorScheme();

    const [storageReady, setStorageReady] = useState(false);

    useEffect(() => {
        initStore().then(() => {
            setStorageReady(true)
        });
    }, []);

    async function initStore(): Promise<void> {
        const accessToken  = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
            store.dispatch(loginSuccess(accessToken));
        }
    }

    if (!storageReady) {
        return null;
    }

  return (
      <Provider store={store}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                  <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                  <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                  <Stack.Screen name="profile/edit" options={{headerShown: false}}/>
                  <Stack.Screen name="modal" options={{presentation: 'modal', title: 'Modal'}}/>
              </Stack>
              <StatusBar style="auto"/>
          </ThemeProvider>
      </Provider>
  );
}
