import { defineStore } from 'pinia';
import { Profile } from '@/domain/Profile';

export const useProfileStore = defineStore('Profile', {
  state: () => ({
    profile: {} as Profile,
  }),
  actions: {
    update(profile: Profile) {
      this.profile = profile;
    }
  },
  getters: {
    initialized: (state) => state.profile?.lastLogin,
  }
});
