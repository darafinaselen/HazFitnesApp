import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import { premiumService } from '../services/api';
import { PremiumApp } from '../types/api';

interface PremiumGateProps {
  /**
   * The premium app type to check (FOOD, EXERCISE, EMOTION)
   */
  app: PremiumApp;

  /**
   * Children to render when user has premium access
   */
  children: React.ReactNode;

  /**
   * Optional fallback component when user doesn't have premium
   * If not provided, a default upgrade prompt will be shown
   */
  fallback?: React.ReactNode;

  /**
   * Optional callback when user taps the upgrade button
   */
  onUpgradePress?: () => void;

  /**
   * Whether to show the gate inline or as a modal overlay
   * Default: 'inline'
   */
  mode?: 'inline' | 'modal';
}

interface PremiumBannerProps {
  app: PremiumApp;
  onUpgradePress?: () => void;
}

/**
 * Default Premium Upgrade Banner
 */
const PremiumBanner: React.FC<PremiumBannerProps> = ({
  app,
  onUpgradePress,
}) => {
  const appLabel =
    app === 'EXERCISE' ? 'Exercise' : app === 'FOOD' ? 'Food' : 'Emotion';

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.crownIcon}>
        <Text style={styles.crownEmoji}>👑</Text>
      </View>
      <Text style={styles.bannerTitle}>Premium Feature</Text>
      <Text style={styles.bannerSubtitle}>
        Upgrade to Premium to unlock full {appLabel} reports and advanced
        analytics
      </Text>
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={onUpgradePress}
        activeOpacity={0.8}
      >
        <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
      </TouchableOpacity>
      <Text style={styles.contactText}>
        Contact support for more information
      </Text>
    </View>
  );
};

/**
 * PremiumGate Component
 *
 * Wraps content that requires premium subscription.
 * Automatically checks if user has premium access and shows
 * appropriate content or upgrade prompt.
 *
 * @example
 * ```tsx
 * <PremiumGate app="EXERCISE">
 *   <CompleteReportView />
 * </PremiumGate>
 * ```
 */
const PremiumGate: React.FC<PremiumGateProps> = ({
  app,
  children,
  fallback,
  onUpgradePress,
  mode = 'inline',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPremiumStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await premiumService.checkStatus(app);

      if (response.success && response.data) {
        setIsPremium(response.data.isPremium);
      } else {
        setIsPremium(false);
      }
    } catch (err: any) {
      console.error('[PremiumGate] Error checking premium status:', err);
      // On error, default to showing premium content (fail-open for better UX)
      // In production, you might want to fail-closed instead
      if (err.response?.status === 403) {
        setIsPremium(false);
      } else {
        // Network error - assume premium for better UX
        setIsPremium(true);
        setError('Could not verify premium status');
      }
    } finally {
      setIsLoading(false);
    }
  }, [app]);

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

  const handleUpgradePress = () => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      // Default behavior - could navigate to subscription screen
      console.log('[PremiumGate] Upgrade pressed for app:', app);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={color.primary} />
        <Text style={styles.loadingText}>Checking access...</Text>
      </View>
    );
  }

  // User has premium - show children
  if (isPremium) {
    return <>{children}</>;
  }

  // User doesn't have premium
  const upgradeContent = fallback || (
    <PremiumBanner app={app} onUpgradePress={handleUpgradePress} />
  );

  if (mode === 'modal') {
    return (
      <Modal visible={!isPremium} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>{upgradeContent}</View>
        </View>
      </Modal>
    );
  }

  return <>{upgradeContent}</>;
};

/**
 * Hook for checking premium status
 * Use this when you need programmatic access to premium status
 */
export const usePremiumStatus = (app: PremiumApp) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await premiumService.checkStatus(app);

      if (response.success && response.data) {
        setIsPremium(response.data.isPremium);
        setExpiresAt(response.data.expiresAt || null);
      }
    } catch (err) {
      console.error('[usePremiumStatus] Error:', err);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, [app]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    isLoading,
    isPremium,
    expiresAt,
    refresh: checkStatus,
  };
};

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    color: '#7B8085',
  },

  // Banner
  bannerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  crownIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  crownEmoji: {
    fontSize: 28,
  },
  bannerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    color: color.blue900,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontFamily: FONT_FAMILY.MontserratRegular,
    fontSize: 14,
    color: '#7B8085',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  upgradeButton: {
    backgroundColor: color.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
    color: '#FFF',
  },
  contactText: {
    fontFamily: FONT_FAMILY.MontserratRegular,
    fontSize: 12,
    color: '#A0A0A0',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 350,
  },
});

export default PremiumGate;
