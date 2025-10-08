import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './CustomSelect.css'; // Vamos criar este arquivo de CSS a seguir

const CustomSelect = ({ icon, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Lógica para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Encontra o texto (label) da opção selecionada para exibição
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="custom-select-container" ref={selectRef}>
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <div className="form-input custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
          <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
            {displayValue}
          </span>
          <FaChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
