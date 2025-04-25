// Move all sorting algorithm implementations here
export const getBubbleSortAnimations = (array: number[]) => {
  const animations = [];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Push comparison animation
      animations.push({
        type: 'compare',
        indices: [j, j + 1]
      });
      
      if (array[j] > array[j + 1]) {
        // Push swap animation
        animations.push({
          type: 'swap',
          indices: [j, j + 1],
          values: [array[j + 1], array[j]]
        });
        
        // Perform swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    
    // Mark as sorted
    animations.push({
      type: 'mark-sorted',
      indices: [n - i - 1]
    });
  }
  
  // Mark the first element as sorted (last remaining element)
  animations.push({
    type: 'mark-sorted',
    indices: [0]
  });
  
  return animations;
};

export const getSelectionSortAnimations = (array: number[]) => {
  const animations = [];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      animations.push({
        type: 'compare',
        indices: [minIndex, j]
      });
      
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      animations.push({
        type: 'swap',
        indices: [i, minIndex],
        values: [array[minIndex], array[i]]
      });
      
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
    
    animations.push({
      type: 'mark-sorted',
      indices: [i]
    });
  }
  
  // Mark the last element as sorted
  animations.push({
    type: 'mark-sorted',
    indices: [n - 1]
  });
  
  return animations;
};

export const getInsertionSortAnimations = (array: number[]) => {
  const animations = [];
  const n = array.length;
  
  // Mark first element as sorted
  animations.push({
    type: 'mark-sorted',
    indices: [0]
  });
  
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    // Compare with sorted elements
    while (j >= 0) {
      animations.push({
        type: 'compare',
        indices: [j, j + 1]
      });
      
      if (array[j] > key) {
        animations.push({
          type: 'overwrite',
          indices: [j + 1],
          values: [array[j]]
        });
        
        array[j + 1] = array[j];
        j--;
      } else {
        break;
      }
    }
    
    // Place the key
    if (j + 1 !== i) {
      animations.push({
        type: 'overwrite',
        indices: [j + 1],
        values: [key]
      });
    }
    
    array[j + 1] = key;
    
    // Mark the current element as sorted
    animations.push({
      type: 'mark-sorted',
      indices: Array(i + 1).fill(0).map((_, idx) => idx)
    });
  }
  
  return animations;
};

export const getMergeSortAnimations = (array: number[]) => {
  const animations: any[] = [];
  const auxiliaryArray = array.slice();
  
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  
  // Mark all as sorted at the end
  animations.push({
    type: 'mark-sorted',
    indices: Array(array.length).fill(0).map((_, idx) => idx)
  });
  
  return animations;
};

const mergeSortHelper = (
  mainArray: number[],
  startIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: any[]
) => {
  if (startIdx === endIdx) return;
  
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
};

const doMerge = (
  mainArray: number[],
  startIdx: number,
  middleIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: any[]
) => {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  
  while (i <= middleIdx && j <= endIdx) {
    // Compare values
    animations.push({
      type: 'compare',
      indices: [i, j]
    });
    
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // Overwrite value
      animations.push({
        type: 'overwrite',
        indices: [k],
        values: [auxiliaryArray[i]]
      });
      
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // Overwrite value
      animations.push({
        type: 'overwrite',
        indices: [k],
        values: [auxiliaryArray[j]]
      });
      
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  
  while (i <= middleIdx) {
    // No comparison, just overwrite
    animations.push({
      type: 'overwrite',
      indices: [k],
      values: [auxiliaryArray[i]]
    });
    
    mainArray[k++] = auxiliaryArray[i++];
  }
  
  while (j <= endIdx) {
    // No comparison, just overwrite
    animations.push({
      type: 'overwrite',
      indices: [k],
      values: [auxiliaryArray[j]]
    });
    
    mainArray[k++] = auxiliaryArray[j++];
  }
};

export const getQuickSortAnimations = (array: number[]) => {
  const animations: any[] = [];
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
};

const quickSortHelper = (
  array: number[],
  startIdx: number,
  endIdx: number,
  animations: any[]
) => {
  if (startIdx >= endIdx) {
    if (startIdx === endIdx) {
      animations.push({
        type: 'mark-sorted',
        indices: [startIdx]
      });
    }
    return;
  }
  
  const pivotIdx = partition(array, startIdx, endIdx, animations);
  
  // Mark pivot as sorted
  animations.push({
    type: 'mark-sorted',
    indices: [pivotIdx]
  });
  
  quickSortHelper(array, startIdx, pivotIdx - 1, animations);
  quickSortHelper(array, pivotIdx + 1, endIdx, animations);
};

const partition = (
  array: number[],
  startIdx: number,
  endIdx: number,
  animations: any[]
) => {
  // Choose pivot as the last element
  const pivotValue = array[endIdx];
  
  // Highlight pivot
  animations.push({
    type: 'pivot',
    indices: [endIdx]
  });
  
  let i = startIdx;
  
  for (let j = startIdx; j < endIdx; j++) {
    // Compare with pivot
    animations.push({
      type: 'compare',
      indices: [j, endIdx]
    });
    
    if (array[j] < pivotValue) {
      if (i !== j) {
        // Swap values
        animations.push({
          type: 'swap',
          indices: [i, j],
          values: [array[j], array[i]]
        });
        
        [array[i], array[j]] = [array[j], array[i]];
      }
      
      i++;
    }
  }
  
  // Place pivot in correct position
  if (i !== endIdx) {
    animations.push({
      type: 'swap',
      indices: [i, endIdx],
      values: [array[endIdx], array[i]]
    });
    
    [array[i], array[endIdx]] = [array[endIdx], array[i]];
  }
  
  return i;
};
