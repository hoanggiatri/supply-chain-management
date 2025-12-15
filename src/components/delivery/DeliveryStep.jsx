import { CheckCircle, Package, Truck } from "lucide-react";

const DeliveryStep = (props) => {
  const { active, completed, icon } = props;

  const icons = {
    1: Package,
    2: Truck,
    3: CheckCircle,
  };

  const Icon = icons[icon] || Package;

  let color = "text-gray-400";
  if (completed) color = "text-gray-900";
  else if (active) color = "text-gray-900";

  return (
    <div className={color}>
      <Icon className="w-7 h-7" />
    </div>
  );
};

export default DeliveryStep;
