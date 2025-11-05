<script lang="ts">
  import './index.css';
  import Template from './Template.svelte';
  import UserProfileFormFields from './components/UserProfileFormFields.svelte';
  import type { KcContext } from 'keycloakify/login/KcContext';
  import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
  import type { Component } from 'svelte';
  import { useI18n } from './i18n';

  const { kcContext }: { kcContext: KcContext } = $props();

  const { i18n } = useI18n({ kcContext });

  const classes = {} satisfies { [key in ClassKey]?: string };
  const doMakeUserConfirmPassword = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = async (): Promise<{ default?: Component<any> }> => {
    switch (kcContext.pageId) {
        case 'login.ftl':
            return import('./pages/Login.svelte');
        case 'login-reset-password.ftl':
            return import('./pages/LoginResetPassword.svelte');
        case 'register.ftl':
            return import('./pages/Register.svelte');
        case 'info.ftl':
            return import('./pages/Info.svelte');
        case 'error.ftl':
            return import('./pages/Error.svelte');
        case 'login-verify-email.ftl':
            return import('./pages/LoginVerifyEmail.svelte');
        case 'terms.ftl':
            return import('./pages/Terms.svelte');
        case 'login-username.ftl':
            return import('./pages/LoginUsername.svelte');
        case 'login-password.ftl':
            return import('./pages/LoginPassword.svelte');
        case 'webauthn-authenticate.ftl':
            return import('./pages/WebauthnAuthenticate.svelte');
        case 'webauthn-register.ftl':
            return import('./pages/WebauthnRegister.svelte');
        case 'login-oauth2-device-verify-user-code.ftl':
            return import('./pages/LoginOauth2DeviceVerifyUserCode.svelte');
        case 'login-oauth-grant.ftl':
            return import('./pages/LoginOauthGrant.svelte');
        case 'login-otp.ftl':
            return import('./pages/LoginOtp.svelte');
        case 'login-update-profile.ftl':
            return import('./pages/LoginUpdateProfile.svelte');
        case 'login-update-password.ftl':
            return import('./pages/LoginUpdatePassword.svelte');
        case 'login-idp-link-confirm.ftl':
            return import('./pages/LoginIdpLinkConfirm.svelte');
        case 'login-idp-link-email.ftl':
            return import('./pages/LoginIdpLinkEmail.svelte');
        case 'login-page-expired.ftl':
            return import('./pages/LoginPageExpired.svelte');
        default:
            return import('@keycloakify/svelte/login/DefaultPage.svelte');
    }
  };
</script>

{#await page() then { default: Page }}
  <Page
    {kcContext}
    {i18n}
    {classes}
    {Template}
    {UserProfileFormFields}
    doUseDefaultCss={false}
    {doMakeUserConfirmPassword}
  ></Page>
{/await}
