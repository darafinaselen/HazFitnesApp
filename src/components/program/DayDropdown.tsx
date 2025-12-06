import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONT_FAMILY } from '../../constants/fonts';
import { ProgramDay } from '../../types/programTypes';

interface DayDropdownProps {
  currentProgram: ProgramDay;
  programData: ProgramDay[];
  isOpen: boolean;
  selectedDayIndex: number;
  onToggle: () => void;
  onSelectDay: (index: number) => void;
}

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <Svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
  >
    <Path d="M15 18.75L8.75 12.5H21.25L15 18.75Z" fill="white" />
  </Svg>
);

const DayDropdown: React.FC<DayDropdownProps> = ({
  currentProgram,
  programData,
  isOpen,
  selectedDayIndex,
  onToggle,
  onSelectDay,
}) => {
  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={[styles.dropdownHeader, isOpen && styles.dropdownHeaderOpen]}
        activeOpacity={0.9}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.dropdownTitle}>{currentProgram.dayTitle}</Text>
          <Text style={styles.dropdownSubtitle}>{currentProgram.subtitle}</Text>
        </View>
        <ChevronDownIcon isOpen={isOpen} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownListContainer}>
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
            {programData.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dropdownItem,
                  index === selectedDayIndex && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  onSelectDay(index);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    index === selectedDayIndex && styles.dropdownItemTextActive,
                  ]}
                >
                  {item.dayTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Dropdown ---
  dropdownWrapper: {
    marginBottom: 30,
    // backgroundColor: 'transparent',
    zIndex: 100,
    position: 'relative',
  },
  dropdownHeader: {
    backgroundColor: '#10486A',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    zIndex: 101,
  },
  dropdownHeaderOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownTitle: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dropdownSubtitle: {
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.RobotoMedium,
    fontSize: 12,
    textAlign: 'center',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#F0F8FF',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#10486A',
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemActive: {
    backgroundColor: '#D0EBFC',
  },
  dropdownItemText: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 14,
    color: '#10486A',
    textAlign: 'center',
  },
  dropdownItemTextActive: {
    fontFamily: FONT_FAMILY.PoppinsBold,
  },
});

export default DayDropdown;
