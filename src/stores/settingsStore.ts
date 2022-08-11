import { defineStore } from 'pinia';
import { ProfileSettings as Settings } from '@/domain/ProfileSettings';

export const useProfileSettingsStore = defineStore({
  id:'ProfileSettings',
  state: () => ({
    initialized: false,
    settings: {
      email: '',
      displayName: '',
      newsletterSubscribe: true
    }
  }),
  actions: {
    init(settings: Settings) {
      this.initialized = true
      this.settings = settings
    },
    update(settings: Settings) {
      this.settings = settings
    },
  }
})
