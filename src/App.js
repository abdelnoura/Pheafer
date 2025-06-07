import React from "react";
import { Routes, Route } from "react-router-dom";
import ListingList from "./ListingList";
import ListingDetail from "./ListingDetail";
import CreateListing from "./CreateListing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListingList />} />
      <Route path="/create" element={<CreateListing />} />
      <Route path="/listings/:id" element={<ListingDetail />} />
    </Routes>
  );
}

export default App;

