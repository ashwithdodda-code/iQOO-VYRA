import { UserProfile, PerformanceDNA } from '../types';
import { mockUserProfile, mockPerformanceDNA } from '../data/mockProfile';

let profile: UserProfile = { ...mockUserProfile };
let dna: PerformanceDNA = { ...mockPerformanceDNA };

export const profileService = {
  getProfile(): UserProfile {
    return profile;
  },

  getDNA(): PerformanceDNA {
    return dna;
  },

  updateFromSession(): void {
    profile.totalSessions += 1;
  },

  getInsights(): string[] {
    return dna.insights;
  },
};
