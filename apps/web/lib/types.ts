export interface Project {
  id: string;
  name: string;
  repoFullName: string;
  defaultBranch: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
}
