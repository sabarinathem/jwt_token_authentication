import { useState } from "react";
import api from '../api'
import { Navigate } from "react-router-dom";

const OtpVerification = ({ formData }) => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerifyOtp = async () => {
    try {
      const response = await api.post("/verify-otp/", {
        email: formData.email,
        otp: otp,
      });

      if (response.data.message === "OTP verified successfully") {
        setVerified(true);
        handleRegisterUser();
        console.log('OTP verified successfully')
      }
    } catch (error) {
      alert("Invalid OTP! Try again.");
    }
  };

  const handleRegisterUser = async () => {
    try {
      // Send final registration request after OTP verification
      await api.post("/register/", formData);
      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {!verified ? (
        <>
          {/* <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <InputOTP/>
          <button onClick={handleVerifyOtp}>Verify OTP</button> */}
          <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md space-y-8">
            {/* <!-- Main Content --> */}
            <div className="text-center space-y-6">
                {/* <!-- Header --> */}
                <h1 className="text-xl md:text-2xl font-medium text-center">
                    Check your Gmail, we sent a otp to your account
                </h1>

                {/* <!-- OTP Form --> */}
                <form className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-center">
                            Enter OTP
                        </label>
                        <input 
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxlength="6"
                            className="w-full max-w-[200px] mx-auto block px-4 py-2 text-center bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>

                    {/* <!-- Resend Link --> */}
                    <div className="text-center">
                        <button 
                            type="button"
                            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                        >
                            resent OTP
                        </button>
                    </div>

                    {/* <!-- Continue Button --> */}
                    <button 
                        type="button"
                        onClick={handleVerifyOtp}
                        className="w-full max-w-[200px] mx-auto block px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors duration-200"
                    >
                        CONTINUE
                    </button>
                </form>
            </div>
        </div>
    </div>
        </>
      ) : (
        // <h2>OTP Verified! Registering...</h2>
        <Navigate to="/login" replace />
      )}
    </div>
  );
};

export default OtpVerification;
