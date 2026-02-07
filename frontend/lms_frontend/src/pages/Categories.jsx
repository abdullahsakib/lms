import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // READ
  useEffect(() => {
    api.get("categories/").then(res => setCategories(res.data));
  }, []);

  // CREATE + UPDATE
  const saveCategory = async () => {
    if (!name.trim()) return;

    const data = { name, description };

    if (editingId) {
      const res = await api.put(`categories/${editingId}/`, data);
      setCategories(
        categories.map(c => (c.id === editingId ? res.data : c))
      );
      setEditingId(null);
    } else {
      const res = await api.post("categories/", data);
      setCategories([...categories, res.data]);
    }

    setName("");
    setDescription("");
  };

  // DELETE
  const deleteCategory = async id => {
    if (!window.confirm("Delete this category?")) return;

    await api.delete(`categories/${id}/`);
    setCategories(categories.filter(c => c.id !== id));
  };

  // START EDIT
  const editCategory = category => {
    setName(category.name);
    setDescription(category.description || "");
    setEditingId(category.id);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Categories</h1>
        <Link to="/courses" className="text-blue-600 underline">
          View Courses →
        </Link>
      </div>

      {/* Create / Update */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category name"
        />

        <textarea
          className="border p-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Category description"
        />

        <button
          onClick={saveCategory}
          className={`${
            editingId ? "bg-green-600" : "bg-blue-600"
          } text-white px-4 py-2`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* List */}
      <ul>
        {categories.map(c => (
          <li
            key={c.id}
            className="border p-3 mb-2 flex justify-between items-start"
          >
            <div>
              <span className="font-mono font-semibold">
                {c.id} — {c.name}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {c.description || "No description"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editCategory(c)}
                className="text-sm text-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(c.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
