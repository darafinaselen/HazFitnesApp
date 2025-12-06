import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={color.blue900}
    />
  </Svg>
);

type HeightInputRouteProp = RouteProp<RootStackParamList, 'HeightInput'>;

const HeightInputScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<HeightInputRouteProp>();

  // Ambil data tinggi saat ini dari params (kalau ada), kalau gak ada default '0'
  const initialHeight = route.params?.currentHeight || '';
  const [height, setHeight] = useState(initialHeight);

  const handleDiscard = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    console.log('New Height Saved:', height);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HEIGHT</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* --- INPUT AREA --- */}
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={color.blue900}
            maxLength={3}
            autoFocus={true} // Otomatis muncul keyboard pas masuk
            textAlign="center"
          />

          {/* Badge CM */}
          <View style={styles.unitBadge}>
            <Text style={styles.unitText}>CM</Text>
          </View>
        </View>

        {/* --- BUTTONS --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscard}
          >
            <Text style={styles.discardText}>DISCARD</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backIcon: {
    fontSize: 24,
    color: color.blue900,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
    color: color.blue900,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Sedikit ke atas biar pas di tengah visual
  },
  input: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 80, // Ukuran font besar seperti di desain
    color: color.blue900,
    width: '100%',
    textAlign: 'center',
    padding: 0,
    marginBottom: 10,
  },
  unitBadge: {
    backgroundColor: '#81C3D7', // Warna biru muda ala tombol di gambar
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  unitText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40, // Jarak dari bottom bar
    gap: 20,
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#81C3D7', // Warna biru muda
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  discardText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1E88E5', // Warna biru tua (sesuaikan dengan color.blue900 kamu)
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default HeightInputScreen;
