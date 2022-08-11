<script setup lang="ts">
import { handleOAuthLogin } from "@/services/AuthService";
import { NButton, NIcon, NSpace, useMessage } from 'naive-ui';
import { Facebook, Google, Twitter } from '@vicons/fa';

const message = useMessage();
const messageDuration = 5000;

async function oauthLogin(provider: any) {
  try {
    const {error} = await handleOAuthLogin(provider);
    if (error) throw error;
  } catch (error) {
    message.error('Error authenticating with ' + provider + '...', {duration: messageDuration});
  }
}
</script>

<template>
  <n-space justify="space-around">
    <n-button @click="oauthLogin('facebook')">
      <template #icon>
        <n-icon>
          <facebook/>
        </n-icon>
      </template>
      Facebook
    </n-button>
    <n-button @click="oauthLogin('google')">
      <template #icon>
        <n-icon>
          <google/>
        </n-icon>
      </template>
      Google
    </n-button>
    <n-button @click="oauthLogin('twitter')">
      <template #icon>
        <n-icon>
          <twitter/>
        </n-icon>
      </template>
      Twitter
    </n-button>
  </n-space>
</template>

<style scoped>

</style>