import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card } from 'react-bootstrap';
import ExcelReader from './components/ExcelReader';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/ResultsTable';

function App() {
  const [excelData, setExcelData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleDataLoad = (data) => {
    setExcelData(data);
  };

  const handleSearch = (query) => {
    setIsSearched(true);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = excelData.filter((row) => {
      return Object.values(row).some((value) => 
        String(value).toLowerCase().includes(query.toLowerCase())
      );
    });
    
    setSearchResults(results);
  };

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header as="h5">Excel Data Search</Card.Header>
        <Card.Body>
          <ExcelReader onDataLoad={handleDataLoad} />
          <SearchBar onSearch={handleSearch} />
          
          {isSearched && (
            <div className="mt-3">
              <h5>Search Results ({searchResults.length})</h5>
              <ResultsTable results={searchResults} />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;