import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [instructors, setInstructors] = useState("");
  const [editingId, setEditingId] = useState(null);

  // load courses
  const loadCourses = () => {
    api.get(`courses/?category=${categoryFilter}`).then(res =>
      setCourses(res.data)
    );
  };

  useEffect(() => {
    loadCourses();
  }, [categoryFilter]);

  // add or update
  const submitCourse = e => {
    e.preventDefault();

    const data = {
      title,
      description,
      category,
      instructors: instructors.split(",").map(id => Number(id)),
    };

    if (editingId) {
      api.put(`courses/${editingId}/`, data).then(() => {
        resetForm();
        loadCourses();
      });
    } else {
      api.post("courses/", data).then(() => {
        resetForm();
        loadCourses();
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setInstructors("");
    setEditingId(null);
  };

  const editCourse = c => {
    setEditingId(c.id);
    setTitle(c.title);
    setDescription(c.description);
    setCategory(c.category);
    setInstructors(c.instructors.join(","));
  };

  const deleteCourse = id => {
    if (confirm("Delete this course?")) {
      api.delete(`courses/${id}/`).then(loadCourses);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Courses</h1>

      {/* FILTER */}
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Filter by Category ID"
        onChange={e => setCategoryFilter(e.target.value)}
      />

      {/* ADD / EDIT FORM */}
      <form onSubmit={submitCourse} className="border p-4 mb-6">
        <h2 className="font-bold mb-2">
          {editingId ? "Edit Course" : "Add Course"}
        </h2>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Category ID"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Instructor IDs (comma separated: 1,2)"
          value={instructors}
          onChange={e => setInstructors(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2">
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 text-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* COURSE LIST */}
      {courses.map(c => (
        <div key={c.id} className="border p-4 mb-2">
          <h2 className="font-bold">{c.title}</h2>
          <p>{c.description}</p>
          <small>Category: {c.category_name}</small>

          <div className="mt-2">
            <button
              className="text-blue-600 mr-3"
              onClick={() => editCourse(c)}
            >
              Edit
            </button>

            <button
              className="text-red-600"
              onClick={() => deleteCourse(c.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
