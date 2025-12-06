import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { CloseIcon } from './PlayerIcons';
import { FONT_FAMILY } from '../../constants/fonts';

interface QuitWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  onQuit: (reason: string) => void;
}

const QuitWorkoutModal: React.FC<QuitWorkoutModalProps> = ({
  visible,
  onClose,
  onQuit,
}) => {
  const handleFeedback = () => {
    Linking.openURL(
      'mailto:support@hazlabfitness.com?subject=Workout Feedback',
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* Header: Close Icon */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Why Give Up?</Text>
          <Text style={styles.subtitle}>
            This helps us to get to know you better and provide exercises that
            are suitable for you
          </Text>

          {/* Option Buttons */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onQuit('Just Browsing')}
            >
              <Text style={styles.optionText}>JUST BROWSING</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onQuit('Too Difficult')}
            >
              <Text style={styles.optionText}>TOO DIFFICULT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onQuit("Don't Know How")}
            >
              <Text style={styles.optionText}>DON'T KNOW HOW TO DO IT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onQuit('Too Easy')}
            >
              <Text style={styles.optionText}>TOO EASY</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback Link */}
          <TouchableOpacity onPress={handleFeedback}>
            <Text style={styles.feedbackText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: 340,
    // height: 596,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0A659A',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  title: {
    color: '#0B2D46',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  subtitle: {
    color: '#8495A2',
    textAlign: 'justify',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '500',
    width: 284,
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  optionButton: {
    width: 284,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#0A659A',
  },
  optionText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  feedbackText: {
    color: '#0B2D46',
    textDecorationLine: 'underline',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default QuitWorkoutModal;
