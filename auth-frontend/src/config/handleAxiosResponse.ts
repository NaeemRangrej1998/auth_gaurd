import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleAxiosResponse = (error: AxiosError) => {
  // Extract error message from the response data if available
  const responseData = error.response?.data as any;
  const errorMessage = responseData?.message || error.message || 'An unexpected error occurred';
  
  // Display the error using react-hot-toast
  toast.error(errorMessage);
};
