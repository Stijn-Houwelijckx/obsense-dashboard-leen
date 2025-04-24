export type User = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist?: boolean;
  profilePicture?: {
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
  };
  tokens?: number;
};
