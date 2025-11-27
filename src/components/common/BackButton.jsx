import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const BackButton = ({ to = -1, label = "Quay lại", className }) => {
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
      {...getButtonProps("textSecondary")}
      onClick={handleClick}
      className={className}
    >
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
