import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [data, setData] = useState({ username: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        data
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Admin login successful");
      window.location.href = "/categories";
    } catch {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Admin Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Username"
        onChange={e => setData({ ...data, username: e.target.value })}
      />

      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="Password"
        onChange={e => setData({ ...data, password: e.target.value })}
      />

      <button
        onClick={login}
        className="bg-blue-600 text-white w-full py-2"
      >
        Login
      </button>
    </div>
  );
}
