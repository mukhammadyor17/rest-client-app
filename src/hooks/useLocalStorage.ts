"use client";

import { useState, useEffect } from "react";
import { type Variable } from "types/variables";

export default function useLocalStorage(key: string, initialValue: Variable[]) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
