import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import CustomBottomBar from '../components/CustomBottomBar';
import {
  BackIcon,
  ChevronRight,
  StatsIconBig,
  EditIcon,
  ReminderIcon,
  FeedbackIcon,
  LogoutIcon,
} from '../components/profil/ProfileIcons';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  isLast,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && styles.menuItemLast]}
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <ChevronRight size={20} color={color.blue900} />
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    console.log('Logout Pressed');
    // navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PROFIL</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarContainer} />
            <Text style={styles.userName}>Abdefi</Text>
          </View>

          <TouchableOpacity
            style={styles.statsCard}
            onPress={() => navigation.navigate('Report')}
          >
            <View style={styles.statsLeft}>
              <StatsIconBig size={60} />
              <View style={styles.statsTextContainer}>
                <Text style={styles.statsTitle}>Statistics</Text>
                <Text style={styles.statsDesc}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color={color.blue900} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.menuGroup}>
            <MenuItem
              icon={<EditIcon color={color.blue900} />}
              label="Edit Profil"
              onPress={() => console.log('Edit Profil')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<ReminderIcon color={color.blue900} />}
              label="Reminders"
              onPress={() => console.log('Reminders')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={<FeedbackIcon color={color.blue900} />}
              label="Feedback"
              onPress={() => console.log('Feedback')}
              isLast
            />
          </View>

          {/* --- LOGOUT BUTTON --- */}
          <View style={[styles.menuGroup, { marginTop: 20 }]}>
            <MenuItem
              icon={<LogoutIcon color={color.blue900} />}
              label="Logout"
              onPress={handleLogout}
              isLast
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <CustomBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backArrow: {
    fontSize: 24,
    color: color.blue900,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: color.blue900,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
    marginBottom: 15,
  },
  userName: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    color: color.blue900,
  },
  // Statistics Card
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  statsTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  statsTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
    color: color.blue900,
    marginBottom: 4,
  },
  statsDesc: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    color: '#7B8085',
    lineHeight: 16,
  },
  // Menu Items
  sectionTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: color.blue900,
    marginBottom: 15,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  menuLabel: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: color.blue900,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
});

export default ProfileScreen;
