import { useState, useCallback } from 'react';
import { getHoldColors } from '../actions/manageHoldColors';

export type HoldColorOption = {
  id: number;
  name: string;
  color: string;
};

export const useFetchHoldColors = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldColors = useCallback(async (locationId: number): Promise<HoldColorOption[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const colors = await getHoldColors(locationId);
      setIsLoading(false);
      return colors;
    } catch (err) {
      setError('Failed to fetch hold colors');
      setIsLoading(false);
      return [];
    }
  }, []);

  return { fetchHoldColors, isLoading, error };
};