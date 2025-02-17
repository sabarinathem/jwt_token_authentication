import { useState } from 'react';
import api from '@/api';
import OtpVerification from '../OtpVerification';
import { Link } from 'react-router-dom';

export default function RegisterComponent() {
  const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password1: "",
      password2: "",
    });

 const [message, setMessage] = useState(null);
  const [color,setColor] = useState('')
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setMessage("Passwords do not match!");
      setColor('red')
      return;
    }

    try {
      // Send OTP request
      await api.post("/send-otp/", {
        email: formData.email,
      });

      setOtpSent(true); // Show OTP verification component
      console.log(formData)
    } catch (error) {
      alert("Error sending OTP. Try again!");
    }


  };

  return (
    <>
    {
        !otpSent?(
            <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="md:w-1/2 bg-black">
        <img
          src="/register_image.jpg"
          alt="Streetwear Fashion"
          className="w-full h-full object-center"
          
        />
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 bg-[#4A3636] p-8 md:p-12">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            REGISTER
          </h2>

          {/* Name Fields */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name (optional)"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="ENTER YOUR EMAIL"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <input
              type="tel"
              name="phone_number"
              placeholder="ENTER YOUR PHONE NO"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Password Fields */}
          <div>
            <input
              type="password"
              name="password1"
              placeholder="ENTER YOUR PASSWORD"
              value={formData.password1}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password2"
              placeholder="CONFIRM PASSWORD"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-[#4A3636] py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            SUBMIT
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-300 w-full"></div>
            <span className="text-white text-sm whitespace-nowrap">OR</span>
            <div className="h-px bg-gray-300 w-full"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full bg-white text-gray-700 py-2 px-4 rounded font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue With Google
          </button>

          {/* Login Link */}
          <div className="text-center">
            <Link to="/login" className="text-white text-sm hover:underline">
              Already have an Account?
            </Link>
          </div>
        </form>
      </div>
    </div>
        ):(
            <OtpVerification formData={formData} />
          )
    }
    </>
  );
}