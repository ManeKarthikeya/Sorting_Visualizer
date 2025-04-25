
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from 'lucide-react';

interface SortingHistoryRecord {
  id: string;
  algorithm_name: string;
  array_size: number;
  execution_time: number;
  created_at: string;
}

export const SortingHistory = ({ user }: { user: User | null }) => {
  const [history, setHistory] = useState<SortingHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sorting_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching sorting history:', error);
        } else {
          setHistory(data as SortingHistoryRecord[]);
        }
      } catch (error) {
        console.error('Error fetching sorting history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Sorting History</CardTitle>
        <CardDescription>View your recent sorting algorithm runs</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader className="animate-spin" />
          </div>
        ) : history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Array Size</TableHead>
                <TableHead>Execution Time (ms)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.algorithm_name}</TableCell>
                  <TableCell>{record.array_size}</TableCell>
                  <TableCell>{record.execution_time.toFixed(2)}</TableCell>
                  <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No sorting history yet. Try running some sorting algorithms!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
