import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface VideoLoadingIndicatorProps {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export const VideoLoadingIndicator: React.FC<VideoLoadingIndicatorProps> = ({
  isLoading = false,
  isError = false,
  errorMessage = 'Video failed to load',
  onRetry,
}) => {
  if (!isLoading && !isError) {
    return null;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {onRetry && (
            <View style={styles.retryButtonContainer}>
              <Text style={styles.retryButton} onPress={onRetry}>
                Retry
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={styles.loadingText}>Loading video...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorContainer: {
    backgroundColor: '#2C2C2C',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  retryButtonContainer: {
    marginTop: 10,
  },
  retryButton: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 15,
    fontFamily: 'Roboto',
  },
});
