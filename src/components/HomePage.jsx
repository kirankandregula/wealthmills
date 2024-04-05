import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";

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

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbxi6KIngthcgRe6y7-FXNdS8erjgi1KZGh93Js_wweZeNsb_RWpiNb5jj7911hAiJJT/exec"
      );
      setCards(
        response.data.map((card) => ({
          ...card,
          PV: Math.round(card.PV * 100) / 100,
          EG: Math.round(card.EG * 100) / 100, // Round to 2 decimal places
          PE: Math.round(card.PE * 100) / 100, // Round to 2 decimal places
          Equity: Math.round(card.Equity * 100) / 100 *100, // Round to 2 decimal places
          Gold: Math.round(card.Gold * 100) / 100 *100, // Round to 2 decimal places
          Debt: Math.round(card.Debt * 100) / 100 *100, // Round to 2 decimal places
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-5 mb-4 text-center">Users</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {cards.map((card, index) => (
          <div className="col" key={index}>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
