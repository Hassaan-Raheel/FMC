import { useState } from "react";
import "./Counter.css";

const Counter = ({ onCounterChange }) => {
  const [count, setCount] = useState(1);

  const handleDecrement = (e) => {
    e.preventDefault();
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onCounterChange(newCount);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    const newCount = count + 1;
    setCount(newCount);
    onCounterChange(newCount);
  };

  return (
      <div className="quantity">
        <a href="#" className="quantity__minus" onClick={handleDecrement}>
          <span className="CounterCss">-</span>
        </a>
        <input
          name="quantity"
          type="text"
          className="quantity__input"
          value={count}
          readOnly
        />
        <a href="#" className="quantity__plus" onClick={handleIncrement}>
          <span className="CounterCss">+</span>
        </a>
      </div>
  );
};

export default Counter;