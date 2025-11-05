<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useScript } from '@keycloakify/svelte/login/pages/WebauthnAuthenticate.useScript';
    import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import { clsx } from 'keycloakify/tools/clsx';
    import type { CxArg } from 'keycloakify/tools/clsx_withTransform';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = $i18n;

    const authButtonId = 'authenticateWebAuthnButton';

    useScript({
        authButtonId,
        kcContext,
        i18n,
    });
</script>

<style>
    :root { --discord-color: 88, 101, 242; }
    .btn-discord { background-color: rgba(var(--discord-color), 1); transition: background-color .3s ease; }
    .btn-discord:hover { background-color: rgba(var(--discord-color), .7); }
    .hero-gradient {
        background: radial-gradient(1200px 600px at 80% 10%, rgba(255,64,64,.35), transparent 60%),
        radial-gradient(900px 500px at 10% 20%, rgba(88,101,242,.35), transparent 60%),
        linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.35));
    }
</style>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayInfo={realm.registrationAllowed && !registrationDisabled}
>
    {#snippet headerNode()}
        {@render msg('webauthn-login-title')()}
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

    <div class="min-h-[100dvh]">
        <!-- Hero section to mirror login.svelte -->
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- Left: Headline -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('webauthn-login-title')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {@html advancedMsgStr?.('webauthn-login-description') ?? ''}
                        </p>

                        <img src="/blog_post_leaning.png" alt="Decor" class="hidden lg:block w-[64rem] max-w-none rounded-xl absolute -right-40 -top-10 pointer-events-none opacity-30" />
                    </div>

                    <!-- Right: WebAuthn Card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('loginAccountTitle')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('webauthn-login-title')()}</p>

                            <div id="kc-form-webauthn" class={kcClsx('kcFormClass')}>
                                <!-- Hidden result form (filled by WebAuthn script) -->
                                <form id="webauth" action={url.loginAction} method="post">
                                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                                    <input type="hidden" id="signature" name="signature" />
                                    <input type="hidden" id="credentialId" name="credentialId" />
                                    <input type="hidden" id="userHandle" name="userHandle" />
                                    <input type="hidden" id="error" name="error" />
                                </form>

                                <div class={clsx(kcClsx('kcFormGroupClass'), 'no-bottom-margin')}>
                                    {#if authenticators}
                                        <!-- Authenticator selection (mirrors KC layout, styled for card) -->
                                        <form id="authn_select" class={kcClsx('kcFormClass')}>
                                            {#each authenticators.authenticators as authenticator (authenticator.credentialId)}
                                                <input type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                                            {/each}
                                        </form>

                                        {#if shouldDisplayAuthenticators}
                                            {#if authenticators.authenticators.length > 1}
                                                <p class="mb-2 font-semibold">{@render msg('webauthn-available-authenticators')()}</p>
                                            {/if}
                                            <div class="flex flex-col gap-3">
                                                {#each authenticators.authenticators as authenticator, i (authenticator.credentialId)}
                                                    <div id={`kc-webauthn-authenticator-item-${i}`} class="flex items-start gap-4 rounded-xl border border-base-300 p-3">
                                                        <div class="text-2xl">
                                                            <i
                                                                    class={clsx(
                                  (() => {
                                    const klass = kcClsx(authenticator.transports.iconClass as CxArg<ClassKey>);
                                    if (klass === authenticator.transports.iconClass) {
                                      return kcClsx('kcWebAuthnDefaultIcon');
                                    }
                                    return klass;
                                  })(),
                                  kcClsx('kcSelectAuthListItemIconPropertyClass'),
                                )}
                                                            ></i>
                                                        </div>
                                                        <div class="flex-1">
                                                            <div id={`kc-webauthn-authenticator-label-${i}`} class="font-semibold">
                                                                {@render advancedMsg(authenticator.label)()}
                                                            </div>
                                                            {#if authenticator.transports.displayNameProperties?.length}
                                                                <div id={`kc-webauthn-authenticator-transport-${i}`} class="text-sm opacity-80">
                                                                    {#each authenticator.transports.displayNameProperties as displayNameProperty, j (displayNameProperty)}
                                                                        {@const hasNext = j !== authenticator.transports.displayNameProperties.length - 1}
                                                                        {@render advancedMsg(displayNameProperty)()}{#if hasNext}<span>, </span>{/if}
                                                                    {/each}
                                                                </div>
                                                            {/if}
                                                            <div class="text-sm opacity-80">
                                <span id={`kc-webauthn-authenticator-createdlabel-${i}`} class="mr-1">
                                  {@render msg('webauthn-createdAt-label')()}
                                </span>
                                                                <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/each}
                                            </div>
                                        {/if}
                                    {/if}

                                    <!-- Action button -->
                                    <div id="kc-form-buttons" class="mt-6">
                                        <!-- svelte-ignore a11y_autofocus -->
                                        <input
                                                id={authButtonId}
                                                type="button"
                                                autofocus
                                                value={msgStr('webauthn-doAuthenticate')}
                                                class="btn btn-primary w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>