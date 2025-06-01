import { useEffect, useState } from "react";
import "./InventorySystem.css";

const InventorySystem = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expiration_date: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error("Failed to load inventory:", err));
  }, []);

  const getStatus = (item) => {
    const today = new Date();
    const expiry = new Date(item.expiration_date);
    if (expiry < today) return "Expired";
    if (item.quantity < 5) return "Low Stock";
    return "OK";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Expired":
        return "status-expired";
      case "Low Stock":
        return "status-low";
      case "OK":
        return "status-ok";
      default:
        return "";
    }
  };

  const addInventory = () => {
    fetch("http://localhost:5000/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        quantity: parseInt(newItem.quantity, 10),
      }),
    })
      .then((res) => res.json())
      .then((added) => {
        setInventory([...inventory, added]);
        setNewItem({ name: "", quantity: "", expiration_date: "" });
      })
      .catch((err) => console.error("Failed to add item:", err));
  };

  const startEditing = (item) => {
    setEditItemId(item.item_id);
    setEditedItem({ ...item });
  };

  const cancelEdit = () => {
    setEditItemId(null);
    setEditedItem({});
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:5000/api/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedItem),
    })
      .then((res) => res.json())
      .then(() => {
        const updated = inventory.map((item) =>
          item.item_id === id ? { ...editedItem, item_id: id } : item
        );
        setInventory(updated);
        cancelEdit();
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteItemConfirmed = () => {
    fetch(`http://localhost:5000/api/inventory/${confirmDeleteId}`, {
      method: "DELETE",
    })
      .then(() => {
        setInventory(inventory.filter((inv) => inv.item_id !== confirmDeleteId));
        setConfirmDeleteId(null);
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-system">
      <h2>Inventory System</h2>

      <div className="inventory-form">
        <input
          type="text"
          placeholder="Item"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <input
          type="date"
          value={newItem.expiration_date}
          onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
        />
        <button onClick={addInventory}>Add Item</button>
      </div>

      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => {
            const status = getStatus(item);
            const isEditing = editItemId === item.item_id;

            return (
              <tr key={item.item_id} className={isEditing ? "editing-row" : ""}>
                <td>
                  {isEditing ? (
                    <input
                      value={editedItem.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItem.quantity}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, quantity: e.target.value })
                      }
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedItem.expiration_date}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, expiration_date: e.target.value })
                      }
                    />
                  ) : (
                    item.expiration_date
                  )}
                </td>
                <td className={getStatusClass(status)}>{status}</td>
                <td>
                  {isEditing ? (
                    <>
                      <button className="save-button" onClick={() => saveEdit(item.item_id)}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-button" onClick={() => startEditing(item)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => confirmDelete(item.item_id)}>
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={deleteItemConfirmed}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySystem;
