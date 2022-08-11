<template>
  <public-view>
    <div id="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <logo/>
        <h1>Sign Up</h1>
        <n-form-item path="email" label="Email" autocomplete="email">
          <n-input v-model:value="model.email" placeholder="Enter Email" @keydown.enter="handleValidateButtonClick"/>
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
              v-model:value="model.password"
              type="password"
              placeholder="Enter Password"
              show-password-on="mousedown"
              @keydown.enter="handleValidateButtonClick"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button round type="primary" @click="handleValidateButtonClick">
            <span v-if="model.password">Sign Up</span>
            <span v-else>Send Magic Link</span>
          </n-button>
        </div>
        <n-button
            text
            tag="a"
            type="primary"
            @click="goToLogin"
        >
          Or go to login
        </n-button>
        <n-divider title-placement="left">Or signup using</n-divider>
        <o-auth-login/>
      </n-form>
    </div>
  </public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignup } from '@/services/AuthService';
import { NButton, NDivider, NForm, NFormItem, NInput, useMessage } from 'naive-ui';
import Logo from '@/components/Logo.vue';
import OAuthLogin from "@/components/OAuthLogin.vue";
import { router } from '@/router';
import { useAppStore } from '@/stores/appStore';

export default defineComponent({
  name: 'Auth',
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDivider,
    OAuthLogin,
    Logo
  },
  setup() {
    const message = useMessage();
    const messageDuration = 5000;

    const appStore = useAppStore();

    const formRef = ref();

    const modelRef = ref({
      email: '',
      password: '',
    });

    const rules = {
      email: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('Email is required');
            } else if (
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                    value
                )
            ) {
              return new Error('Please enter a valid email address');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      password: [
        {
          validator(rule: any, value: any) {
            if (value && value.length < 8) {
              return new Error('Password to short');
            } else if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/.test(value)) {
              return new Error('Password must have a minimum of eight characters, at least one letter and one number');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
    };

    function handleValidateButtonClick(e: any) {
      e.preventDefault();
      if (formRef.value) {
        formRef.value.validate(async (error: any) => {
          if (!error) {
            try {
              const {error} = await handleSignup({
                email: modelRef.value.email,
                password: modelRef.value.password,
              });
              if (error) throw error;
            } catch (error) {
              message.error(`Error signing up: ${error}`, {duration: messageDuration});
            }
          } else {
            modelRef.value.email = '';
            modelRef.value.password = '';
            message.error('Please confirm your sign up details ...', {duration: messageDuration});
          }
        });
      }
    }

    function goToLogin() {
      router.push('/')
    }

    return {
      formRef,
      model: modelRef,
      rules, goToLogin,
      handleValidateButtonClick,
    };
  },
});
</script>

<style scoped>
#content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

form {
  width: 400px;
}

input {
  text-align: center;
  font-size: 20px;
}

h1 {
  text-align: left;
}
</style>
