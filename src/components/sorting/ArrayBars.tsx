
import { BarState } from '@/types/sorting';

interface ArrayBarsProps {
  array: BarState[];
  arraySize: number;
}

export const ArrayBars = ({ array, arraySize }: ArrayBarsProps) => {
  return (
    <div className="array-container min-h-[400px] border-b border-border flex items-end justify-center gap-1">
      {array.map((bar, idx) => (
        <div
          className="array-bar transition-all duration-150 ease-in-out"
          key={idx}
          style={{
            height: `${bar.value}%`,
            width: `${Math.max(2, Math.min(100 / arraySize - 1, 20))}px`,
            backgroundColor: 
              bar.state === 'comparing' ? 'var(--sorting-comparing, #FFB74D)' :  // Orange for comparing
              bar.state === 'swapping' ? 'var(--sorting-swapping, #F44336)' :    // Red for swapping
              bar.state === 'sorted' ? 'var(--sorting-sorted, #4CAF50)' :        // Green for sorted
              bar.state === 'pivot' ? 'var(--sorting-pivot, #9C27B0)' :          // Purple for pivot
              'var(--sorting-default, #2196F3)',                                 // Blue for default
            opacity: 1, // Ensure all bars, including sorted ones, are fully visible
            boxShadow: bar.state === 'sorted' ? '0 0 8px var(--sorting-sorted, #4CAF50)' : '0 2px 10px rgba(0, 0, 0, 0.15)',
            borderRadius: '3px 3px 0 0',
            transform: 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}
