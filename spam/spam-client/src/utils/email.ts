export const getEmailDomain = (email: string) => {
  if (email) {
    const parts = email.split('@');
    if (parts.length === 2) {
      return parts[1];
    }
  }
  return '';
};
