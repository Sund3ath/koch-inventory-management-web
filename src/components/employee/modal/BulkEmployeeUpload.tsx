import React, { useState, useRef } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';

interface BulkEmployeeUploadProps {
  onClose: () => void;
}

export const BulkEmployeeUpload: React.FC<BulkEmployeeUploadProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setFile(file);
      parseFile(file);
    } else {
      setValidationErrors(['Please upload a valid CSV or Excel file']);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const data = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',');
        const entry: any = {};
        
        headers.forEach((header, index) => {
          entry[header.trim()] = values[index]?.trim();
        });
        
        data.push(entry);
      }
      
      setPreview(data);
      validateData(data);
    };
    reader.readAsText(file);
  };

  const validateData = (data: any[]) => {
    const errors: string[] = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position'];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 1}: Missing ${field}`);
        }
      });

      if (row.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(row.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
      }
    });
    
    setValidationErrors(errors);
  };

  const handleUpload = async () => {
    if (!file || validationErrors.length > 0) return;
    
    setIsUploading(true);
    try {
      // TODO: Implement bulk upload logic
      console.log('Uploading employees:', preview);
      onClose();
    } catch (error) {
      console.error('Error uploading employees:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'employeeId,firstName,lastName,department,position,email,startDate,manager\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          <Download className="h-4 w-4 mr-1" />
          Download Template
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Select File
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop your CSV/Excel file here
          </p>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Validation Errors
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Preview</h4>
          <div className="mt-2 max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((header) => (
                    <th
                      key={header}
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {preview.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value: any, colIndex) => (
                      <td
                        key={colIndex}
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || validationErrors.length > 0 || isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload Employees'}
        </button>
      </div>
    </div>
  );
};