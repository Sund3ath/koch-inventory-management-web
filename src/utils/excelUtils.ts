import { read, utils, write } from 'xlsx-js-style';

export async function readExcelFile<T>(file: File): Promise<T[]> {
  const data = await file.arrayBuffer();
  const workbook = read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json<T>(worksheet, {
    raw: false,
    defval: ''  // Default empty string for missing values
  });
  console.log('Parsed Excel data:', jsonData);
  return jsonData;
}

export function generateExcelTemplate() {
  const template = [
    ['Nachname', 'Vorname', 'Full Name', 'Activ', 'Department', 'Peripherie-Typ', 'ComputerNR', 'Marke/Modell', 'Serialnumber'],
    ['Mustermann', 'Max', 'Max Mustermann', 1, 'IT', 'Laptop', 'KS-N001', 'ThinkPad E14 Gen 5', 'PF4YXS9B'],
    ['Musterfrau', 'Anna', 'Anna Musterfrau', 1, 'Engineering', 'Workstation', 'KS-W001', 'Dell Precision 5820', 'WS123456']
  ];

  const ws = utils.aoa_to_sheet(template);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Devices');
  
  const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'device-template.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}