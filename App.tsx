import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          // Roboto
          'Roboto-Black': require('./src/assets/fonts/Roboto-Black.ttf'),
          'Roboto-BlackItalic': require('./src/assets/fonts/Roboto-BlackItalic.ttf'),
          'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
          'Roboto-BoldItalic': require('./src/assets/fonts/Roboto-BoldItalic.ttf'),
          'Roboto-ExtraBold': require('./src/assets/fonts/Roboto-ExtraBold.ttf'),
          'Roboto-ExtraBoldItalic': require('./src/assets/fonts/Roboto-ExtraBoldItalic.ttf'),
          'Roboto-ExtraLight': require('./src/assets/fonts/Roboto-ExtraLight.ttf'),
          'Roboto-ExtraLightItalic': require('./src/assets/fonts/Roboto-ExtraLightItalic.ttf'),
          'Roboto-Italic': require('./src/assets/fonts/Roboto-Italic.ttf'),
          'Roboto-Light': require('./src/assets/fonts/Roboto-Light.ttf'),
          'Roboto-LightItalic': require('./src/assets/fonts/Roboto-LightItalic.ttf'),
          'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
          'Roboto-MediumItalic': require('./src/assets/fonts/Roboto-MediumItalic.ttf'),
          'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
          'Roboto-SemiBold': require('./src/assets/fonts/Roboto-SemiBold.ttf'),
          'Roboto-SemiBoldItalic': require('./src/assets/fonts/Roboto-SemiBoldItalic.ttf'),
          'Roboto-Thin': require('./src/assets/fonts/Roboto-Thin.ttf'),
          'Roboto-ThinItalic': require('./src/assets/fonts/Roboto-ThinItalic.ttf'),

          // Montserrat
          'Montserrat-Black': require('./src/assets/fonts/Montserrat-Black.ttf'),
          'Montserrat-BlackItalic': require('./src/assets/fonts/Montserrat-BlackItalic.ttf'),
          'Montserrat-Bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
          'Montserrat-BoldItalic': require('./src/assets/fonts/Montserrat-BoldItalic.ttf'),
          'Montserrat-ExtraBold': require('./src/assets/fonts/Montserrat-ExtraBold.ttf'),
          'Montserrat-ExtraBoldItalic': require('./src/assets/fonts/Montserrat-ExtraBoldItalic.ttf'),
          'Montserrat-ExtraLight': require('./src/assets/fonts/Montserrat-ExtraLight.ttf'),
          'Montserrat-ExtraLightItalic': require('./src/assets/fonts/Montserrat-ExtraLightItalic.ttf'),
          'Montserrat-Italic': require('./src/assets/fonts/Montserrat-Italic.ttf'),
          'Montserrat-Light': require('./src/assets/fonts/Montserrat-Light.ttf'),
          'Montserrat-LightItalic': require('./src/assets/fonts/Montserrat-LightItalic.ttf'),
          'Montserrat-Medium': require('./src/assets/fonts/Montserrat-Medium.ttf'),
          'Montserrat-MediumItalic': require('./src/assets/fonts/Montserrat-MediumItalic.ttf'),
          'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
          'Montserrat-SemiBoldItalic': require('./src/assets/fonts/Montserrat-SemiBoldItalic.ttf'),
          'Montserrat-Thin': require('./src/assets/fonts/Montserrat-Thin.ttf'),
          'Montserrat-ThinItalic': require('./src/assets/fonts/Montserrat-ThinItalic.ttf'),

          // Poppins
          'Poppins-Black': require('./src/assets/fonts/Poppins-Black.ttf'),
          'Poppins-BlackItalic': require('./src/assets/fonts/Poppins-BlackItalic.ttf'),
          'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
          'Poppins-BoldItalic': require('./src/assets/fonts/Poppins-BoldItalic.ttf'),
          'Poppins-ExtraBold': require('./src/assets/fonts/Poppins-ExtraBold.ttf'),
          'Poppins-ExtraBoldItalic': require('./src/assets/fonts/Poppins-ExtraBoldItalic.ttf'),
          'Poppins-ExtraLight': require('./src/assets/fonts/Poppins-ExtraLight.ttf'),
          'Poppins-ExtraLightItalic': require('./src/assets/fonts/Poppins-ExtraLightItalic.ttf'),
          'Poppins-Italic': require('./src/assets/fonts/Poppins-Italic.ttf'),
          'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
          'Poppins-LightItalic': require('./src/assets/fonts/Poppins-LightItalic.ttf'),
          'Poppins-Medium': require('./src/assets/fonts/Poppins-Medium.ttf'),
          'Poppins-MediumItalic': require('./src/assets/fonts/Poppins-MediumItalic.ttf'),
          'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
          'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-SemiBoldItalic': require('./src/assets/fonts/Poppins-SemiBoldItalic.ttf'),
          'Poppins-Thin': require('./src/assets/fonts/Poppins-Thin.ttf'),
          'Poppins-ThinItalic': require('./src/assets/fonts/Poppins-ThinItalic.ttf'),

          // Paprika
          'Paprika-Regular': require('./src/assets/fonts/Paprika-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
