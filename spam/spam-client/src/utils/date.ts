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

export const sortByDate = (data: (Block | Restore)[], ascending: boolean) => {
  return data.sort((a, b) => {
    const aIsBlock = 'block_date' in a;
    const bIsBlock = 'block_date' in b;

    const dateA = new Date(aIsBlock ? (a as Block).block_date : (a as Restore).restore_date);
    const dateB = new Date(bIsBlock ? (b as Block).block_date : (b as Restore).restore_date);

    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};
