import React from 'react';
import { Table } from 'react-bootstrap';

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>No results found.</p>;
  }

  // Dynamically get headers from the first result
  const headers = Object.keys(results[0]);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={`${index}-${header}`}>{result[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ResultsTable;