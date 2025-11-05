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
    }: PageProps<Extract<KcContext, { pageId: 'login-config-totp.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
    const { msg, msgStr, advancedMsg } = $i18n;

    const hasTotpErr = messagesPerField.existsError('totp');
    const hasLabelErr = messagesPerField.existsError('userLabel');

    // Helper to strip « »
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={!messagesPerField.existsError('totp', 'userLabel')}
>
    {#snippet headerNode()}
        {@render msg('loginTotpTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <!-- LEFT: Explainer -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('loginTotpTitle')()}
              </span>
                        </h1>

                        <ol id="kc-totp-settings" class="mt-6 space-y-6 text-base leading-7 opacity-90">
                            <li>
                                <p class="mb-2">{@render msg('loginTotpStep1')()}</p>
                                <ul id="kc-totp-supported-apps" class="list-disc pl-6 space-y-1">
                                    {#each totp.supportedApplications as app (app)}
                                        <li>{@render advancedMsg(app)()}</li>
                                    {/each}
                                </ul>
                            </li>

                            {#if mode === 'manual'}
                                <li>
                                    <p class="mb-2">{@render msg('loginTotpManualStep2')()}</p>
                                    <p class="font-mono bg-base-300/60 rounded px-2 py-1 inline-block select-all" id="kc-totp-secret-key">
                                        {totp.totpSecretEncoded}
                                    </p>
                                    <p class="mt-3">
                                        <a href={totp.qrUrl} id="mode-barcode" class="link link-primary">
                                            {@render msg('loginTotpScanBarcode')()}
                                        </a>
                                    </p>
                                </li>
                                <li>
                                    <p class="mb-2">{@render msg('loginTotpManualStep3')()}</p>
                                    <ul class="list-disc pl-6 space-y-1">
                                        <li id="kc-totp-type">
                                            {@render msg('loginTotpType')()}: {@render msg(`loginTotp.${totp.policy.type}`)()}
                                        </li>
                                        <li id="kc-totp-algorithm">
                                            {@render msg('loginTotpAlgorithm')()}: {totp.policy.getAlgorithmKey()}
                                        </li>
                                        <li id="kc-totp-digits">
                                            {@render msg('loginTotpDigits')()}: {totp.policy.digits}
                                        </li>
                                        {#if totp.policy.type === 'totp'}
                                            <li id="kc-totp-period">
                                                {@render msg('loginTotpInterval')()}: {totp.policy.period}
                                            </li>
                                        {:else}
                                            <li id="kc-totp-counter">
                                                {@render msg('loginTotpCounter')()}: {totp.policy.initialCounter}
                                            </li>
                                        {/if}
                                    </ul>
                                </li>
                            {:else}
                                <li>
                                    <p class="mb-4">{@render msg('loginTotpStep2')()}</p>
                                    <img
                                            id="kc-totp-secret-qr-code"
                                            src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                            alt="TOTP QR Code"
                                            class="rounded-xl border border-base-300 max-w-xs w-full mx-auto lg:mx-0"
                                    />
                                    <p class="mt-4">
                                        <a href={totp.manualUrl} id="mode-manual" class="link link-primary">
                                            {@render msg('loginTotpUnableToScan')()}
                                        </a>
                                    </p>
                                </li>
                            {/if}

                            <li>
                                <p class="mb-1">{@render msg('loginTotpStep3')()}</p>
                                <p class="opacity-80">{@render msg('loginTotpStep3DeviceName')()}</p>
                            </li>
                        </ol>
                    </div>

                    <!-- RIGHT: Card with form -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('loginTotpTitle')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('doConfigure')() /* soft subtitle */}</p>

                            <form action={url.loginAction} class="space-y-6" id="kc-totp-settings-form" method="post">
                                <!-- Authenticator code -->
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="totp" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {@render msg('authenticatorCode')()} <span class="required text-error">*</span>
                                    </label>
                                    <input
                                            type="text"
                                            id="totp"
                                            name="totp"
                                            autocomplete="one-time-code"
                                            inputmode="numeric"
                                            pattern="[0-9]*"
                                            class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                            aria-invalid={hasTotpErr}
                                            aria-describedby={hasTotpErr ? 'input-error-otp-code' : undefined}
                                    />
                                    {#if hasTotpErr}
                    <span id="input-error-otp-code" class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block" aria-live="polite">
                      {@html kcSanitize(messagesPerField.get('totp'))}
                    </span>
                                    {/if}
                                </div>

                                <!-- Hidden fields -->
                                <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                                {#if mode}
                                    <!-- BUGFIX: add name="mode" so KC receives it -->
                                    <input type="hidden" id="mode" name="mode" value={mode} />
                                {/if}

                                <!-- Device label -->
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="userLabel" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {@render msg('loginTotpDeviceName')()}
                                        {#if totp.otpCredentials.length >= 1}<span class="required text-error">*</span>{/if}
                                    </label>
                                    <input
                                            type="text"
                                            id="userLabel"
                                            name="userLabel"
                                            autocomplete="off"
                                            class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                            aria-invalid={hasLabelErr}
                                            aria-describedby={hasLabelErr ? 'input-error-otp-label' : undefined}
                                    />
                                    {#if hasLabelErr}
                    <span id="input-error-otp-label" class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block" aria-live="polite">
                      {@html kcSanitize(messagesPerField.get('userLabel'))}
                    </span>
                                    {/if}
                                </div>

                                <!-- Logout other sessions (custom checkbox for perfect alignment) -->
                                <div class="{kcClsx('kcFormGroupClass')}">
                                    <label class="label cursor-pointer gap-3 items-center">
                                        <input id="logout-sessions" name="logout-sessions" type="checkbox" class="checkbox checkbox-primary" value="on" />
                                        <span class="label-text">{@render msg('logoutOtherSessions')()}</span>
                                    </label>
                                </div>

                                <!-- Actions -->
                                <div class="{kcClsx('kcFormGroupClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    <input
                                            type="submit"
                                            class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                            id="saveTOTPBtn"
                                            value={clean(msgStr('doSubmit'))}
                                    />
                                    {#if isAppInitiatedAction}
                                        <button
                                                type="submit"
                                                class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                                id="cancelTOTPBtn"
                                                name="cancel-aia"
                                                value="true"
                                        >
                                            {@render msg('doCancel')()}
                                        </button>
                                    {/if}
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
