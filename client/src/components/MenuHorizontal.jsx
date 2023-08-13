import { useState } from "react";
import "../styles/MenuHorizontal.css";

const HorizontalMenu = ({ options, onSelectCategoria, categoriaActual }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOptionClick = (index) => {
    onSelectCategoria(options[index]);
    setCurrentIndex(index);
  };

  return (
    <div className="horizontal-menu">
      <div className="menu-content">
        {options.map((option, index) => (
          <div
            key={index}
            className={`menu-option ${option === categoriaActual ? 'active' : ''}`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalMenu;
