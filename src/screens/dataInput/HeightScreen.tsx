import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import PrimaryButton from '../../components/PrimaryButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Height'>;

const HeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const [height, setHeight] = useState('');
  const { gender, age } = route.params;

  const handleContinue = () => {
    navigation.navigate('Weight', {
      gender: gender,
      age: age,
      height: parseInt(height, 10) || 0,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>HOW TALL ARE YOU?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="0"
                placeholderTextColor={colors.blue950}
                keyboardType="number-pad"
                maxLength={3}
                underlineColorAndroid="transparent"
                cursorColor={colors.primary}
              />
              <Text style={styles.unit}>CM</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                Calculate Your Body Mass Index (BMI)
              </Text>
              <Text style={styles.infoText}>
                BMI assesses body weight relative to height but doesn't
                differentiate between fat and muscle...
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label="CONTINUE"
              onPress={handleContinue}
              disabled={!height}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 100,
    color: colors.blue950,
    textAlign: 'center',
  },
  unit: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    color: colors.black,
    backgroundColor: colors.bg_input || '#E1F2FD',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: -15,
  },
  infoBox: {
    marginTop: 40,
    backgroundColor: colors.blue50,
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  infoTitle: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    color: colors.blue950,
    marginBottom: 5,
  },
  infoText: {
    fontFamily: FONT_FAMILY.PoppinsRegular,
    fontSize: FONT_SIZE.sm,
    color: colors.grey,
  },
});

export default HeightScreen;
