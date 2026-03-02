import React, { useState, useEffect } from "react";
import { useSearch } from "../../context/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let debounceTimer;

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSearch = async (keyword) => {
    try {
      const { data } = await axios.get(`/api/v1/product/search/${keyword}`);
      setValues({ ...values, results: data, keyword });
      navigate("/search");
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const keyword = e.target.value;
    setValues({ ...values, keyword });

    // Debounce to avoid rapid API calls
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch(keyword.trim());
      }
    }, 500); // 500ms debounce
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (values.keyword.trim()) {
      handleSearch(values.keyword.trim());
    }
  };

  return (
    <form className="fk-search-form" onSubmit={handleFormSubmit}>
      <input
        className="fk-search-input"
        type="search"
        placeholder="Search for Products, Brands and More"
        aria-label="Search"
        value={values.keyword}
        onChange={handleChange}
      />
      <button type="submit" className="fk-search-btn" aria-label="Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#2874f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 21L16 16" stroke="#2874f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
};

export default SearchInput;
