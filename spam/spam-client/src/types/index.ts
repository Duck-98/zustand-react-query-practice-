export interface Restore {
  restore_date: string;
  restored_name: string;
  subject: string;
  from: string;
  to: string;
}

export interface Block {
  block_date: string;
  blocked_ip: string;
  subject: string;
  from: string;
  to: string;
}

export enum TableType {
  block = 'block',
  restore = 'restore',
}
