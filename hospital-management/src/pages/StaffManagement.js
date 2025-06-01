import { useEffect, useState } from "react";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "", contact: "", department_id: "" });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editedDoctor, setEditedDoctor] = useState({ name: "", specialization: "", contact: "", department_id: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  const filteredDoctors = doctors
    .filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy]?.toString().toLowerCase() || "";
      const bVal = b[sortBy]?.toString().toLowerCase() || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleAddDoctor = () => {
    fetch("http://localhost:5000/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDoctor),
    })
      .then((res) => res.json())
      .then((added) => {
        setDoctors([...doctors, added]);
        setNewDoctor({ name: "", specialization: "", contact: "", department_id: "" });
      })
      .catch((err) => console.error("Failed to add doctor:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/doctors/${id}`, {
      method: "DELETE",
    })
      .then(() => setDoctors(doctors.filter((doc) => doc.doctor_id !== id)))
      .catch((err) => console.error("Delete failed:", err));
  };

  const startEditing = (doc) => {
    setEditingDoctorId(doc.doctor_id);
    setEditedDoctor({ ...doc });
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/api/doctors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editedDoctor.name,
        specialization: editedDoctor.specialization,
        contact: editedDoctor.contact,
        department_id: editedDoctor.department_id
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
      })
      .then(() => {
        const updated = doctors.map((doc) =>
          doc.doctor_id === id ? { ...editedDoctor, doctor_id: id } : doc
        );
        setDoctors(updated);
        setEditingDoctorId(null);
      })
      .catch((err) => {
        alert("Failed to save doctor: " + err.message);
        console.error("Update failed:", err);
      });
  };

  return (
    <div className="staff-management">
      <h2>Staff Management</h2>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          className="staff-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="sort-btn" onClick={() => toggleSort("name")}>
          Sort by Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
        </button>
      </div>

      <div className="add-doctor">
        <input type="text" placeholder="Name" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
        <input type="text" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
        <input type="text" placeholder="Contact" value={newDoctor.contact} onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })} />
        <input type="number" placeholder="Department ID" value={newDoctor.department_id} onChange={(e) => setNewDoctor({ ...newDoctor, department_id: e.target.value })} />
        <button onClick={handleAddDoctor}>Add Doctor</button>
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("specialization")}>Specialization</th>
            <th>Contact</th>
            <th>Department ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doc) => (
            <tr key={doc.doctor_id}>
              {editingDoctorId === doc.doctor_id ? (
                <>
                  <td><input type="text" value={editedDoctor.name} onChange={(e) => setEditedDoctor({ ...editedDoctor, name: e.target.value })} /></td>
                  <td><input type="text" value={editedDoctor.specialization} onChange={(e) => setEditedDoctor({ ...editedDoctor, specialization: e.target.value })} /></td>
                  <td><input type="text" value={editedDoctor.contact} onChange={(e) => setEditedDoctor({ ...editedDoctor, contact: e.target.value })} /></td>
                  <td><input type="number" value={editedDoctor.department_id} onChange={(e) => setEditedDoctor({ ...editedDoctor, department_id: e.target.value })} /></td>
                  <td>
                    <button className="save-btn" onClick={() => handleSave(doc.doctor_id)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingDoctorId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.contact}</td>
                  <td>{doc.department_id}</td>
                  <td>
                    <button className="edit-btn" onClick={() => startEditing(doc)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(doc.doctor_id)}>Remove</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
