
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrayBars } from './sorting/ArrayBars';
import { Controls } from './sorting/Controls';
import { SortingHistory } from './sorting/SortingHistory';
import { useSortingArray } from '@/hooks/useSortingArray';
import { useSortingAnimation } from '@/hooks/useSortingAnimation';
import { 
  getBubbleSortAnimations,
  getSelectionSortAnimations,
  getInsertionSortAnimations,
  getMergeSortAnimations,
  getQuickSortAnimations
} from '@/utils/sortingAlgorithms';
import type { SortingAlgorithm } from '@/types/sorting';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const SortingVisualizer: React.FC<{ user: User | null }> = ({ user }) => {
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [arraySize, setArraySize] = useState<number>(20); // Default to 20
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const { array, setArray, resetArray } = useSortingArray(arraySize);
  const { animationsRef, currentStepRef, clearTimeouts, runAnimations } = 
    useSortingAnimation(setArray);

  const getAlgorithmName = (key: SortingAlgorithm): string => {
    const names: Record<SortingAlgorithm, string> = {
      'bubble': 'Bubble Sort',
      'selection': 'Selection Sort',
      'insertion': 'Insertion Sort',
      'merge': 'Merge Sort',
      'quick': 'Quick Sort'
    };
    return names[key];
  };

  const handleAlgorithmChange = (algorithm: SortingAlgorithm) => {
    if (isSorting) return;
    setSelectedAlgorithm(algorithm);
  };

  const handleArraySizeChange = (value: number) => {
    if (isSorting) return;
    setArraySize(value);
  };

  const recordSortingHistory = async (algorithm: string, size: number, time: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('sorting_history')
        .insert({
          algorithm_name: algorithm,
          array_size: size,
          execution_time: time,
          user_id: user.id
        });
        
      if (error) {
        console.error('Error recording sorting history:', error);
      }
    } catch (error) {
      console.error('Failed to record sorting history:', error);
    }
  };

  const sortArray = () => {
    if (isSorting && !isPaused) return;
    if (isCompleted) return resetArray();
    
    if (isPaused) {
      setIsPaused(false);
      runAnimations(animationsRef.current, currentStepRef.current, animationSpeed, () => {
        setIsSorting(false);
        setIsCompleted(true);
        toast(`${getAlgorithmName(selectedAlgorithm)} Completed!`, {
          description: 'Array has been sorted successfully.'
        });
      });
      return;
    }
    
    setIsSorting(true);
    
    const arrayCopy = [...array.map(item => item.value)];
    let animations: any[] = [];
    const startTime = performance.now();
    
    switch (selectedAlgorithm) {
      case 'bubble':
        animations = getBubbleSortAnimations(arrayCopy);
        break;
      case 'selection':
        animations = getSelectionSortAnimations(arrayCopy);
        break;
      case 'insertion':
        animations = getInsertionSortAnimations(arrayCopy);
        break;
      case 'merge':
        animations = getMergeSortAnimations(arrayCopy);
        break;
      case 'quick':
        animations = getQuickSortAnimations(arrayCopy);
        break;
    }
    
    animationsRef.current = animations;
    runAnimations(animations, 0, animationSpeed, () => {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setIsSorting(false);
      setIsCompleted(true);
      
      // Record sorting history if user is authenticated
      if (user) {
        recordSortingHistory(
          getAlgorithmName(selectedAlgorithm), 
          arraySize, 
          executionTime
        );
      }
      
      toast(`${getAlgorithmName(selectedAlgorithm)} Completed!`, {
        description: `Array sorted in ${executionTime.toFixed(2)}ms`
      });
    });
    
    toast(`Started ${getAlgorithmName(selectedAlgorithm)}`);
  };

  const pauseSorting = () => {
    if (!isSorting) return;
    setIsPaused(true);
    clearTimeouts();
  };

  const stepForward = () => {
    if (!isPaused) return;
    
    const animations = animationsRef.current;
    const currentStep = currentStepRef.current;
    
    if (currentStep >= animations.length) {
      return;
    }
    
    const animation = animations[currentStep];
    currentStepRef.current = currentStep + 1;
    
    const { type, indices, values } = animation;
    
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
    
    if (currentStep === animations.length - 1) {
      setTimeout(() => {
        setArray(prevArray => 
          prevArray.map(bar => ({ ...bar, state: 'sorted' }))
        );
        setIsSorting(false);
        setIsCompleted(true);
        toast(`${getAlgorithmName(selectedAlgorithm)} Sort Completed!`, {
          description: 'Array has been sorted successfully.'
        });
      }, 500);
    }
  };

  const stopAndReset = () => {
    clearTimeouts();
    setIsSorting(false);
    setIsPaused(false);
    setIsCompleted(false);
    resetArray();
  };

  return (
    <div className="space-y-6">
      <ArrayBars array={array} arraySize={arraySize} />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sorting Algorithm Visualizer</CardTitle>
            <CardDescription className="text-center">
              Visualize how different sorting algorithms work in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controls
              isSorting={isSorting}
              isPaused={isPaused}
              isCompleted={isCompleted}
              selectedAlgorithm={selectedAlgorithm}
              arraySize={arraySize}
              animationSpeed={animationSpeed}
              onAlgorithmChange={handleAlgorithmChange}
              onArraySizeChange={handleArraySizeChange}
              onSpeedChange={setAnimationSpeed}
              onSort={sortArray}
              onPause={pauseSorting}
              onStepForward={stepForward}
              onReset={stopAndReset}
            />
          </CardContent>
        </Card>
        
        {user && <SortingHistory user={user} />}
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="time" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="time">Time Complexity</TabsTrigger>
                <TabsTrigger value="space">Space Complexity</TabsTrigger>
              </TabsList>
              <TabsContent value="time" className="mt-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Bubble Sort:</strong> O(n²)</div>
                  <div><strong>Selection Sort:</strong> O(n²)</div>
                  <div><strong>Insertion Sort:</strong> O(n²)</div>
                  <div><strong>Merge Sort:</strong> O(n log n)</div>
                  <div><strong>Quick Sort:</strong> O(n log n) average case, O(n²) worst case</div>
                </div>
              </TabsContent>
              <TabsContent value="space" className="mt-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Bubble Sort:</strong> O(1)</div>
                  <div><strong>Selection Sort:</strong> O(1)</div>
                  <div><strong>Insertion Sort:</strong> O(1)</div>
                  <div><strong>Merge Sort:</strong> O(n)</div>
                  <div><strong>Quick Sort:</strong> O(log n) average case</div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;
