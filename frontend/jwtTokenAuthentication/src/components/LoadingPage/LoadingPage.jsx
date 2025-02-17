import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoadingPage;