import React, { useState } from "react";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("A user with this email already exists.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-emerald-600 flex items-center justify-center font-sans p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100 w-full max-w-md sm:max-w-lg">
        <div className="flex justify-center mb-6">
          <FaUserCircle className="text-emerald-600 text-6xl sm:text-7xl" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-emerald-800 mb-6">
          Create Account
        </h2>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-8">
          Join GreenCart and shop sustainably!
        </p>

        <form onSubmit={handleSignup} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-md font-semibold mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                id="name"
                type="text"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-gray-700 text-base sm:text-lg"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-md font-semibold mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                id="email"
                type="email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-gray-700 text-base sm:text-lg"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-md font-semibold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                id="password"
                type="password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-gray-700 text-base sm:text-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-md font-semibold mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                id="confirmPassword"
                type="password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-gray-700 text-base sm:text-lg"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-md">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline font-bold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
