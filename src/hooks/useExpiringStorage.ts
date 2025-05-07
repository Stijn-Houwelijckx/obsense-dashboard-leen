interface StorageData<T> {
  data: T;
  timestamp: number;
}

export const createExpiringStorage = <T>(expirationTime: number) => {
  return {
    getItem: (name: string): string | null => {
      const storedData = localStorage.getItem(name);
      if (!storedData) return null;

      try {
        const data: StorageData<T> = JSON.parse(storedData);
        if (Date.now() - data.timestamp > expirationTime) {
          localStorage.removeItem(name);
          return null;
        }
        return JSON.stringify(data.data);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      const data: StorageData<T> = {
        data: JSON.parse(value),
        timestamp: Date.now(),
      };
      localStorage.setItem(name, JSON.stringify(data));
    },
    removeItem: (name: string): void => {
      localStorage.removeItem(name);
    },
  };
};
