import { Employee, Device } from '../types';
import { devices } from '../data/mockData';

export const getDepartments = (employees: Employee[]): string[] => {
  const departments = new Set(employees.map(emp => emp.department));
  return Array.from(departments).sort();
};

export const getAssignedDevices = (employeeId: string): Device[] => {
  return devices.filter(device => device.assignedTo?.id === employeeId);
};