import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import ProfileInput from '../components/profil/ProfileInput';
import {
  BackIcon,
  EditPencilIcon,
  CheckIcon,
} from '../components/profil/ProfileIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { userService } from '../services/api';
import { UpdateUserRequest, Gender } from '../types/api';

const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // --- STATE DATA ---
  const [name, setName] = useState('Abdefi');
  const [email, setEmail] = useState('abdefijkmnorsv@gmail.com');
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState('19');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('50.0');
  const [goal, setGoal] = useState('Maintain weight');
  const [newsletter, setNewsletter] = useState('Yes');
  const [healthConditions, setHealthConditions] = useState<string[]>([]);

  // --- MODAL STATE ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'gender' | 'goal' | 'health' | null
  >(null);

  const OPTIONS = {
    gender: ['Male', 'Female'],
    goal: ['Gain weight', 'Lose weight', 'Maintain weight'],
    healthList: ['Hypertension', 'Diabetes'],
  };

  const openSelector = (type: 'gender' | 'goal' | 'health') => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelect = (item: string) => {
    if (modalType === 'gender') setGender(item);
    if (modalType === 'goal') setGoal(item);
    setModalVisible(false);
  };

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => {
      if (prev.includes(condition)) return prev.filter(c => c !== condition);
      return [...prev, condition];
    });
  };

  const getHealthDisplayText = () => {
    if (healthConditions.length === 0) return 'No problems';
    return healthConditions.join(' & ');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map gender to API format
      const genderMap: Record<string, Gender> = {
        Male: 'MALE',
        Female: 'FEMALE',
      };

      const updateData: UpdateUserRequest = {
        name,
        email,
        gender: genderMap[gender] || 'OTHER',
        age: age,
        height: height,
        weight: weight,
      };

      console.log('Updating profile:', updateData);
      await userService.updateProfile(updateData);

      Alert.alert('Success', 'Profile updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const message =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard unsaved changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Deleted'),
        },
      ],
    );
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AVATAR SECTION */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{name.charAt(0)}</Text>
              </View>
              <TouchableOpacity style={styles.editIconBadge}>
                <EditPencilIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            <ProfileInput label="Name" value={name} onChangeText={setName} />
            <View style={styles.divider} />

            <ProfileInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Gender"
              value={gender}
              editable={false}
              onPress={() => openSelector('gender')}
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Age"
              value={age}
              onChangeText={t => setAge(t.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Height"
              value={`${height} cm`}
              onChangeText={t => setHeight(t.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Weight"
              value={`${weight} kg`}
              onChangeText={t => setWeight(t.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Goal"
              value={goal}
              editable={false}
              onPress={() => openSelector('goal')}
            />
            <View style={styles.divider} />

            <ProfileInput
              label="Health Condition"
              value={getHealthDisplayText()}
              editable={false}
              onPress={() => openSelector('health')}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteButtonContainer}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* FLOATING BOTTOM BAR (DISCARD & SAVE) */}
      <View
        style={[
          styles.bottomActionContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 30 },
        ]}
      >
        <TouchableOpacity style={styles.btnDiscard} onPress={handleDiscard}>
          <Text style={styles.btnDiscardText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Text style={styles.btnSaveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'health'
                ? 'Select Health Conditions'
                : `Select ${modalType}`}
            </Text>

            {modalType !== 'health' ? (
              <FlatList
                data={modalType ? OPTIONS[modalType as 'gender' | 'goal'] : []}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View>
                {OPTIONS.healthList.map(item => {
                  const isSelected = healthConditions.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={styles.modalItemRow}
                      onPress={() => toggleHealthCondition(item)}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {item}
                      </Text>
                      {isSelected && <CheckIcon />}
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F7FA',
  },
  headerBtn: { padding: 5 },
  headerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: color.blue900,
  },

  scrollContent: { paddingBottom: 40 },

  // Avatar
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8D6E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F7FA',
    elevation: 3,
  },
  changePhotoText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: color.blue900,
    textDecorationLine: 'underline',
  },

  // Form
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: '#F0F0F0' },

  // Delete Account
  deleteButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#FF3B30',
    textDecorationLine: 'underline',
  },

  // Bottom Action Bar
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 20,
  },
  btnDiscard: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.primary,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  btnDiscardText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: color.primary,
  },
  btnSave: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  btnSaveText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: '#FFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: color.blue900,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: color.blue900,
    fontFamily: FONT_FAMILY.MontserratBold,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: color.blue900,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
  },
});

export default ProfileEditScreen;
