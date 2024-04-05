import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StockMoniter = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.google.com/macros/s/AKfycbwvLBG9TLyGzaXOY2ewXSjp2gvyvQPgyJuGjNXgjRB9zBZJ4z2hrXbh1MQZIfCdEzjN/exec"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once on mount

  const getScopeColor = (scope) => {
    if (parseFloat(scope.replace("%", "")) >= 50) {
      return "text-success";
    } else if (parseFloat(scope.replace("%", "")) >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  const getHoldSellColor = (holdSell) => {
    return holdSell === "Hold" ? "text-success" : "text-danger";
  };

  const handleSort = (columnName) => {
    const sortedData = [...data].sort((a, b) =>
      a[columnName] > b[columnName] ? 1 : -1
    );
    setData(sortedData);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredData = data.filter(
    (row) =>
      row.Ticker.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.Sector.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <input
            type="text"
            placeholder="Filter by ticker or sector"
            value={filterValue}
            onChange={handleFilterChange}
            className="form-control mb-3"
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th onClick={() => handleSort("Ticker")}>Ticker</th>
              <th onClick={() => handleSort("Sector")}>Sector</th>
              <th onClick={() => handleSort("Scope to Grow")}>
                Scope to Grow
              </th>
              <th onClick={() => handleSort("Hold/Sell")}>Hold/Sell</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.Ticker}</td>
                <td>{row.Sector}</td>
                <td className={getScopeColor(row["Scope to Grow"])}>
                  {row["Scope to Grow"]}
                </td>
                <td className={getHoldSellColor(row["Hold/Sell"])}>
                  {row["Hold/Sell"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMoniter;
