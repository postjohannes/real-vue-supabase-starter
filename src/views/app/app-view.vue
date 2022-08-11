<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NA, NButton, NDivider, NDropdown, NPageHeader, NSpace, NIcon, useMessage } from 'naive-ui';
import { handleSignOut } from '@/services/AuthService';
import ProfileSettings from '@/components/ProfileSettings.vue'
import Logo from '@/components/Logo.vue';
import { createProfile, hasSupabaseEntry } from '@/services/ProfileService';
import { useAppStore } from '@/stores/appStore';
import { useProfileStore } from '@/stores/profileStore';
import {Heart, Moon, Sun} from '@vicons/fa';
import { isDark, toggleDark } from '@/composables';

export default defineComponent({
  components: {
    ProfileSettings,
    Logo,
    NPageHeader,
    NSpace,
    NButton,
    NA,
    NDivider,
    NDropdown,
  },
  setup() {
    const router = useRouter();
    const message = useMessage()
    const currentYear = new Date().getFullYear();
    const activeNav = ref('');
    const navLinks = [
      {
        key: 'dashboard',
        label: 'Dashboard'
      },
      {
        key: 'profile',
        label: 'Profile'
      },
    ]

    const settingsVisible = ref(false)
    const moreOptions = [
      {
        label: 'Toggle theme',
        key: 'toggle_theme'
      },
      {
        label: 'Settings',
        key: 'settings'
      }
    ]

    const navActive = (type: any) => {
      if (router.currentRoute.value.name === type) {
        return '#f48120';
      }
      return '';
    };

    const navClicked = (type: string) => {
      activeNav.value = type;
      switch (type) {
        case 'dashboard':
          router.push('/dashboard');
          break;
        case 'profile':
          router.push('/profile');
          break;
        case 'settings':
          settingsVisible.value = !settingsVisible.value
          break;
        case 'toggle_theme':
          toggleDark()
          break;
        case 'sign_out':
          handleSignOut();
          router.push('/');
          break;
        default:
          break;
      }
    };

    const closeSettings = (value: boolean) => {
      settingsVisible.value = value
    }

    onMounted(async () => {
      const appStore = useAppStore();
      const session = appStore.supabaseSession
      const profileStore = useProfileStore()
      if (session && !profileStore.initialized && !await hasSupabaseEntry(appStore.userId || '')) {
        const error = await createProfile(appStore.loginProvider, appStore.userLastLogin)
        if (error)
          message.error(`Something went wrong: ${error.message}`)
        else
          message.info('This is your first login. Please take some time to complete your profile.');
        router.push('/profile');
      }
    })

    return {
      currentYear,
      navLinks,
      navActive,
      navClicked,
      moreOptions,
      settingsVisible,
      closeSettings,
      toggleDark
    };
  }
});
</script>

<template>
  <n-page-header>
    <n-divider/>

    <slot/>

    <template #title>
      <router-link to="/">
        <logo class="logo"/>
      </router-link>
    </template>

    <template #extra>
      <n-space>
        <n-button
            v-for="nav in navLinks"
            :key="nav.key"
            :text-color="navActive(nav.key)"
            :bordered="false"
            @click="navClicked(nav.key)"
        >
          <b>{{ nav.label }}</b>
        </n-button>
        <n-dropdown
            placement="bottom-end"
            :options="moreOptions"
            @select="navClicked">
          <n-button
              :bordered="false">
            <b>More</b>
          </n-button>
        </n-dropdown>
        <n-button type="error" dashed @click="navClicked('sign_out')">
          <b>Sign Out</b>
        </n-button>
      </n-space>
    </template>

    <template #footer>
      <div class="footer">
        <a href="https://spdx.org/licenses/GPL-3.0-or-later.html">GPL-3.0-or-later</a> &copy;
        {{ currentYear }}
        <span>
          Build with <n-icon color="red"><heart/></n-icon> by
          <n-a href="https://github.com/postjohannes" target="_blank">me</n-a>
        </span>
      </div>
    </template>
  </n-page-header>
  <profile-settings :active="settingsVisible" @close="closeSettings"/>
</template>

<style lang="scss" scoped>
.logo {
  height: 72px;
}
.header-button {
  padding: 0 4px;
}
.footer {
  padding-top: 40px;
}
</style>
