import { Minus, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

export function QuantityControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [inputValue, setInputValue] = useState(value.toString())

  // Sync inputValue with prop value when it changes (e.g., from parent updates)
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Allow only digits and empty field (we'll treat empty as 1 on blur)
    if (/^\d*$/.test(val)) {
      setInputValue(val)
    }
    // If invalid, do nothing (don't update inputValue)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    let num = val === '' ? 1 : parseInt(val, 10)
    // Clamp between 1 and 999
    num = Math.min(999, Math.max(1, num))
    setInputValue(num.toString())
    onChange(num)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      return;
    }
    // Optional: ArrowUp/Down to increment/decrement
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(999, value + 1));
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
      return;
    }
  }

  return (
    <div className="quantity-control" aria-label="Quantity selector">
      <button className="icon-btn" type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}>
        <Minus size={17} />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Quantity input"
        className="icon-btn quantity-input"
      />
      <button className="icon-btn" type="button" aria-label="Increase quantity" onClick={() => onChange(Math.min(999, value + 1))}>
        <Plus size={17} />
      </button>
    </div>
  )
}
