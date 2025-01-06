import { MicrosoftLicenseType } from '../../types/license';

// Define license dependencies
const licenseDependencies: Record<MicrosoftLicenseType, MicrosoftLicenseType[]> = {
  'AAD_PREMIUM_P2': ['AAD_PREMIUM_P1'],
  'AAD_PREMIUM_P1': [],
  'O365_BUSINESS_PREMIUM': ['O365_BUSINESS_ESSENTIALS'],
  'O365_BUSINESS_ESSENTIALS': [],
  'M365_BUSINESS_PREMIUM': ['M365_BUSINESS_STANDARD'],
  'M365_BUSINESS_STANDARD': [],
  'M365_E5': ['M365_E3'],
  'M365_E3': []
};

// Define license conflicts
const licenseConflicts: Record<MicrosoftLicenseType, MicrosoftLicenseType[]> = {
  'M365_E5': ['M365_BUSINESS_PREMIUM', 'O365_BUSINESS_PREMIUM'],
  'M365_E3': ['M365_BUSINESS_PREMIUM', 'O365_BUSINESS_PREMIUM'],
  'M365_BUSINESS_PREMIUM': ['M365_E5', 'M365_E3'],
  'O365_BUSINESS_PREMIUM': ['M365_E5', 'M365_E3'],
  'AAD_PREMIUM_P2': ['AAD_PREMIUM_P1'],
  'AAD_PREMIUM_P1': [],
  'M365_BUSINESS_STANDARD': [],
  'O365_BUSINESS_ESSENTIALS': []
};

export const checkDependencies = (licenseType: MicrosoftLicenseType, assignedLicenses: MicrosoftLicenseType[]): boolean => {
  const required = licenseDependencies[licenseType];
  return required.every(dep => assignedLicenses.includes(dep));
};

export const checkConflicts = (licenseType: MicrosoftLicenseType, assignedLicenses: MicrosoftLicenseType[]): boolean => {
  const conflicts = licenseConflicts[licenseType];
  return !conflicts.some(conflict => assignedLicenses.includes(conflict));
};