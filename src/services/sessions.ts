import { apiClient } from '@/lib/api-client';
import { GetSessionsResponse } from '@/types';
import { handleApiError } from '@/lib/error-handler';

const getSessions = async () => {
  try {
    const endpoint = '/users/sessions';

    const response: GetSessionsResponse = await apiClient.get(endpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { getSessions };
