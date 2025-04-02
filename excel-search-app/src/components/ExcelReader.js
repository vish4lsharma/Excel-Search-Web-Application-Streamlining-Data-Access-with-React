import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onDataLoad }) => {
  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const response = await fetch('/data/sample.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        onDataLoad(data);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    fetchExcelData();
  }, [onDataLoad]);

  return null; // This component doesn't render anything
};

export default ExcelReader;