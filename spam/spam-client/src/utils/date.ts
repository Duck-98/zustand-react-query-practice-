import type { Block, Restore } from '@/types';

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear() % 100;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const sortByDate = (data, ascending: boolean) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.restore_date || a.block_date);
    const dateB = new Date(b.restore_date || b.block_date);

    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};
