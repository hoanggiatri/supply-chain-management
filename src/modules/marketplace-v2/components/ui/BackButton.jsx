import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${className}`}
      title="Quay lại"
    >
      <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
    </button>
  );
};

export default BackButton;
