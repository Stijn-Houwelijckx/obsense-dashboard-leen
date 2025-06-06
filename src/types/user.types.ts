export type User = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isArtist?: boolean;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  profilePicture?: {
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
  };
  tokens?: number;
};
