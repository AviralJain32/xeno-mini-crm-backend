// types.ts
export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
