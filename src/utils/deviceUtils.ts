import type { DeviceUploadData, ProcessedDeviceData } from '../types/upload';

export async function processDeviceData(data: DeviceUploadData[]): Promise<ProcessedDeviceData[]> {
  const processedDevices: ProcessedDeviceData[] = [];

  for (const row of data) {
    // Extract brand and model from combined field (e.g., "ThinkPad E14 Gen 5")
    const [brand, ...modelParts] = row['Marke/Modell'].split(' ', 1);
    const model = row['Marke/Modell'].substring(brand.length + 1);

    // Map device type
    const type = mapDeviceType(row['Peripherie-Typ']);

    processedDevices.push({
      type,
      brand: brand || '',
      model: model || '',
      serial_number: row.Serialnumber,
      device_domain_id: row.ComputerNR,
      status: 'available',
      notes: 'Imported from Excel'
    });
  }

  return processedDevices;
}

function mapDeviceType(type: string): ProcessedDeviceData['type'] {
  const typeMap: Record<string, ProcessedDeviceData['type']> = {
    'laptop': 'laptop',
    'phone': 'phone',
    'tablet': 'tablet',
    'monitor': 'monitor',
    'workstation': 'workstation',
    'Laptop': 'laptop',
    'Phone': 'phone',
    'Tablet': 'tablet',
    'Monitor': 'monitor',
    'Workstation': 'workstation'
  };

  return typeMap[type.toLowerCase()] || 'other';
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateDeviceData(data: DeviceUploadData[]): ValidationResult {
  const errors: string[] = [];

  data.forEach((row, index) => {
    // Check required fields
    if (!row['Peripherie-Typ']) {
      errors.push(`Row ${index + 1}: Missing device type`);
    }
    if (!row['Marke/Modell']) {
      errors.push(`Row ${index + 1}: Missing brand/model`);
    }
    if (!row.Serialnumber) {
      errors.push(`Row ${index + 1}: Missing serial number`);
    }

    // Validate device type
    if (!isValidDeviceType(row['Peripherie-Typ'])) {
      errors.push(`Row ${index + 1}: Invalid device type "${row['Peripherie-Typ']}"`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidDeviceType(type: string): boolean {
  const validTypes = ['laptop', 'phone', 'tablet', 'monitor', 'workstation'];
  return validTypes.includes(type.toLowerCase());
}