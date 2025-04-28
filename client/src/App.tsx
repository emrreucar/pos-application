import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredData(data);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/search-books?query=${
          event.target.value
        }`
      );
      setFilteredData(res.data);
    } catch (error) {
      console.log("Error searching data:", error);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <h1>Welcome to the React App</h1>
      <p>This is a simple React application.</p>
      <p>It is built using TypeScript and Vite.</p>
      <p>Enjoy coding!</p>
      {filteredData.length > 0 ? (
        <ul>
          {filteredData.map((item, index) => (
            <li key={index}>
              <strong>Title:</strong> {item.title} <br />
              <strong>Author:</strong> {item.author} <br />
              <strong>Year:</strong> {item.published_date} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </>
  );
}

export default App;
