
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface FormattedInputProps {
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  label?: string;
}

const FormattedInput: React.FC<FormattedInputProps> = ({
  mask,
  value,
  onChange,
  placeholder,
  className,
  required,
  id,
  disabled,
  label
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/\D/g, '');
    
    if (mask) {
      switch (mask) {
        case 'cpf':
          // Format as CPF: 000.000.000-00
          if (newValue.length <= 11) {
            newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
            newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
            newValue = newValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
          }
          break;
        case 'cnpj':
          // Format as CNPJ: 00.000.000/0000-00
          if (newValue.length <= 14) {
            newValue = newValue.replace(/^(\d{2})(\d)/, '$1.$2');
            newValue = newValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            newValue = newValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
            newValue = newValue.replace(/(\d{4})(\d)/, '$1-$2');
          }
          break;
        case 'phone':
          // Format as phone: (00) 00000-0000
          if (newValue.length <= 11) {
            newValue = newValue.replace(/^(\d{2})(\d)/g, '($1) $2');
            newValue = newValue.replace(/(\d)(\d{4})$/, '$1-$2');
          }
          break;
        case 'cep':
          // Format as CEP: 00000-000
          if (newValue.length <= 8) {
            newValue = newValue.replace(/^(\d{5})(\d)/, '$1-$2');
          }
          break;
      }
    }
    
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      id={id}
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
    />
  );
};

// Fix the export - both named and default exports
export { FormattedInput };
export default FormattedInput;
