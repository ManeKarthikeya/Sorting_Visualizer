
import { useState, useEffect } from 'react';
import { BarState } from '@/types/sorting';

export const useSortingArray = (arraySize: number) => {
  const [array, setArray] = useState<BarState[]>([]);

  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const resetArray = () => {
    const newArray: BarState[] = [];
    // Ensure we have a wider range of values for better visualization
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: randomIntFromInterval(5, 95), // Ensure values stay visible within container
        state: 'default'
      });
    }
    setArray(newArray);
  };

  // Ensure array is reset when array size changes
  useEffect(() => {
    resetArray();
  }, [arraySize]);

  return { array, setArray, resetArray };
};
