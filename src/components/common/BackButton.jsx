import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = ({ to = -1, label = "Quay lại", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === "number") {
      navigate(to);
      return;
    }
    navigate(to);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      className={`text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1 ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};

BackButton.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default BackButton;
