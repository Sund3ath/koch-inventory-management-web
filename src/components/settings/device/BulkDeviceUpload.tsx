import React, { useState, useRef } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { useDeviceStore } from '../../../stores/deviceStore';
import { readExcelFile, generateExcelTemplate } from '../../../utils/excelUtils';
import type { DeviceUploadData, ProcessedDeviceData } from '../../../types/upload';
import { processDeviceData, validateDeviceData } from '../../../utils/deviceUtils';

export const BulkDeviceUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DeviceUploadData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedDeviceData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createBulkDevices } = useDeviceStore();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const jsonData = await readExcelFile<DeviceUploadData>(file);
      setFile(file);
      setPreview(jsonData);
      
      // Validate the data
      const validation = validateDeviceData(jsonData);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
      
      // Process the data only if validation passes
      const processed = await processDeviceData(jsonData);
      setProcessedData(processed);
      setValidationErrors([]);
    } catch (error) {
      setValidationErrors(['Invalid file format. Please use a valid Excel file.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || validationErrors.length > 0) return;
    
    setIsUploading(true);
    try {
      // Upload all devices at once - duplicates will be skipped by the database function
      await createBulkDevices(processedData);

      setFile(null);
      fileInputRef.current!.value = '';
      setPreview([]);
      setProcessedData([]);
      setValidationErrors([]);
      alert('Upload completed successfully! Duplicate serial numbers were skipped.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload devices';
      setValidationErrors([message]);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    generateExcelTemplate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Bulk Device Upload</h3>
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
              accept=".xlsx,.xls"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Select Excel File
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop your Excel file here
          </p>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
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
          <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0] || {}).map((header) => (
                    <th key={header} className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-3 py-4 text-sm text-gray-500">
                        {value?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || validationErrors.length > 0 || isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload Devices'}
        </button>
      </div>
    </div>
  );
};