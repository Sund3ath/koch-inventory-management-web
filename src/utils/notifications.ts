interface NotificationData {
  type: 'assigned' | 'revoked' | 'expired';
  userId: string;
  licenseId: string;
}

export const sendLicenseNotification = async (data: NotificationData): Promise<void> => {
  try {
    // TODO: Implement email notification service
    console.log('Sending notification:', data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};