import React, { useState } from "react";
import axios from "axios";
import api from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post("/register/", formData);

      if (response.status === 201) {
        setMessage("User registered successfully! Please log in.");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          password1: "",
          password2: "",
        });
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <input type="password" name="password1" placeholder="Password" value={formData.password1} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <input type="password" name="password2" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} required className="w-full p-2 border rounded-md mb-2"/>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Register</button>
      </form>
    </div>
  );
};

export default Register;
