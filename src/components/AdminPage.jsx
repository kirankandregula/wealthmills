import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function getColorClass(qr) {
  const percentage = parseFloat(qr); // Convert QR to percentage

  if (percentage < 5) {
    return "bg-secondary";
  } else if (percentage >= 5 && percentage <= 10) {
    return "bg-warning";
  } else {
    return "bg-success";
  }
}

function AdminPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=PJ-_sBon-6ROFNmsTxt5H22x2jwBBcVYOwgPRfBpQS1nLCnivvluJ1w0-8SUrVdSXXCynU4kODXcDlocawcR4zJomXV63oIJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMqy3F1P4Fdc_ZYC95gds4g8EZem4AUjoNh107WXpquBj1_1MJz1Zmhu1Y6sn3Rd1VhValBzX8Y_4ESG5SstToNd_L4CvoM-Uw&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
      );
      setCards(
        response.data
          .filter((card) => card.Name) // Filter out cards with null names
          .map((card) => ({
            ...card,
            PV: Math.round(card.PV * 100) / 100,
            EG: Math.round(card.EG * 100) / 100, // Round to 2 decimal places
            PE: Math.round(card.PE * 100) / 100, // Round to 2 decimal places
            Equity: Math.round(card.Equity * 100) / 100 * 100, // Round to 2 decimal places
            Gold: Math.round(card.Gold * 100) / 100 * 100, // Round to 2 decimal places
            Debt: Math.round(card.Debt * 100) / 100 * 100, // Round to 2 decimal places
          }))
      );
     
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleCardClick = (name) => {
    // Call another component with the parameter name
    navigate(`/user-details/${name}`);
    // For now, log the name to the console
   
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-center" style={{marginTop: "70px"}}>PortFolio Data</h1>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        {loading ? ( // Display spinner while loading
          <div className="sweet-loading">
            <ClipLoader color={"#36D7B7"} loading={loading} css={override} size={150} />
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cards.map((card, index) => (
              <div className="col" key={index} onClick={() => handleCardClick(card.Name)}>
                <div className={`card rounded shadow ${getColorClass(card.QR)}`}>
                  <img
                    src={card.Image}
                    className="card-img-top mx-auto d-block rounded-circle mt-1"
                    style={{ maxWidth: "100px" }} // Adjust the max-width as needed
                    alt={card.Name}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{card.Name}</h5>
                    <div className="main d-flex flex-between">
                      <div className="values">
                        <p className="card-text">PortFolio Value: ₹{card.PV}</p>
                        <p className="card-text">Quarterly Return: {card.QR}</p>
                        <p className="card-text">Expected Growth: {card.EG}%</p>
                        <p className="card-text">PE Ratio: {card.PE}</p>
                      </div>
                      <div className="portfolio">
                        <p>Equity: {card.Equity}%</p>
                        <p>Gold: {card.Gold}%</p>
                        <p>Liquid & Debt: {card.Debt}%</p>
                      </div>
                    </div>
                    {card.Alert && card.Alert.length > 0 ? (
                      <div className="card-footer text-danger values mt-1">
                        Alert Stocks: {card.Alert}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
