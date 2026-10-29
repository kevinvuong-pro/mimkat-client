import { Session, PaginatedData, SuccessResponse } from '../';

// Responses
interface GetSessionsResponse extends SuccessResponse<PaginatedData<Session>> {}

export type {
  // Responses
  GetSessionsResponse,
};
