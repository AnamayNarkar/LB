export interface User {
  _id: string;
  name: string;
  totalPoints: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimPointsResponse {
  pointsAwarded: number;
  user: User;
  leaderboard: User[];
}
