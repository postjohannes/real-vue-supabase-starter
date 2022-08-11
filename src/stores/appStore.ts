import { defineStore } from 'pinia';
import { Session } from '@supabase/gotrue-js/dist/main/lib/types';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      initialURL: ref(''),
      supabaseSession: ref<Session | null>(null),
    };
  },
  actions: {
    reset() {
      this.supabaseSession = null;
    },
  },
  getters: {
    userId: (state): string => state.supabaseSession!.user!.id,
    userLastLogin: (state): Date => {
      if (state.supabaseSession?.user?.last_sign_in_at) {
        return new Date(state.supabaseSession!.user!.last_sign_in_at);
      }
      return new Date();
    },
    loginProvider: (state): string => state.supabaseSession!.user!.app_metadata!.provider || '',
  },
});
