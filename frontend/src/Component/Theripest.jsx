import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Theripest = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query'); // Get the search query

  useEffect(() => {
    if (query) {
      setLoading(true); // Ensure loading state is true before fetch starts
      fetch(`http://localhost:5000/api/search?query=${query}`, { method: 'GET', cache: 'no-store' })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok"); // Handle network errors
          }
          return response.json();
        })
        .then(data => {
          console.log("Search results:", data);
          setSearchResults(data); // Set the fetched search results
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading after fetch (even on error)
        });
    } else {
      setLoading(false); // If no query, stop loading immediately
    }
  }, [query]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {searchResults.length > 0 ? (
        searchResults.map(item => (
          <div key={item._id}>
            <h3>{item.doctorDetails.name}</h3> {/* Accessing nested doctorDetails */}
            <p>Specialization: {item.doctorDetails.specialization}</p> {/* Accessing specialization */}
            <p>Experience: {item.doctorDetails.experience} years</p> {/* Accessing experience */}
            <p>{item.description}</p> {/* Description of the doctor */}
            {/* Add Book Appointment Button */}
            <button onClick={() => navigate(`/book-appointment/${item._id}`)}>Book Appointment</button>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default Theripest;