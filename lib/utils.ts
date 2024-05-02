import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserDetails = () => {
  const userDetaisString = sessionStorage.getItem('userDetails');
  if (userDetaisString)
  {
    const userDetails = JSON.parse(userDetaisString);
    return userDetails;
  }
}
