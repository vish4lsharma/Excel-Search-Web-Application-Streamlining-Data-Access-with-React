import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import FileUploader from './components/FileUploader';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/ResultsTable';

function App() {
  const [excelData, setExcelData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleDataLoad = (data, name) => {
    setExcelData(data);
    setFileName(name);
    setIsFileUploaded(true);
    setIsLoading(false);
    setError(null);
    setIsSearched(false);
    setSearchResults([]);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleSearch = (query) => {
    setIsSearched(true);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = excelData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchResults(results);
  };

  const handleDownloadAll = () => {
    if (window.XLSX) {
      const wb = window.XLSX.utils.book_new();
      const ws = window.XLSX.utils.json_to_sheet(excelData);
      window.XLSX.utils.book_append_sheet(wb, ws, "All Data");
      window.XLSX.writeFile(wb, fileName || "excel_data.xlsx");
    }
  };

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow">
        <Card.Header as="h5" className="bg-primary text-white">Excel Data Search</Card.Header>
        <Card.Body>
          <FileUploader 
            onDataLoad={handleDataLoad} 
            onLoading={handleLoading}
            onError={handleError}
          />
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {isLoading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Processing Excel file...</p>
            </div>
          )}
          {isFileUploaded && !isLoading && (
            <>
              <div className="mt-4 mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
                <div>
                  <h6 className="mb-0">Data Loaded Successfully</h6>
                  <p className="text-muted mb-0">
                    {fileName} ({excelData.length} records)
                  </p>
                </div>
                <button className="btn btn-outline-primary" onClick={handleDownloadAll}>
                  Download All Data
                </button>
              </div>
              <SearchBar onSearch={handleSearch} />
              <div className="mt-4" style={{ minHeight: '300px' }}>
                {isSearched && <ResultsTable results={searchResults} />}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
