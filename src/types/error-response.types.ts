export type ErrorResponse = {
  status: string;
  code: number;
  data: {
    message: string;
    details?: string;
  };
};
