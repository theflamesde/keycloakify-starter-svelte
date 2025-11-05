<script lang="ts">
    import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import '../index.css';

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-password.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = $i18n;

    // Runes state: prevent double-submit
    let isSubmitting = $state(false);
    function onSubmit() { isSubmitting = true; return true; }
</script>

<style>
    :root { --discord-color: 88, 101, 242; }
    .btn-discord { background-color: rgba(var(--discord-color), 1); transition: background-color .3s ease; }
    .btn-discord:hover { background-color: rgba(var(--discord-color), .7); }
</style>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={!messagesPerField.existsError('password')}
>
    {#snippet headerNode()}
        {@render msg('loginAccountTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- Left: Headline / context -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('doLogIn')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">{@render msg('password')()}</p>

                        <img src="/blog_post_leaning.png" alt="Decor" class="hidden lg:block w-[64rem] max-w-none rounded-xl absolute -right-40 -top-10 pointer-events-none opacity-30" />
                    </div>

                    <!-- Right: Password card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('loginAccountTitle')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('doLogIn')()}</p>

                            <div id="kc-form">
                                <div id="kc-form-wrapper">
                                    <form id="kc-form-login" action={url.loginAction} method="post" class="space-y-4" on:submit={onSubmit}>
                                        <div class="{kcClsx('kcFormGroupClass')}">
                                            <label for="password" class={kcClsx('kcLabelClass')}>
                                                {@render msg('password')()}
                                            </label>
                                            <PasswordWrapper {kcClsx} {i18n} passwordInputId="password">
                                                <input
                                                        tabindex={3}
                                                        id="password"
                                                        class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                                        name="password"
                                                        type="password"
                                                        autocomplete="current-password"
                                                        aria-invalid={messagesPerField.existsError('password')}
                                                />
                                            </PasswordWrapper>
                                            {#if messagesPerField.existsError('password')}
                                                    <span id="input-error" class="{kcClsx('kcInputErrorMessageClass')} text-error" aria-live="polite">
                                                      {@html kcSanitize(messagesPerField.getFirstError('password'))}
                                                    </span>
                                            {/if}
                                        </div>

                                        <div class="{kcClsx('kcFormGroupClass', 'kcFormSettingClass')} flex items-center justify-between">
                                            <div id="kc-form-options"></div>
                                            <div class={kcClsx('kcFormOptionsWrapperClass')}>
                                                {#if realm.resetPasswordAllowed}
                                                    <a tabindex={5} href={url.loginResetCredentialsUrl} class="link link-primary">
                                                        {@render msg('doForgotPassword')()}
                                                    </a>
                                                {/if}
                                            </div>
                                        </div>

                                        <div id="kc-form-buttons" class={kcClsx('kcFormGroupClass')}>
                                            <input
                                                    tabindex={4}
                                                    class="btn btn-primary w-full"
                                                    name="login"
                                                    id="kc-login"
                                                    type="submit"
                                                    value={msgStr('doLogIn')}
                                                    disabled={isSubmitting}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>