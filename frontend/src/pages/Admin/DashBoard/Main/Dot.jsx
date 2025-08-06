import React, { useState, useEffect, useRef } from "react";
import { Link,} from "react-router-dom";

const Dot = ({movie}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  //   const navigate = useNavigate();


  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-dots button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 text-2xl px-2 rounded hover:bg-gray-200 focus:outline-none"
      >
        &#8942; {/* Unicode for vertical ellipsis */}
      </button>

      {/* Dropdown menu */}
      {open &&
          <div
            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <Link
              to={`/admin/movies/update/${movie._id}`}
              className="block text-gray-500 w-full px-4 py-2 text-left hover:bg-gray-300"
            >
              Edit
            </Link>
            <Link
              to={`/admin/movie/comment/${movie._id}`}
              className="block text-gray-500 w-full px-4 py-2 text-left hover:bg-gray-300"
            >
              Comments
            </Link>
          </div>}
    </div>
  );
};

export default Dot;
