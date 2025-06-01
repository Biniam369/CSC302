import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const ModernLoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("doctor");
  const [credentials, setCredentials] = useState({ name: "", id: "" });
  const [signupData, setSignupData] = useState({
    // Doctor fields
    name: "",
    specialization: "",
    contact: "",
    department_id: "",
    // Patient fields
    gender: "",
    age: "",
    address: "",
    insurance_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const navigate = useNavigate();

  // Fetch department options if doctor signup panel is shown
  useEffect(() => {
    if (isSignUp && role === "doctor") {
      fetch("http://localhost:5000/api/departments")
        .then((res) => res.json())
        .then(setDepartments)
        .catch(() => setDepartments([]));
    }
  }, [isSignUp, role]);

  // Fetch insurance options if patient signup panel is shown
  useEffect(() => {
    if (isSignUp && role === "patient") {
      fetch("http://localhost:5000/api/insurance")
        .then((res) => res.json())
        .then(setInsurances)
        .catch(() => setInsurances([]));
    }
  }, [isSignUp, role]);

  // --- LOGIN HANDLER ---
  const handleLogin = () => {
    if (role === "doctor") {
      fetch("http://localhost:5000/api/doctors/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: credentials.name, doctor_id: Number(credentials.id) }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.doctor) {
            localStorage.setItem("doctor_id", data.doctor.doctor_id);
            localStorage.setItem("doctor_name", data.doctor.name);
            alert("Doctor login successful");
            navigate("/doctor");
          } else {
            alert("Invalid doctor name or ID");
          }
        })
        .catch(() => alert("Invalid doctor name or ID"));
    } else if (role === "patient") {
      fetch("http://localhost:5000/api/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: credentials.name, patient_id: credentials.id }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.patient) {
            localStorage.setItem("patient_id", data.patient.patient_id);
            localStorage.setItem("patient_name", data.patient.name);
            alert("Patient login successful");
            navigate("/patient");
          } else {
            alert("Invalid patient name or ID");
          }
        })
        .catch(() => alert("Invalid patient name or ID"));
    } else if (role === "nurse") {
      navigate("/nurse");
    } else if (role === "admin") {
      navigate("/admin");
    }
  };

  // --- SIGNUP HANDLER ---
  const handleSignup = (e) => {
    e.preventDefault();
    if (role === "doctor") {
      fetch("http://localhost:5000/api/doctors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          specialization: signupData.specialization,
          contact: signupData.contact,
          department_id: signupData.department_id,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.doctor_id) {
            alert(`Signup successful! Your doctor ID is ${data.doctor_id}. Please login.`);
            setSignupData({
              name: "",
              specialization: "",
              contact: "",
              department_id: "",
              gender: "",
              age: "",
              address: "",
              insurance_id: "",
            });
            setIsSignUp(false);
          } else {
            alert("Signup failed!");
          }
        })
        .catch(() => alert("Signup failed!"));
    } else if (role === "patient") {
      fetch("http://localhost:5000/api/patients/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          gender: signupData.gender,
          age: signupData.age,
          contact: signupData.contact,
          address: signupData.address,
          insurance_id: signupData.insurance_id,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.patient_id) {
            alert(`Signup successful! Your patient ID is ${data.patient_id}. Please login.`);
            setSignupData({
              name: "",
              specialization: "",
              contact: "",
              department_id: "",
              gender: "",
              age: "",
              address: "",
              insurance_id: "",
            });
            setIsSignUp(false);
          } else {
            alert("Signup failed!");
          }
        })
        .catch(() => alert("Signup failed!"));
    }
  };

  return (
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
      {/* --- SIGN IN FORM --- */}
      <div className="form-container sign-in-container">
        <form>
          <h2>Sign In</h2>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select-role"
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
          />
          {(role === "doctor" || role === "patient") && (
            <input
              type="text"
              placeholder={role === "doctor" ? "Doctor ID" : "Patient ID"}
              value={credentials.id}
              onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
            />
          )}
          <button type="button" onClick={handleLogin}>
            Sign In
          </button>
        </form>
      </div>

      {/* --- SIGN UP FORM --- */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select-role"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          {role === "doctor" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Specialization"
                value={signupData.specialization}
                onChange={e => setSignupData({ ...signupData, specialization: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Contact"
                value={signupData.contact}
                onChange={e => setSignupData({ ...signupData, contact: e.target.value })}
                required
              />
              <select
                value={signupData.department_id}
                onChange={e => setSignupData({ ...signupData, department_id: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.department_id} value={dep.department_id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              <button type="submit">
                Sign Up as Doctor
              </button>
            </>
          )}
          {role === "patient" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
              <select
                value={signupData.gender}
                onChange={e => setSignupData({ ...signupData, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={signupData.age}
                onChange={e => setSignupData({ ...signupData, age: e.target.value })}
                min="0"
                required
              />
              <input
                type="text"
                placeholder="Contact"
                value={signupData.contact}
                onChange={e => setSignupData({ ...signupData, contact: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={signupData.address}
                onChange={e => setSignupData({ ...signupData, address: e.target.value })}
                required
              />
              <select
                value={signupData.insurance_id}
                onChange={e => setSignupData({ ...signupData, insurance_id: e.target.value })}
                required
              >
                <option value="">Select Insurance</option>
                {insurances.map(i => (
                  <option key={i.insurance_id} value={i.insurance_id}>
                    {i.provider} ({i.coverage_details}) - {i.coverage_amount} AED
                  </option>
                ))}
              </select>
              <button type="submit" class="patient-signup-button">
                Sign Up as Patient
              </button>
            </>
          )}
        </form>
      </div>

      {/* --- OVERLAY PANELS --- */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>To keep connected, please login with your info</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Sign up as a new doctor or patient</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
