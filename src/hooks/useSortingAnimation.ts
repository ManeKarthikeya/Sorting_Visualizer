
import { useRef } from 'react';
import { BarState } from '@/types/sorting';

export const useSortingAnimation = (setArray: React.Dispatch<React.SetStateAction<BarState[]>>) => {
  const animationsRef = useRef<any[]>([]);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const currentStepRef = useRef<number>(0);

  const clearTimeouts = () => {
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
  };

  const runAnimations = (animations: any[], startFromIndex = 0, animationSpeed: number, 
    onComplete: () => void) => {
    clearTimeouts();
    
    const timeouts: NodeJS.Timeout[] = [];
    const delay = 100 - animationSpeed;

    animations.slice(startFromIndex).forEach((animation, i) => {
      const timeout = setTimeout(() => {
        const { type, indices, values } = animation;
        currentStepRef.current = startFromIndex + i + 1;

        setArray(prevArray => {
          const newArray = [...prevArray];
          newArray.forEach((bar, idx) => {
            if (bar.state !== 'sorted') {
              bar.state = 'default';
            }
          });

          switch (type) {
            case 'compare':
              indices.forEach(idx => {
                if (newArray[idx].state !== 'sorted') {
                  newArray[idx].state = 'comparing';
                }
              });
              break;
            case 'swap':
              indices.forEach(idx => {
                if (newArray[idx].state !== 'sorted') {
                  newArray[idx].state = 'swapping';
                }
              });
              if (values) {
                indices.forEach((idx, i) => {
                  newArray[idx].value = values[i];
                });
              }
              break;
            case 'overwrite':
              indices.forEach((idx, i) => {
                if (newArray[idx].state !== 'sorted') {
                  newArray[idx].value = values[i];
                  newArray[idx].state = 'swapping';
                }
              });
              break;
            case 'pivot':
              indices.forEach(idx => {
                if (newArray[idx].state !== 'sorted') {
                  newArray[idx].state = 'pivot';
                }
              });
              break;
            case 'mark-sorted':
              indices.forEach(idx => {
                newArray[idx].state = 'sorted';
              });
              break;
          }
          return newArray;
        });

        if (startFromIndex + i === animations.length - 1) {
          setTimeout(() => {
            setArray(prevArray => 
              prevArray.map(bar => ({ ...bar, state: 'sorted' }))
            );
            onComplete();
          }, delay);
        }
      }, i * delay);

      timeouts.push(timeout);
    });

    animationTimeoutsRef.current = timeouts;
  };

  return {
    animationsRef,
    currentStepRef,
    clearTimeouts,
    runAnimations
  };
};
