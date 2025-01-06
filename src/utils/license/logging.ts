import { LicenseOperation } from '../../types/license';

export const logLicenseOperation = async (operation: Omit<LicenseOperation, 'id' | 'timestamp'>): Promise<void> => {
  const logEntry: LicenseOperation = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...operation
  };

  try {
    // TODO: Implement logging to your preferred logging system
    console.log('License operation:', logEntry);
  } catch (error) {
    console.error('Error logging license operation:', error);
  }
};