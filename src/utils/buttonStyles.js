// Button color configurations for Material Tailwind
// Usage: <Button {...BUTTON_COLORS.primary}>Submit</Button>

export const BUTTON_COLORS = {
  // Primary - Main actions (Submit, Save, Create, Confirm)
  primary: {
    color: "blue",
    variant: "filled",
    className: "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg",
  },

  // Secondary - Secondary actions (Cancel, Back, Close)
  secondary: {
    color: "gray",
    variant: "outlined",
    className: "border-gray-400 text-gray-700 hover:bg-gray-50",
  },

  // Success - Positive actions (Approve, Complete, Accept)
  success: {
    color: "green",
    variant: "filled",
    className: "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg",
  },

  // Danger - Destructive actions (Delete, Remove, Reject)
  danger: {
    color: "red",
    variant: "filled",
    className: "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg",
  },

  // Warning - Warning actions (Archive, Suspend)
  warning: {
    color: "orange",
    variant: "filled",
    className: "bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg",
  },

  // Info - Informational actions (View, Details, Info)
  info: {
    color: "cyan",
    variant: "filled",
    className: "bg-cyan-600 hover:bg-cyan-700 shadow-md hover:shadow-lg",
  },

  // Outlined Primary - Less prominent primary actions
  outlinedPrimary: {
    color: "blue",
    variant: "outlined",
    className: "border-blue-600 text-blue-600 hover:bg-blue-50",
  },

  // Outlined Secondary - Less prominent secondary actions
  outlinedSecondary: {
    color: "gray",
    variant: "outlined",
    className: "border-gray-300 text-gray-600 hover:bg-gray-50",
  },

  // Text Primary - Minimal primary actions
  textPrimary: {
    color: "blue",
    variant: "text",
    className: "text-blue-600 hover:bg-blue-50",
  },

  // Text Secondary - Minimal secondary actions
  textSecondary: {
    color: "gray",
    variant: "text",
    className: "text-gray-600 hover:bg-gray-50",
  },

  // Ghost - Very subtle actions
  ghost: {
    variant: "text",
    className: "text-gray-500 hover:bg-gray-100",
  },

  // White - For use on dark backgrounds
  white: {
    color: "white",
    variant: "filled",
    className: "bg-white text-gray-900 hover:bg-gray-100 shadow-md",
  },
};

// Helper function to apply button styles
export const getButtonProps = (type = "primary", additionalClasses = "") => {
  const config = BUTTON_COLORS[type] || BUTTON_COLORS.primary;
  return {
    ...config,
    className: `${config.className} ${additionalClasses}`.trim(),
  };
};
