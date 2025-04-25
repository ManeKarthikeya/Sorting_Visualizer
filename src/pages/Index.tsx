
import SortingVisualizer from '@/components/SortingVisualizer';
import SortingLegend from '@/components/SortingLegend';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex-1 px-4 py-10 md:px-8">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sorting Algorithm Visualizer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            An interactive platform for visualizing how different sorting algorithms work.
            Adjust speed, array size, and watch the sorting process in real-time.
          </p>
        </div>
        
        <Card className="p-6">
          <SortingLegend />
          <SortingVisualizer user={user} />
        </Card>
        
        <AlgorithmInfo />
      </div>
    </div>
  );
};

export default Index;
