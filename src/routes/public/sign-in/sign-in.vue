<template>
  <public-view>
    <div id="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <logo/>
        <h1>Sign In</h1>
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
            <span v-if="model.password">Sign In</span>
            <span v-else>Send Magic Link</span>
          </n-button>
        </div>
        <n-button
            text
            tag="a"
            type="primary"
            @click="goToSignUp"
        >
          Or go to signup
        </n-button>
        <n-divider title-placement="left">Or continue with</n-divider>
        <o-auth-login/>
      </n-form>
    </div>
  </public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignIn } from '@/services/AuthService';
import { NButton, NDivider, NForm, NFormItem, NInput, useMessage } from 'naive-ui';
import { router } from '@/router';
import Logo from '@/components/Logo.vue';
import OAuthLogin from "@/components/OAuthLogin.vue";

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
              return new Error('Invalid Password');
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
              const {error, user} = await handleSignIn({
                email: modelRef.value.email,
                password: modelRef.value.password,
              });
              if (error && error.message === 'Invalid login credentials') {
                message.error(`Error signing in: ${error.message}`, {duration: messageDuration});
                return;
              }
              if (error) throw error;
              if (user) {
                router.push('/dashboard');
              } else {
                message.success('Magic Link is sent to your email!', {duration: messageDuration});
              }
            } catch (error) {
              message.error('Error signing in ...', {duration: messageDuration});
            }
          } else {
            message.error('Please confirm your sign in details ...', {duration: messageDuration});
          }
        });
      }
    }

    function goToSignUp() {
      router.push('signup')
    }

    return {
      formRef,
      model: modelRef,
      rules, goToSignUp,
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
