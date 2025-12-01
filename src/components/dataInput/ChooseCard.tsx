import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';

type Props = {
  label: string;
  imageSource: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
};

const ChooseCard: React.FC<Props> = ({
  label,
  imageSource,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        (isSelected || pressed) && styles.cardActive,
      ]}
    >
      <Image source={imageSource} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 15,
    backgroundColor: colors.blue100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  cardActive: {
    borderWidth: 3,
    borderColor: colors.blue700,
  },
  image: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default ChooseCard;
