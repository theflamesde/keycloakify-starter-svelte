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
    }: PageProps<Extract<KcContext, { pageId: 'login-otp.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { otpLogin, url, messagesPerField } = kcContext;
    const { msg, msgStr } = $i18n;

    const hasError = messagesPerField.existsError('totp');

    // Some realms use non-digit OTP; still hint numeric for common apps
    const otpAriaInvalid = hasError ? true : undefined;

    // Optional helper to strip « » if your locale injects them
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={!hasError}
>
    {#snippet headerNode()}
        {@render msg('doLogIn')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-3xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">

                    <!-- Title -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                        {@render msg('loginOtpOneTime')()}
                    </h1>

                    <!-- Credential chooser (TOTP devices) -->
                    {#if otpLogin.userOtpCredentials.length > 1}
                        <div class="mb-6">
                            <div class="grid sm:grid-cols-2 gap-3">
                                {#each otpLogin.userOtpCredentials as otpCredential, index (otpCredential.id)}
                                    <label
                                            for={`kc-otp-credential-${index}`}
                                            class="cursor-pointer rounded-xl p-4 hover:bg-base-200/60 transition flex items-center gap-3"
                                            tabindex={index}
                                    >
                                        <input
                                                id={`kc-otp-credential-${index}`}
                                                class="radio radio-primary"
                                                type="radio"
                                                name="selectedCredentialId"
                                                value={otpCredential.id}
                                                checked={otpCredential.id === otpLogin.selectedCredentialId}
                                        />
                                        <span class="font-medium">{otpCredential.userLabel}</span>
                                    </label>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Form -->
                    <form
                            id="kc-otp-login-form"
                            class="space-y-5"
                            action={url.loginAction}
                            method="post"
                    >
                        <div>
                            <label for="otp" class="{kcClsx('kcLabelClass')} mb-2 block">
                                {@render msg('loginOtpOneTime')()}
                            </label>

                            <!-- OTP input -->
                            <!-- svelte-ignore a11y_autofocus -->
                            <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    autocomplete="one-time-code"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    class="{kcClsx('kcInputClass')} input input-bordered w-full text-center tracking-[.6em]"
                                    autofocus
                                    aria-invalid={otpAriaInvalid}
                                    aria-describedby={hasError ? 'input-error-otp-code' : undefined}
                            />

                            {#if hasError}
                <span
                        id="input-error-otp-code"
                        class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block"
                        aria-live="polite"
                >
                  {@html kcSanitize(messagesPerField.get('totp'))}
                </span>
                            {/if}
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <!-- Left: restart flow if available -->
                            {#if url.loginRestartFlowUrl}
                                <a href={url.loginRestartFlowUrl} class="link link-warning">{clean(msgStr('restartLoginTooltip'))}</a>
                            {/if}

                            <!-- Right: submit -->
                            <div class="flex gap-3 sm:justify-end">
                                <input
                                        class="btn btn-primary"
                                        name="login"
                                        id="kc-login"
                                        type="submit"
                                        value={clean(msgStr('doLogIn'))}
                                />
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    </div>
</Template>
