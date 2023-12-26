export interface User {
  email?: string | null;
  image?: string | null;
  name?: string | null;
}

export interface Session {
  user?: User | null;
  customAccessToken?: string;
  expires: string;
}
