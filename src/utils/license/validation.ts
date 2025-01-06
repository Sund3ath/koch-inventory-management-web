import { licenseSchema, MicrosoftLicenseType } from '../../types/license';
import { checkDependencies, checkConflicts } from './dependencies';
import { getLicenseAvailability, getUserLicenses } from './graphApi';
import { logLicenseOperation } from './logging';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateLicenseAssignment = async (
  licenseType: MicrosoftLicenseType,
  targetId: string,
  targetType: 'user' | 'group',
  quantity: number
): Promise<ValidationResult> => {
  const errors: string[] = [];

  try {
    // Validate input schema
    const validationResult = licenseSchema.safeParse({
      licenseType,
      quantity,
      targetId,
      targetType
    });

    if (!validationResult.success) {
      return {
        isValid: false,
        errors: validationResult.error.errors.map(e => e.message)
      };
    }

    // Check license availability
    const availability = await getLicenseAvailability(licenseType);
    if (!availability.success || availability.available < quantity) {
      errors.push(`Insufficient licenses available. Required: ${quantity}, Available: ${availability.available}`);
    }

    // Get user's current licenses
    const currentLicenses = await getUserLicenses(targetId);
    
    // Check dependencies
    if (!checkDependencies(licenseType, currentLicenses)) {
      errors.push(`Missing required prerequisite licenses for ${licenseType}`);
    }

    // Check conflicts
    if (!checkConflicts(licenseType, currentLicenses)) {
      errors.push(`License conflicts detected with existing assignments`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    await logLicenseOperation({
      operationType: 'assign',
      licenseType,
      targetId,
      targetType,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      isValid: false,
      errors: ['An unexpected error occurred during license validation']
    };
  }
};