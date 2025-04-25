
export type BarState = {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
};

export type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
