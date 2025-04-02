import React, { useRef } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const FileUploader = ({ onDataLoad, onLoading, onError }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      onError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    onLoading(true);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          onError('The Excel file does not contain any sheets');
          return;
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          onError('The Excel file does not contain any data');
          return;
        }
        
        onDataLoad(jsonData, file.name);
      } catch (error) {
        console.error('Error processing file:', error);
        onError('Failed to process the Excel file. Please check the file format.');
      }
    };
    
    reader.onerror = () => {
      onError('Failed to read the file');
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Set the file to the input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      
      // Trigger the same handler as file input
      handleFileUpload({ target: { files: [file] } });
    }
  };

  return (
    <Card 
      className="text-center p-4 bg-light border-dashed"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ 
        border: '2px dashed #ccc',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <Card.Body>
        <i className="bi bi-file-earmark-excel fs-1 text-primary mb-3"></i>
        <h5>Upload Excel File</h5>
        <p className="text-muted">Drag & drop an Excel file here or click to browse</p>
        
        <Form.Control
          type="file"
          ref={fileInputRef}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <Button 
          variant="primary" 
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Files
        </Button>
        <p className="mt-2 small text-muted">Supported formats: .xlsx, .xls</p>
      </Card.Body>
    </Card>
  );
};

export default FileUploader;