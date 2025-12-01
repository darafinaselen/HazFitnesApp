import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';

// --- COLORS ---
const ACTIVE_COLOR = '#1697D4';
const INACTIVE_COLOR = '#BDE4FA';

// --- ICONS (SVG) ---
// Props color agar warnanya bisa berubah dinamis
const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 19V10C4 9.68333 4.071 9.38333 4.213 9.1C4.355 8.81667 4.55067 8.58333 4.8 8.4L10.8 3.9C11.15 3.63333 11.55 3.5 12 3.5C12.45 3.5 12.85 3.63333 13.2 3.9L19.2 8.4C19.45 8.58333 19.646 8.81667 19.788 9.1C19.93 9.38333 20.0007 9.68333 20 10V19C20 19.55 19.804 20.021 19.412 20.413C19.02 20.805 18.5493 21.0007 18 21H15C14.7167 21 14.4793 20.904 14.288 20.712C14.0967 20.52 14.0007 20.2827 14 20V15C14 14.7167 13.904 14.4793 13.712 14.288C13.52 14.0967 13.2827 14.0007 13 14H11C10.7167 14 10.4793 14.096 10.288 14.288C10.0967 14.48 10.0007 14.7173 10 15V20C10 20.2833 9.904 20.521 9.712 20.713C9.52 20.905 9.28267 21.0007 9 21H6C5.45 21 4.97933 20.8043 4.588 20.413C4.19667 20.0217 4.00067 19.5507 4 19Z"
      fill={color}
    />
  </Svg>
);

const ProgramIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.975 9.02508L14.925 2.97508L15.35 2.55008C15.7334 2.16675 16.2084 1.97941 16.775 1.98808C17.3417 1.99675 17.8167 2.19241 18.2 2.57508L21.425 5.80008C21.8084 6.18341 22 6.65441 22 7.21308C22 7.77175 21.8084 8.24241 21.425 8.62508L20.975 9.02508ZM8.65002 21.4001C8.26669 21.7834 7.79602 21.9751 7.23802 21.9751C6.68002 21.9751 6.20902 21.7834 5.82502 21.4001L2.60002 18.1751C2.21669 17.7917 2.02502 17.3211 2.02502 16.7631C2.02502 16.2051 2.21669 15.7341 2.60002 15.3501L3.00002 14.9501L9.05002 21.0001L8.65002 21.4001ZM12.275 20.7001C12.075 20.9001 11.8417 21.0001 11.575 21.0001C11.3084 21.0001 11.075 20.9001 10.875 20.7001L3.30002 13.1251C3.10002 12.9251 3.00002 12.6917 3.00002 12.4251C3.00002 12.1584 3.10002 11.9251 3.30002 11.7251L4.72502 10.2751C4.92502 10.0751 5.16269 9.97508 5.43802 9.97508C5.71336 9.97508 5.95069 10.0751 6.15002 10.2751L7.72502 11.8501L11.875 7.70008L10.3 6.12508C10.1 5.92508 10 5.69175 10 5.42508C10 5.15841 10.1 4.92508 10.3 4.72508L11.725 3.27508C11.925 3.07508 12.1627 2.97508 12.438 2.97508C12.7134 2.97508 12.9507 3.07508 13.15 3.27508L20.725 10.8501C20.925 11.0501 21.025 11.2877 21.025 11.5631C21.025 11.8384 20.925 12.0757 20.725 12.2751L19.275 13.7001C19.075 13.9001 18.8417 14.0001 18.575 14.0001C18.3084 14.0001 18.075 13.9001 17.875 13.7001L16.3 12.1251L12.15 16.2751L13.725 17.8501C13.925 18.0501 14.025 18.2874 14.025 18.5621C14.025 18.8367 13.925 19.0744 13.725 19.2751L12.275 20.7001Z"
      fill={color}
    />
  </Svg>
);

const ReportIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="21" viewBox="0 0 20 21" fill="none">
    <Path
      d="M5 3H3C2.46957 3 1.96086 3.21071 1.58579 3.58579C1.21071 3.96086 1 4.46957 1 5V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H8.697M15 12V16H19M15 9V5C15 4.46957 14.7893 3.96086 14.4142 3.58579C14.0391 3.21071 13.5304 3 13 3H11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 9H9M5 13H8M5 3C5 2.46957 5.21071 1.96086 5.58579 1.58579C5.96086 1.21071 6.46957 1 7 1H9C9.53043 1 10.0391 1.21071 10.4142 1.58579C10.7893 1.96086 11 2.46957 11 3C11 3.53043 10.7893 4.03914 10.4142 4.41421C10.0391 4.78929 9.53043 5 9 5H7C6.46957 5 5.96086 4.78929 5.58579 4.41421C5.21071 4.03914 5 3.53043 5 3ZM11 16C11 17.0609 11.4214 18.0783 12.1716 18.8284C12.9217 19.5786 13.9391 20 15 20C16.0609 20 17.0783 19.5786 17.8284 18.8284C18.5786 18.0783 19 17.0609 19 16C19 14.9391 18.5786 13.9217 17.8284 13.1716C17.0783 12.4214 16.0609 12 15 12C13.9391 12 12.9217 12.4214 12.1716 13.1716C11.4214 13.9217 11 14.9391 11 16Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
      fill={color}
    />
  </Svg>
);

const { width } = Dimensions.get('window');

const CustomBottomBar = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  // Helper untuk cek halaman aktif
  const isActive = (screenName: string) => route.name === screenName;

  // Helper untuk navigasi (untuk menghindari navigasi ke halaman yang sama)
  const navigateTo = (screenName: string) => {
    if (route.name !== screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. HOME */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Home')}
      >
        <HomeIcon color={isActive('Home') ? ACTIVE_COLOR : INACTIVE_COLOR} />
        <Text
          style={[
            styles.navText,
            { color: isActive('Home') ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
        >
          HOME
        </Text>
      </TouchableOpacity>

      {/* 2. PROGRAM */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Program')}
      >
        <ProgramIcon
          color={isActive('Program') ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text
          style={[
            styles.navText,
            { color: isActive('Program') ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
        >
          PROGRAM
        </Text>
      </TouchableOpacity>

      {/* 3. REPORT */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Report')}
      >
        <ReportIcon
          color={isActive('Report') ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text
          style={[
            styles.navText,
            { color: isActive('Report') ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
        >
          REPORT
        </Text>
      </TouchableOpacity>

      {/* 4. PROFIL */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('Profil')}
      >
        <ProfileIcon
          color={isActive('Profil') ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text
          style={[
            styles.navText,
            { color: isActive('Profil') ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
        >
          PROFIL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});

export default CustomBottomBar;
