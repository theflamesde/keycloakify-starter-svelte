<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useScript } from '@keycloakify/svelte/login/pages/WebauthnRegister.useScript';
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
    }: PageProps<Extract<KcContext, { pageId: 'webauthn-register.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, isSetRetry, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = $i18n;

    const authButtonId = 'authenticateWebAuthnButton';

    // Initialize Keycloak's WebAuthn registration script.
    useScript({ authButtonId, kcContext, i18n });
</script>

<style>
    .hero-gradient {
        background: radial-gradient(1200px 600px at 80% 10%, rgba(255,64,64,.35), transparent 60%),
        radial-gradient(900px 500px at 10% 20%, rgba(88,101,242,.35), transparent 60%),
        linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.35));
    }
</style>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
    {#snippet headerNode()}
        <span class={kcClsx('kcWebAuthnKeyIcon')}></span>
        {@render msg('webauthn-registration-title')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- Left: Headline / explainer -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
                            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                              {@render msg('webauthn-registration-title')()}
                            </span>
                        </h1>
                        <img src="/blog_post_leaning.png" alt="Decor" class="hidden lg:block w-[64rem] max-w-none rounded-xl absolute -right-40 -top-10 pointer-events-none opacity-30" />
                    </div>

                    <!-- Right: Registration card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('webauthn-registration-title')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('doRegisterSecurityKey')()}</p>

                            <!-- Registration form populated by WebAuthn script -->
                            <form id="register" class="space-y-4" action={url.loginAction} method="post">
                                <!-- Hidden fields that the script will fill -->
                                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                                <input type="hidden" id="attestationObject" name="attestationObject" />
                                <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                                <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                                <input type="hidden" id="transports" name="transports" />
                                <input type="hidden" id="error" name="error" />

                                <!-- Single, explicit checkbox with label (replaces LogoutOtherSessions component) -->
                                <label class="label cursor-pointer gap-2">
                                    <input id="logout-sessions" name="logout-sessions" type="checkbox" class="checkbox checkbox-primary" />
                                    <span class="label-text">{@render msg('logoutOtherSessions')()}</span>
                                </label>

                                <!-- Primary action button with fixed id for KC script -->
                                <input
                                        type="submit"
                                        id={authButtonId}
                                        value={msgStr('doRegisterSecurityKey')}
                                        class="btn btn-primary w-full"
                                />
                            </form>

                            <!-- Optional: Cancel AIA -->
                            {#if !isSetRetry && isAppInitiatedAction}
                                <form action={url.loginAction} class="mt-3" id="kc-webauthn-settings-form" method="post">
                                    <button type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true" class="btn btn-ghost w-full">
                                        {@render msg('doCancel')()}
                                    </button>
                                </form>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>