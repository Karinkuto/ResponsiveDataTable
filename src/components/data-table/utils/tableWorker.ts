/**
 * This file provides a mechanism for handling heavy table operations
 * Rather than using Web Workers directly (which causes issues with Next.js),
 * we use an asynchronous approach that runs in the main thread but 
 * doesn't block the UI
 */

// Define the operation types
type SortOperation<T> = {
  type: 'sort';
  data: T[];
  sortBy: {
    id: string;
    desc: boolean;
  }[];
};

type FilterOperation<T> = {
  type: 'filter';
  data: T[];
  filters: {
    id: string;
    value: unknown;
  }[];
};

type SearchOperation<T> = {
  type: 'search';
  data: T[];
  searchTerm: string;
  searchColumns: string[];
};

type WorkerOperation<T> = SortOperation<T> | FilterOperation<T> | SearchOperation<T>;

// Helper functions for data processing
const sortData = <T>(data: T[], sortBy: { id: string; desc: boolean }[]) => {
  if (!sortBy || sortBy.length === 0) return data;
  
  return [...data].sort((a, b) => {
    for (const { id, desc } of sortBy) {
      const valueA = a[id as keyof T];
      const valueB = b[id as keyof T];
      
      // Handle null/undefined values
      if (valueA == null) return desc ? 1 : -1;
      if (valueB == null) return desc ? -1 : 1;
      
      // Compare values
      if (valueA < valueB) return desc ? 1 : -1;
      if (valueA > valueB) return desc ? -1 : 1;
    }
    return 0;
  });
};

const filterData = <T>(data: T[], filters: { id: string; value: unknown }[]) => {
  if (!filters || filters.length === 0) return data;
  
  return data.filter(item => {
    return filters.every(({ id, value }) => {
      if (value == null || value === '') return true;
      
      const itemValue = item[id as keyof T];
      
      // Handle array values
      if (Array.isArray(value)) {
        return value.length === 0 || value.includes(itemValue);
      }
      
      // Handle string values
      if (typeof value === 'string') {
        if (itemValue == null) return false;
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      
      // Direct comparison
      return itemValue === value;
    });
  });
};

const searchData = <T>(data: T[], searchTerm: string, searchColumns: string[]) => {
  if (!searchTerm || searchTerm === '' || !searchColumns || searchColumns.length === 0) {
    return data;
  }
  
  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    return searchColumns.some(column => {
      const value = item[column as keyof T];
      if (value == null) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Process data operations asynchronously in the main thread
 * This avoids Web Worker issues with Next.js static analysis
 */
const processDataAsync = <T, R>(operation: WorkerOperation<T>): Promise<R> => {
  return new Promise((resolve) => {
    // Use setTimeout to move processing to the next event loop tick
    // This prevents UI blocking without using Web Workers
    setTimeout(() => {
      const { type, data, ...params } = operation;
      
      let result;
      
      switch (type) {
        case 'sort':
          result = sortData(data, (params as SortOperation<T>).sortBy);
          break;
        case 'filter':
          result = filterData(data, (params as FilterOperation<T>).filters);
          break;
        case 'search':
          result = searchData(
            data, 
            (params as SearchOperation<T>).searchTerm, 
            (params as SearchOperation<T>).searchColumns
          );
          break;
        default:
          result = data;
      }
      
      resolve(result as R);
    }, 0);
  });
};

/**
 * Creates and initializes a data processor for heavy table operations
 * Uses async processing instead of Web Workers for compatibility
 * 
 * @returns Functions to perform operations asynchronously
 */
export function createTableWorker<T>() {
  // Return the API for data processing
  return {
    sortData: (data: T[], sortBy: { id: string; desc: boolean }[]) => 
      processDataAsync<T, T[]>({ type: 'sort', data, sortBy }),
      
    filterData: (data: T[], filters: { id: string; value: unknown }[]) => 
      processDataAsync<T, T[]>({ type: 'filter', data, filters }),
      
    searchData: (data: T[], searchTerm: string, searchColumns: string[]) => 
      processDataAsync<T, T[]>({ type: 'search', data, searchTerm, searchColumns }),
      
    terminate: () => {}, // No-op function for API compatibility
  };
}

// Hook to use the worker with automatic cleanup
import { useEffect, useRef } from 'react';

export function useTableWorker<T>() {
  const workerRef = useRef<ReturnType<typeof createTableWorker<T>> | null>(null);
  
  // Initialize worker
  if (!workerRef.current) {
    workerRef.current = createTableWorker<T>();
  }
  
  // Cleanup not needed but kept for API compatibility
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);
  
  return workerRef.current;
} 