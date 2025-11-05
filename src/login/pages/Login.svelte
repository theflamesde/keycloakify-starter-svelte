<script lang="ts">
    import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useState } from '@keycloakify/svelte/tools/useState';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import { clsx } from 'keycloakify/tools/clsx';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import '../index.css';

    // --- Keycloakify required props/setup ---
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
    const { msg, msgStr } = $i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
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
        displayMessage={!messagesPerField.existsError('username', 'password')}
        displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
>
    {#snippet headerNode()}
        {@render msg('loginAccountTitle')()}
    {/snippet}

    {#snippet infoNode()}
        <div id="kc-registration-container" class="mt-6">
            <div id="kc-registration" class="text-center">
        <span class="opacity-80">
          {@render msg('noAccount')()}&nbsp;
          <a tabindex={8} href={url.registrationUrl} class="link link-primary">
            {@render msg('doRegister')()}
          </a>
        </span>
            </div>
        </div>
    {/snippet}

    {#snippet socialProvidersNode()}
        {@const providers = social?.providers}
        {#if realm.password && !!providers && !!providers.length}
            <div id="kc-social-providers" class={kcClsx('kcFormSocialAccountSectionClass')}>
                <div class="divider my-6 opacity-60">{@render msg('identity-provider-login-label')()}</div>
                <ul class={kcClsx('kcFormSocialAccountListClass', providers.length > 3 && 'kcFormSocialAccountListGridClass')}>
                    {#each providers as p (p.providerId)}
                        <li>
                            <a
                                    id={`social-${p.alias}`}
                                    class={kcClsx('kcFormSocialAccountListButtonClass', providers.length > 3 && 'kcFormSocialAccountGridItem', 'btn w-full')}
                                    type="button"
                                    href={p.loginUrl}
                            >
                                {#if p.iconClasses}
                                    <i class={clsx(kcClsx('kcCommonLogoIdP'), p.iconClasses)} aria-hidden="true"></i>
                                {/if}
                                <span class={clsx(kcClsx('kcFormSocialAccountNameClass'), p.iconClasses && 'kc-social-icon-text')}>
                  {@html kcSanitize(p.displayName)}
                </span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    {/snippet}

    <div class="min-h-[100dvh]">
        <!-- Hero section -->
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
                            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">{msgStr('loginTitleHtml', realm.displayNameHtml)}</span>
                        </h1>
                        <p class="mt-4 text-lg text-gray-300">Melde dich an, um Zugriff auf unsere Dienste zu erhalten.</p>
                        <div class="mt-8 flex items-center justify-center lg:justify-start gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">Discord</a>
                            <a href="/posts" class="btn btn-ghost">Posts</a>
                        </div>

                        <img src="/blog_post_leaning.png" alt="Decor" class="hidden lg:block w-[64rem] max-w-none rounded-xl absolute -right-40 -top-10 pointer-events-none opacity-30" />
                    </div>

                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('loginAccountTitle')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('doLogIn')()}</p>

                            <div id="kc-form">
                                <div id="kc-form-wrapper">
                                    {#if realm.password}
                                        <form
                                                id="kc-form-login"
                                                onsubmit={() => { setIsLoginButtonDisabled(true); return true; }}
                                                action={url.loginAction}
                                                method="post"
                                                class="space-y-4"
                                        >
                                            {#if !usernameHidden}
                                                <div class={kcClsx('kcFormGroupClass')}>
                                                    <label for="username" class={kcClsx('kcLabelClass')}>
                                                        {@render (!realm.loginWithEmailAllowed ? msg('username') : !realm.registrationEmailAsUsername ? msg('usernameOrEmail') : msg('email'))()}
                                                    </label>

                                                    <input
                                                            tabindex={2}
                                                            id="username"
                                                            class={kcClsx('kcInputClass', 'input input-bordered w-full')}
                                                            name="username"
                                                            value={login.username ?? ''}
                                                            type="text"
                                                            autofocus
                                                            autocomplete="username"
                                                            aria-invalid={messagesPerField.existsError('username', 'password')}
                                                    />
                                                    {#if messagesPerField.existsError('username', 'password')}
                                                        <span id="input-error" class="{kcClsx('kcInputErrorMessageClass')} text-error" aria-live="polite">
                                                          {@html kcSanitize(messagesPerField.getFirstError('username', 'password'))}
                                                        </span>
                                                    {/if}
                                                </div>
                                                {:else}
                                                <label for="username" class={kcClsx('kcLabelClass')}>
                                                    {@render (!realm.loginWithEmailAllowed ? msg('username') : !realm.registrationEmailAsUsername ? msg('usernameOrEmail') : msg('email'))()}
                                                </label>

                                                <input
                                                        tabindex={2}
                                                        id="username"
                                                        class="{kcClsx('kcInputClass', 'input input-bordered w-full')} "
                                                        name="username"
                                                        value={auth.attemptedUsername ?? ''}
                                                        disabled
                                                        type="text"
                                                        autocomplete="username"
                                                        aria-invalid={messagesPerField.existsError('username', 'password')}
                                                />
                                            {/if}



                                            <div class={kcClsx('kcFormGroupClass')}>
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
                                                            aria-invalid={messagesPerField.existsError('username', 'password')}
                                                    />
                                                </PasswordWrapper>
                                                {#if usernameHidden && messagesPerField.existsError('username', 'password')}
                                                    <span id="input-error" class={kcClsx('kcInputErrorMessageClass')} aria-live="polite">
                                                      {@html kcSanitize(messagesPerField.getFirstError('username', 'password'))}
                                                    </span>
                                                {/if}
                                            </div>

                                            <div class="{kcClsx('kcFormGroupClass', 'kcFormSettingClass')} flex items-center justify-between">
                                                <div id="kc-form-options">
                                                    {#if realm.rememberMe && !usernameHidden}
                                                        <label class="label cursor-pointer gap-2">
                                                            <input tabindex={5} id="rememberMe" name="rememberMe" type="checkbox" checked={!!login.rememberMe} class="checkbox checkbox-primary" />
                                                            <span class="label-text">{@render msg('rememberMe')()}</span>
                                                        </label>
                                                    {/if}
                                                </div>
                                                <div class={kcClsx('kcFormOptionsWrapperClass')}>

                                                    {#if usernameHidden}
                                                        <a tabindex={6} href={url.loginRestartFlowUrl} class="link link text-warning">
                                                            {msgStr('restartLoginTooltip')}
                                                        </a>
                                                    {/if}

                                                    {#if realm.resetPasswordAllowed}
                                                        <a tabindex={6} href={url.loginResetCredentialsUrl} class="link link-primary">
                                                            {@render msg('doForgotPassword')()}
                                                        </a>
                                                    {/if}
                                                </div>
                                            </div>

                                            <div id="kc-form-buttons" class={kcClsx('kcFormGroupClass')}>
                                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                                <input tabindex={7} disabled={$isLoginButtonDisabled} class="btn btn-primary w-full" name="login" id="kc-login" type="submit" value={msgStr('doLogIn')} />
                                            </div>
                                        </form>
                                    {/if}
                                </div>
                            </div>

                            {@render socialProvidersNode?.()}

                            {#if realm.registrationAllowed}
                                {@render infoNode?.()}
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>
