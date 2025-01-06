export interface DeviceUploadData {
  'Nachname': string;
  'Vorname': string;
  'Full Name': string;
  'Activ': number;
  'Department': string;
  'Peripherie-Typ': string;
  'ComputerNR': string;
  'Marke/Modell': string;
  'Serialnumber': string;
}

export interface ProcessedDeviceData {
  type: 'laptop' | 'phone' | 'tablet' | 'monitor' | 'workstation' | 'other';
  brand: string;
  model: string;
  serial_number: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  employee_id?: string;
  notes?: string;
}