export interface App {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}