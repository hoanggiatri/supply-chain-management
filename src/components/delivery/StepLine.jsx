
// Custom step connector using Tailwind CSS
const StepLine = ({ active, completed, className }) => {
  const lineColor = active || completed ? "bg-gray-900" : "bg-gray-300";

  return (
    <div className={`flex-1 ${className || ""}`}>
      <div className={`h-0.5 ${lineColor}`} />
    </div>
  );
};

export default StepLine;
