import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import '../App.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function UserDetails() {
  const { name } = useParams();
  const [userData, setUserData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=qPpqPeTGRiCyM1g090ESgRRUl6j7z0owhkdVB2-2NTa5n18cOGoXTz8rKDIvw9-di2MhF0uQitSZFY8nyQnIK2GITL6wzdAqm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJUS5P1KiTdvf0q8Wa_LQXZsVk5njUM4RA9hsIv0pxR0_p6mh5qi5vR_1r6zZWWRU7_0Pc0--o0izbjVOSOMNiVLwYb8wpfW5g&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
        );
        const userData = response.data[name.toLowerCase()];

        const mappedUserData = userData
          .filter(user => user.TICKER)
          .map(user => ({
            TICKER: user.TICKER,
            Sector: user.Sector,
            "Cap Size": user["Cap Size"],
            LTP: user.LTP,
            Quantity: user.Quantity,
            "Latest Value": Math.round(user["Latest Value"]),
            "Scope to Grow": user["Scope to Grow"],
            "Hold/sell": user["Hold/sell"]
          }));

        setUserData(mappedUserData);
        setFilteredData(mappedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    const filtered = userData.filter(user =>
      user.TICKER.toLowerCase().includes(filterValue) ||
      user.Sector.toLowerCase().includes(filterValue) ||
      user["Cap Size"].toLowerCase().includes(filterValue)
    );
    setFilteredData(filtered);
  };

  const handleSortChange = (key) => {
    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setFilteredData(sorted);
  };

  const getScopeColor = (scope) => {
    if (parseFloat(scope.replace("%", "")) >= 50) {
      return "text-success";
    } else if (parseFloat(scope.replace("%", "")) >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  return (
    <div className="user-details mt-5">
      {loading ? (
        <div className="sweet-loading">
          <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
        </div>
      ) : (
        <>
          <div className="name text-center" style={{ backgroundColor: "black", color: "white", padding: "10px" }}>
            {name.toUpperCase()}
          </div>
          <div className="d-flex justify-content-between mb-3">
            <div className="col-sm-4">
              <input type="text" id="filter" onChange={handleFilterChange} className="form-control mt-2" placeholder="Filter by ticker or sector" />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th onClick={() => handleSortChange("TICKER")}>TICKER</th>
                  <th onClick={() => handleSortChange("Sector")}>Sector</th>
                  <th onClick={() => handleSortChange("Cap Size")}>Cap Size</th>
                  <th onClick={() => handleSortChange("LTP")}>LTP</th>
                  <th onClick={() => handleSortChange("Quantity")}>Quantity</th>
                  <th onClick={() => handleSortChange("Latest Value")}>Latest Value</th>
                  <th onClick={() => handleSortChange("Scope to Grow")}>Scope to Grow</th>
                  <th onClick={() => handleSortChange("Hold/sell")}>Hold/sell</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.map((user, index) => (
                  <tr key={index}>
                    <td>{user.TICKER}</td>
                    <td>{user.Sector}</td>
                    <td>{user["Cap Size"]}</td>
                    <td>{user.LTP}</td>
                    <td>{user.Quantity}</td>
                    <td>{user["Latest Value"]}</td>
                    <td className={getScopeColor(user["Scope to Grow"])}>{user["Scope to Grow"]}</td>
                    <td style={{ color: user["Hold/sell"] === "Hold" ? "green" : user["Hold/sell"] === "Sell" ? "red" : "inherit" }}>{user["Hold/sell"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="text-center m-2">
        <Link to="/portfolio" className="btn btn-secondary mb-1">Back</Link>
      </div>
    </div>
  );
}

export default UserDetails;
