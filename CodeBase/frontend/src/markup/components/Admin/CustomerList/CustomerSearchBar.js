import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import '../../../../assets/styles/custom.css';

const CustomerSearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only call onSearch if it's a valid function
    if (searchQuery.trim() && typeof onSearch === "function") {
      onSearch(searchQuery);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row>
        <Col md={8}>
          <Form.Control
            className="searchBoarder"
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Button
            type="submit"
            variant="danger"
            block="true"
            className="btnColor"
            disabled={!searchQuery.trim()} // optional: disable button if input is empty
          >
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

// Provide a default no-op function to prevent errors if onSearch isn't passed
CustomerSearchBar.defaultProps = {
  onSearch: () => {},
};

export default CustomerSearchBar;
