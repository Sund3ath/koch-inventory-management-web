import { MicrosoftLicenseType } from '../../types/license';
import { validateLicenseAssignment } from './validation';
import { logLicenseOperation } from './logging';

interface AssignLicenseResult {
  success: boolean;
  message: string;
  errors?: string[];
}

export const assignLicense = async (
  targetId: string,
  targetType: 'user' | 'group',
  licenseType: MicrosoftLicenseType,
  quantity: number = 1
): Promise<AssignLicenseResult> => {
  try {
    // Validate the license assignment
    const validation = await validateLicenseAssignment(
      licenseType,
      targetId,
      targetType,
      quantity
    );

    if (!validation.isValid) {
      await logLicenseOperation({
        operationType: 'assign',
        licenseType,
        targetId,
        targetType,
        status: 'failed',
        errorMessage: validation.errors.join(', ')
      });

      return {
        success: false,
        message: 'License validation failed',
        errors: validation.errors
      };
    }

    // TODO: Implement Microsoft Graph API call to assign license
    
    await logLicenseOperation({
      operationType: 'assign',
      licenseType,
      targetId,
      targetType,
      status: 'success'
    });

    return {
      success: true,
      message: 'License assigned successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    await logLicenseOperation({
      operationType: 'assign',
      licenseType,
      targetId,
      targetType,
      status: 'failed',
      errorMessage
    });

    return {
      success: false,
      message: 'Failed to assign license',
      errors: [errorMessage]
    };
  }
};