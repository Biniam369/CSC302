import { useEffect, useState } from "react";
import "./BuyMedications.css";

function BuyMedications({ patientId }) {
  const [medications, setMedications] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("http://localhost:5000/api/medications")
      .then(res => res.json())
      .then(setMedications);
  }, []);

  const handlePurchase = () => {
    if (!selectedMed) return alert("Select a medication!");
    fetch("http://localhost:5000/api/purchase-medication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patientId,
        medication_id: selectedMed.medication_id,
        quantity: Number(quantity)
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Purchase successful!");
        } else {
          alert("Error: " + (data.error || "Unknown error"));
        }
      });
  };

  return (
    <div className="buy-medications-container">
      <h3>Buy Medications</h3>
      <form
        className="buy-medications-form"
        onSubmit={e => {
          e.preventDefault();
          handlePurchase();
        }}
      >
        <select
          onChange={e => {
            const med = medications.find(
              m => m.medication_id === Number(e.target.value)
            );
            setSelectedMed(med);
          }}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select Medication
          </option>
          {medications.map(med => (
            <option key={med.medication_id} value={med.medication_id}>
              {med.name} ({med.dosage}) - {med.manufacturer} -{" "}
              {med.prescription_req === 1 ? "Prescription" : "OTC"} - $
              {med.cost}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
          required
        />
        <button type="submit">Buy</button>
      </form>
    </div>
  );
}

export default BuyMedications;
