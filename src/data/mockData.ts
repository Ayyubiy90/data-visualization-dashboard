import { DataPoint } from '../types/data';

export const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const startDate = new Date('2024-01-01');

  for (let i = 0; i < 90; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    data.push({
      date: currentDate.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 10000,
      users: Math.floor(Math.random() * 1000) + 200,
      orders: Math.floor(Math.random() * 500) + 100,
    });
  }

  return data;
};