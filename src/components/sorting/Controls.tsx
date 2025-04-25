
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortingAlgorithm } from '@/types/sorting';

interface ControlsProps {
  isSorting: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  selectedAlgorithm: SortingAlgorithm;
  arraySize: number;
  animationSpeed: number;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onSort: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

export const Controls = ({
  isSorting,
  isPaused,
  isCompleted,
  selectedAlgorithm,
  arraySize,
  animationSpeed,
  onAlgorithmChange,
  onArraySizeChange,
  onSpeedChange,
  onSort,
  onPause,
  onStepForward,
  onReset
}: ControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select 
            value={selectedAlgorithm} 
            onValueChange={value => onAlgorithmChange(value as SortingAlgorithm)}
            disabled={isSorting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Array Size: {arraySize}</label>
          <Slider 
            value={[arraySize]} 
            min={5} 
            max={50}
            step={1} 
            onValueChange={([value]) => onArraySizeChange(value)}
            disabled={isSorting}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Speed: {animationSpeed}%</label>
          <Slider
            value={[animationSpeed]}
            min={1}
            max={95}
            step={1}
            onValueChange={([value]) => onSpeedChange(value)}
            disabled={isSorting && !isPaused}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          variant={isCompleted ? "outline" : "default"}
          onClick={onReset} 
          disabled={isSorting && !isPaused && !isCompleted}
        >
          {isCompleted ? "Generate New Array" : "Randomize Array"}
        </Button>
        
        <Button 
          onClick={onSort}
          disabled={(isSorting && !isPaused) || arraySize === 0}
          variant="default"
        >
          {isPaused ? "Resume" : (isCompleted ? "Sort Again" : "Start Sorting")}
        </Button>
        
        {isSorting && !isPaused && (
          <Button onClick={onPause} variant="outline">
            Pause
          </Button>
        )}
        
        {isPaused && (
          <Button onClick={onStepForward} variant="outline">
            Step Forward
          </Button>
        )}
        
        {isSorting && (
          <Button onClick={onReset} variant="destructive">
            Stop & Reset
          </Button>
        )}
      </div>
    </div>
  );
};
