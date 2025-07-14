export interface User {
  _id: string;
  name: string;
  totalPoints: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointHistory {
  _id: string;
  userId: string;
  userName: string;
  pointsAwarded: number;
  totalPointsAfter: number;
  claimedAt: string;
}

export interface ClaimPointsResponse {
  pointsAwarded: number;
  user: User;
  leaderboard: User[];
}
