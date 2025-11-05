<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
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
    }: PageProps<Extract<KcContext, { pageId: 'login-reset-otp.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, messagesPerField, configuredOtpCredentials } = kcContext;
    const { msg, msgStr } = $i18n;

    const hasErr = messagesPerField.existsError?.('totp') ?? false;
    const creds = configuredOtpCredentials?.userOtpCredentials ?? [];
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={!hasErr}
>
    {#snippet headerNode()}
        {@render msg('doLogIn')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-20">
                <div class="items-start">

                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('doLogIn')()}</h2>
                            <p class="opacity-70 mb-6">
                                {msgStr('chooseAnAuthenticatorToReset')}
                            </p>

                            <form
                                    id="kc-otp-reset-form"
                                    class="{kcClsx('kcFormClass')} space-y-6"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <!-- Radio list as clickable cards -->
                                <div class="flex flex-col gap-3">
                                    {#each creds as otpCredential, index (otpCredential.id)}
                                        <label
                                                for={`kc-otp-credential-${index}`}
                                                class="group w-full cursor-pointer rounded-2xl border border-base-300/70 bg-base-100/30 hover:bg-base-100/60 transition focus-within:ring-2 focus-within:ring-primary/50 p-4"
                                        >
                                            <div class="flex items-start gap-4">
                                                <!-- Radio -->
                                                <input
                                                        id={`kc-otp-credential-${index}`}
                                                        class="radio radio-primary mt-1"
                                                        type="radio"
                                                        name="selectedCredentialId"
                                                        value={otpCredential.id}
                                                        checked={otpCredential.id === configuredOtpCredentials.selectedCredentialId}
                                                />

                                                <!-- Icon + text -->
                                                <div class="flex items-start gap-3 min-w-0 flex-1">
                          <span class="{kcClsx('kcLoginOTPListItemIconBodyClass')} shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-full bg-base-200/70">
                            <i class="{kcClsx('kcLoginOTPListItemIconClass')} text-base" aria-hidden="true"></i>
                          </span>
                                                    <div class="min-w-0">
                                                        <div class="{kcClsx('kcLoginOTPListItemHeaderClass')} font-semibold leading-relaxed break-words">
                              <span class="{kcClsx('kcLoginOTPListItemTitleClass')}">
                                {otpCredential.userLabel}
                              </span>
                                                        </div>
                                                        <!-- optional helper could go here -->
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    {/each}
                                </div>

                                <!-- Buttons -->
                                <div class="{kcClsx('kcFormGroupClass')}">
                                    <div id="kc-form-buttons" class="{kcClsx('kcFormButtonsClass')} flex justify-end">
                                        <input
                                                id="kc-otp-reset-form-submit"
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                                type="submit"
                                                value={msgStr('doSubmit')}
                                        />
                                    </div>
                                </div>
                            </form>

                            {#if hasErr}
                                <div class="mt-4 text-error text-sm">{@render msg('invalidUserMessage')()}</div>
                            {/if}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
