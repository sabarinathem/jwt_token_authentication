import { useState } from "react";

const SortDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
 



  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md bg-white"
      >
        Sort by
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-40 bg-white border rounded-md shadow-md">
          <button
            onClick={() => handleSelect("Ascending")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            price : low to high
          </button>
          <button
            onClick={() => handleSelect("Descending")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            price : high to low
          </button>
          <button
            onClick={() => handleSelect("Descending")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            name : A to Z
          </button>
          <button
            onClick={() => handleSelect("Descending")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            price : Z to A
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropDown;
