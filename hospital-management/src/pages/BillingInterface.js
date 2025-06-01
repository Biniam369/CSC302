import { useEffect, useState } from "react";
import "./BillingInterface.css";

const BillingInterface = () => {
  const [amount, setAmount] = useState("");
  const [insuranceList, setInsuranceList] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // ✅ Load insurance + patient list
  useEffect(() => {
    fetch("http://localhost:5000/api/insurance")
      .then((res) => res.json())
      .then(setInsuranceList)
      .catch((err) => console.error("❌ Insurance fetch failed:", err));

    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then(setPatients)
      .catch((err) => console.error("❌ Patient fetch failed:", err));
  }, []);

  // ✅ Calculate total after coverage
  const calculate = () => {
    const amt = parseFloat(amount);
    const coverage = selectedInsurance ? parseFloat(selectedInsurance.coverage_amount) : 0;

    if (isNaN(amt) || amt < 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (coverage > amt) {
      alert("Coverage amount cannot exceed the service amount.");
      return;
    }

    const total = amt - coverage;
    setFinalAmount(total.toFixed(2));
    setShowInvoice(false);
  };

  // ✅ Submit billing to backend
  const submitBilling = () => {
    if (!selectedPatientId || !selectedInsurance || finalAmount === null) {
      alert("Please select patient and insurance, then calculate total.");
      return;
    }

    fetch("http://localhost:5000/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: selectedPatientId,
        insurance_id: selectedInsurance.insurance_id,
        amount: parseFloat(amount),
        total: parseFloat(finalAmount),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Billing submitted successfully.");
        setShowInvoice(true);
      })
      .catch((err) => {
        console.error("❌ Billing error:", err);
        alert("❌ Billing failed. Check console.");
      });
  };

  const handlePrint = () => window.print();

  return (
    <div className="billing">
      <h2>Billing Interface</h2>

      <select
        onChange={(e) => setSelectedPatientId(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>-- Select Patient --</option>
        {patients.map((p) => (
          <option key={p.patient_id} value={p.patient_id}>
            {p.name} (ID: {p.patient_id})
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        placeholder="Service Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        onChange={(e) => {
          const selected = insuranceList.find(
            (i) => i.insurance_id === parseInt(e.target.value)
          );
          setSelectedInsurance(selected || null);
        }}
        defaultValue=""
      >
        <option value="" disabled>-- Select Insurance --</option>
        {insuranceList.map((ins) => (
          <option key={ins.insurance_id} value={ins.insurance_id}>
            {ins.provider} - {ins.policy_number} (${ins.coverage_amount})
          </option>
        ))}
      </select>

      <button onClick={calculate}>Calculate Total</button>

      {finalAmount && (
        <p><strong>Total after discount:</strong> ${finalAmount}</p>
      )}

      <button onClick={submitBilling}>Submit Billing</button>

      {showInvoice && (
        <div className="invoice">
          <h3>Invoice</h3>
          <p><strong>Original Amount:</strong> ${amount}</p>
          {selectedInsurance && (
            <>
              <p><strong>Insurance:</strong> {selectedInsurance.provider} ({selectedInsurance.policy_number})</p>
              <p><strong>Coverage:</strong> ${selectedInsurance.coverage_amount}</p>
            </>
          )}
          <p><strong>Final Amount:</strong> ${finalAmount}</p>
          <button onClick={handlePrint}>🖨 Print Invoice</button>
        </div>
      )}
    </div>
  );
};

export default BillingInterface;
