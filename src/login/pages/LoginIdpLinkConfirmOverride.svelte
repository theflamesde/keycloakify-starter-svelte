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
    }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm-override.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, idpDisplayName } = kcContext;
    const { msg, msgStr } = $i18n;

    const restartUrl = url.loginRestartFlowUrl ?? '';
    const hasRestart = !!restartUrl && restartUrl.trim() !== '' && restartUrl !== '#';
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('confirmOverrideIdpTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-16 lg:py-24">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                    <!-- Title -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                        {@render msg('confirmOverrideIdpTitle')()}
                    </h1>

                    <!-- Explanation -->
                    <p class="opacity-85 mb-6">
                        {msgStr('confirmOverrideIdpDescription')}
                    </p>

                    <!-- Actions -->
                    <form id="kc-register-form" action={url.loginAction} method="post" class="{kcClsx('kcFormClass')} space-y-6">
                        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <!-- Primary: Continue with the displayed IdP -->
                            <button
                                    type="submit"
                                    class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                    name="submitAction"
                                    id="confirmOverride"
                                    value="confirmOverride"
                            >
                                {@render msg('confirmOverrideIdpContinue', idpDisplayName)()}
                            </button>

                            <!-- Secondary: Restart flow (if available) -->
                            {#if hasRestart}
                                <a
                                        id="loginRestartLink"
                                        class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                        href={restartUrl}
                                >
                                    {msgStr('restartLoginTooltip') || 'Restart login'}
                                </a>
                            {/if}
                        </div>

                        <!-- Full URL display (your preference: show links as full URLs) -->
                        {#if hasRestart}
                            <div class="text-sm opacity-75 break-all sm:text-right">
                                <a id="loginRestartLink-url" href={restartUrl} class="link link-primary">{restartUrl}</a>
                            </div>
                        {/if}
                    </form>
                </div>
            </div>
        </section>
    </div>
</Template>
