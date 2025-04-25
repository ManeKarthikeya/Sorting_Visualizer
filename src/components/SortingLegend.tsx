
import React from 'react';

const SortingLegend: React.FC = () => {
  const legendItems = [
    { color: 'var(--sorting-default, #3B82F6)', label: 'Default' },
    { color: 'var(--sorting-comparing, #F59E0B)', label: 'Comparing' },
    { color: 'var(--sorting-swapping, #EF4444)', label: 'Swapping' },
    { color: 'var(--sorting-pivot, #8B5CF6)', label: 'Pivot' },
    { color: 'var(--sorting-sorted, #10B981)', label: 'Sorted' },
  ];

  return (
    <div className="flex justify-center flex-wrap gap-4 mt-4">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SortingLegend;
