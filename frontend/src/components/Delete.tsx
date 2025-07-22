import React, { useState, useEffect } from "react";

function Delete() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log("Clicked count:", count); // Always shows previous value
  };

  useEffect(() => {
    console.log("Updated count (useEffect):", count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

export default Delete;
