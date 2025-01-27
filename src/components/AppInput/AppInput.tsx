import { useState } from 'react';
import './AppInput.scss';
import { Input } from 'antd';

interface PropsAppInput {
  placeholder?: string | undefined;
  className: string;
  onInput: (searchValue: string) => void;
}

export default function AppInput({
  placeholder = 'Type to search...',
  className,
  onInput,
}: PropsAppInput) {
  const [inputValue, setInputValue] = useState('');

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    setInputValue(value);
    onInput(value);
  }

  return (
    <Input
      className={`app-input app-input--${className}`}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInput}
    />
  );
}
