
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const AlgorithmInfo: React.FC = () => {
  const algorithms = [
    {
      name: 'Bubble Sort',
      description: 'A simple comparison algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      characteristics: [
        'Simple to implement',
        'Not efficient for large data sets',
        'Performs well on nearly sorted data'
      ]
    },
    {
      name: 'Selection Sort',
      description: 'Repeatedly selects the smallest (or largest) element from the unsorted portion and puts it at the beginning (or end) of the sorted portion.',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      characteristics: [
        'Simple to implement',
        'Performs poorly on large data sets',
        'Makes the minimum number of swaps'
      ]
    },
    {
      name: 'Insertion Sort',
      description: 'Builds the sorted array one item at a time, by repeatedly taking the next element and inserting it into its correct position.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      characteristics: [
        'Efficient for small data sets',
        'Performs well on nearly sorted data',
        'Can sort a list as it receives it (online algorithm)'
      ]
    },
    {
      name: 'Merge Sort',
      description: 'A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      characteristics: [
        'Stable sort (preserves order of equal elements)',
        'Guaranteed worst-case performance',
        'Not an in-place algorithm, requires extra space'
      ]
    },
    {
      name: 'Quick Sort',
      description: 'A divide-and-conquer algorithm that selects a "pivot" element and partitions the array around the pivot, recursively sorting the sub-arrays.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      characteristics: [
        'Usually faster in practice than other sorting algorithms',
        'Not stable (doesn\'t preserve order of equal elements)',
        'Worst-case performance can be avoided with good pivot selection'
      ]
    }
  ];

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Algorithm Information</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {algorithms.map((algorithm, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {algorithm.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <p>{algorithm.description}</p>
                  
                  <div>
                    <h4 className="font-medium">Time Complexity:</h4>
                    <ul className="list-disc ml-5">
                      <li>Best Case: {algorithm.timeComplexity.best}</li>
                      <li>Average Case: {algorithm.timeComplexity.average}</li>
                      <li>Worst Case: {algorithm.timeComplexity.worst}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Space Complexity: {algorithm.spaceComplexity}</h4>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Characteristics:</h4>
                    <ul className="list-disc ml-5">
                      {algorithm.characteristics.map((char, idx) => (
                        <li key={idx}>{char}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AlgorithmInfo;
