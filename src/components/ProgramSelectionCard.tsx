import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { FONT_FAMILY } from '../constants/fonts';

// --- Props yang diterima komponen ini ---
interface ProgramSelectionCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
}

// --- Komponen Radio Button (Internal) ---
const RadioButton = ({ selected }: { selected: boolean }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {selected ? (
      // Active: Lingkaran Luar Tebal + Titik Dalam
      <>
        <Circle cx="12" cy="12" r="10" stroke="#0A659A" strokeWidth="2" />
        <Circle cx="12" cy="12" r="5" fill="#0A659A" />
      </>
    ) : (
      // Inactive: Lingkaran Luar Tipis
      <Circle cx="12" cy="12" r="10" stroke="#0A659A" strokeWidth="2" />
    )}
  </Svg>
);

const ProgramSelectionCard: React.FC<ProgramSelectionCardProps> = ({
  title,
  description,
  image,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.cardContainer,
        isSelected && styles.cardActive, // Terapkan border tebal jika aktif
      ]}
    >
      {/* Gambar di Kiri (Absolute) */}
      <Image source={image} style={styles.cardImage} resizeMode="cover" />

      {/* Konten Teks */}
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          {/* Radio Button ditaruh sejajar judul biar rapi */}
          <RadioButton selected={isSelected} />
        </View>

        <Text style={styles.cardDescription} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    height: 127,
    backgroundColor: '#F1F9FE', // Background Biru Sangat Muda
    borderRadius: 15,

    // Default Border (Transparan agar layout tidak loncat saat dipilih)
    borderWidth: 5,
    borderColor: 'transparent',

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    overflow: 'hidden', // Supaya gambar mengikuti radius
    position: 'relative',
  },
  cardActive: {
    borderColor: '#0A659A', // Border Biru Tebal saat aktif
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 133, // Sesuai design
    height: '100%',
    // Karena container overflow hidden, radius ini otomatis ikut container
  },
  cardContent: {
    flex: 1,
    marginLeft: 133, // Geser konten supaya tidak menumpuk gambar (width gambar)
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    color: '#0B2D46',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 12, // Sesuai design
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardDescription: {
    color: '#0B2D46',
    fontFamily: 'Roboto', // Pastikan font Roboto ada atau pakai default
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },
});

export default ProgramSelectionCard;
