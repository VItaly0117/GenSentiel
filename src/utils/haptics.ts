import * as Haptics from 'expo-haptics';
import { getSetting } from '../db/repositories/equipment';

function isEnabled(): boolean {
  return getSetting('haptics_enabled') !== '0';
}

export const haptics = {
  impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
    if (isEnabled()) Haptics.impactAsync(style);
  },
  notification(type: Haptics.NotificationFeedbackType) {
    if (isEnabled()) Haptics.notificationAsync(type);
  },
};
