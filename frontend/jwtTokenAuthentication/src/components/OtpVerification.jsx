import { useState } from "react";
import api from '../api'

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
      alert("Error registering user.");
    }
  };

  return (
    <div>
      {!verified ? (
        <>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      ) : (
        <h2>OTP Verified! Registering...</h2>
      )}
    </div>
  );
};

export default OtpVerification;
