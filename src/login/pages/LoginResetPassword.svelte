<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-reset-password.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = $i18n;
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
        displayInfo={true}
        displayMessage={!messagesPerField.existsError('username')}
>
    {#snippet headerNode()}
        {@render msg('emailForgotTitle')()}
    {/snippet}

    {#snippet infoNode()}
        <div class="opacity-90">
            {#if realm.duplicateEmailsAllowed}
                {@render msg('emailInstructionUsername')()}
            {:else}
                {@render msg('emailInstruction')()}
            {/if}
        </div>
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- Left: Headline / quick links -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('emailForgotTitle')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg text-gray-300">
                            {@render msg('emailInstruction')()}
                        </p>

                        <div class="mt-8 flex items-center justify-center lg:justify-start gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">Discord</a>
                            <a href="/posts" class="btn btn-ghost">Posts</a>
                        </div>
                    </div>

                    <!-- Right: Reset card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('emailForgotTitle')()}</h2>
                            <p class="opacity-70 mb-6">
                                {#if realm.duplicateEmailsAllowed}
                                    {@render msg('emailInstructionUsername')()}
                                {:else}
                                    {@render msg('emailInstruction')()}
                                {/if}
                            </p>

                            <form
                                    id="kc-reset-password-form"
                                    class="space-y-4"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="username" class={kcClsx('kcLabelClass')}>
                                        {#if !realm.loginWithEmailAllowed}
                                            {@render msg('username')()}
                                        {:else if !realm.registrationEmailAsUsername}
                                            {@render msg('usernameOrEmail')()}
                                        {:else}
                                            {@render msg('email')()}
                                        {/if}
                                    </label>

                                    <!-- svelte-ignore a11y_autofocus -->
                                    <input
                                            tabindex={1}
                                            type="text"
                                            id="username"
                                            name="username"
                                            class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                            autofocus
                                            value={auth.attemptedUsername ?? ''}
                                            aria-invalid={messagesPerField.existsError('username')}
                                            autocomplete="username"
                                    />

                                    {#if messagesPerField.existsError('username')}
                    <span
                            id="input-error-username"
                            class="{kcClsx('kcInputErrorMessageClass')} text-error"
                            aria-live="polite"
                    >
                      {@html kcSanitize(messagesPerField.get('username'))}
                    </span>
                                    {/if}
                                </div>

                                <div class="flex items-center justify-between">
                                    <a class="link link-primary" href={url.loginUrl}>
                                        {@render msg('backToLogin')()}
                                    </a>
                                </div>

                                <div>
                                    <input
                                            tabindex={2}
                                            class="btn btn-primary w-full"
                                            type="submit"
                                            value={msgStr('doSubmit')}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>
