// Assuming CustomerSearchBar component if not already implemented
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CustomerSearchBar = ({ onSearch, placeholder = "Search customers..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="outline-secondary" type="submit" className="ms-2">
        Search
      </Button>
    </Form>
  );
};

export default CustomerSearchBar;
