export interface Restore {
  restore_data: string;
  subject: string;
  from: string;
  to: string;
  restored_name: string;
}

export interface Block {
  block_date: string;
  blocked_ip: string;
  subject: string;
  from: string;
  to: string;
}
