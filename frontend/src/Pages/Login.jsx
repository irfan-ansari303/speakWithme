import { useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", data);
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/Dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="w-full max-w-sm bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300">
        
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-base-content/50 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="w-full pl-11 pr-4 py-2.5 border rounded-lg bg-base-100 text-base-content outline-none 
              focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-base-content/50 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="w-full pl-11 pr-4 py-2.5 border rounded-lg bg-base-100 text-base-content outline-none 
              focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-content 
            font-semibold py-2.5 rounded-lg hover:brightness-110 transition"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>

        </form>
      </div>
    </div>
  );
}
