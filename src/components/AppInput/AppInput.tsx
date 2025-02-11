import './AppInput.scss';
import { Input } from 'antd';

interface PropsAppInput {
  value: string;
  placeholder?: string | undefined;
  className: string;
  onInput: (searchValue: string) => void;
}

export default function AppInput({
  value,
  placeholder = 'Type to search...',
  className,
  onInput,
}: PropsAppInput) {
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    onInput(value);
  }

  return (
    <Input
      className={`app-input app-input--${className}`}
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
    />
  );
}
