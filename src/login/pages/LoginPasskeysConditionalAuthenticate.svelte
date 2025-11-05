<script lang="ts">
    import { useScript } from '@keycloakify/svelte/login/pages/LoginPasskeysConditionalAuthenticate.useScript';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
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
    }: PageProps<Extract<KcContext, { pageId: 'login-passkeys-conditional-authenticate.ftl' }>, I18n> = $props();

    const {
        messagesPerField,
        login,
        url,
        usernameHidden,
        shouldDisplayAuthenticators,
        authenticators,
        registrationDisabled,
        realm,
    } = kcContext;

    const { msg, msgStr, advancedMsg } = $i18n;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const authButtonId = 'authenticateWebAuthnButton';
    useScript({ authButtonId, kcContext, i18n });

    const hasAuthn = authenticators !== undefined && Object.keys(authenticators).length !== 0;
    const list = hasAuthn ? authenticators.authenticators ?? [] : [];
    const hasMultiple = list.length > 1;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('passkey-login-title')()}
    {/snippet}

    {#snippet infoNode()}
        {#if realm.registrationAllowed && !registrationDisabled}
            <div id="kc-registration" class="mt-6 text-center lg:text-left">
        <span class="opacity-80">
          {@render msg('noAccount')()}&nbsp;
          <a tabindex={6} href={url.registrationUrl} class="link link-primary">
            {@render msg('doRegister')()}
          </a>
        </span>
            </div>
        {/if}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <!-- LEFT: Headline / explainer -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('passkey-login-title')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {@render msg('passkey-autofill-select')()}
                        </p>
                    </div>

                    <!-- RIGHT: Glass card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('passkey-login-title')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('doLogIn')()}</p>

                            <!-- Hidden WebAuthn POST form (kept for script) -->
                            <form id="webauth" action={url.loginAction} method="post" class="hidden">
                                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                                <input type="hidden" id="signature" name="signature" />
                                <input type="hidden" id="credentialId" name="credentialId" />
                                <input type="hidden" id="userHandle" name="userHandle" />
                                <input type="hidden" id="error" name="error" />
                            </form>

                            <!-- Available authenticators -->
                            {#if hasAuthn}
                                <form id="authn_select" class="{kcClsx('kcFormClass')} space-y-3">
                                    {#each list as authenticator (authenticator.credentialId)}
                                        <input type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                                    {/each}
                                </form>

                                {#if shouldDisplayAuthenticators}
                                    {#if hasMultiple}
                                        <p class="text-sm opacity-80 mb-2">{@render msg('passkey-available-authenticators')()}</p>
                                    {/if}
                                    <div class="flex flex-col gap-3">
                                        {#each list as authenticator, i (authenticator.credentialId)}
                                            <div
                                                    id={`kc-webauthn-authenticator-item-${i}`}
                                                    class="w-full rounded-2xl border border-base-300/70 bg-base-100/30 hover:bg-base-100/60 transition p-5 focus-within:ring-2 focus-within:ring-primary/50"
                                            >
                                                <div class="flex items-start gap-4">
                                                    <!-- Icon -->
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
                              'text-xl shrink-0'
                            )}
                                                            aria-hidden="true"
                                                    ></i>

                                                    <div class="min-w-0 flex-1">
                                                        <div
                                                                id={`kc-webauthn-authenticator-label-${i}`}
                                                                class="font-semibold leading-relaxed break-words"
                                                        >
                                                            {advancedMsg(authenticator.label)}
                                                        </div>

                                                        {#if authenticator.transports?.displayNameProperties?.length}
                                                            <div
                                                                    id={`kc-webauthn-authenticator-transport-${i}`}
                                                                    class="opacity-80 text-sm leading-relaxed mt-1"
                                                            >
                                                                {#each authenticator.transports.displayNameProperties as nameProperty, j (nameProperty)}
                                                                    <span>{advancedMsg(nameProperty)}</span>{#if j !== authenticator.transports.displayNameProperties.length - 1}<span>, </span>{/if}
                                                                {/each}
                                                            </div>
                                                        {/if}

                                                        <div class="opacity-70 text-xs leading-relaxed mt-1">
                                                            <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>{msg('passkey-createdAt-label')}</span>
                                                            <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            {/if}

                            <!-- Hidden username autofill block (kept for script) -->
                            {#if realm.password}
                                <form
                                        id="kc-form-login"
                                        action={url.loginAction}
                                        method="post"
                                        class="hidden"
                                        on:submit={(event) => {
                    try { (event.currentTarget as HTMLFormElement).login.disabled = true; } catch {}
                    return true;
                  }}
                                >
                                    {#if !usernameHidden}
                                        <div class={kcClsx('kcFormGroupClass')}>
                                            <label for="username" class={kcClsx('kcLabelClass')}>
                                                {msg('passkey-autofill-select')}
                                            </label>
                                            <!-- svelte-ignore a11y_autofocus -->
                                            <input
                                                    tabindex={1}
                                                    id="username"
                                                    aria-invalid={messagesPerField.existsError('username')}
                                                    class={kcClsx('kcInputClass')}
                                                    name="username"
                                                    value={login.username ?? ''}
                                                    autocomplete="username webauthn"
                                                    type="text"
                                                    autofocus
                                            />
                                            {#if messagesPerField.existsError('username')}
                        <span
                                id="input-error-username"
                                class={kcClsx('kcInputErrorMessageClass')}
                                aria-live="polite"
                        >
                          {messagesPerField.get('username')}
                        </span>
                                            {/if}
                                        </div>
                                    {/if}
                                </form>
                            {/if}

                            <!-- Passkey button; script toggles visibility -->
                            <div id="kc-form-passkey-button" class="{kcClsx('kcFormButtonsClass')} hidden mt-6">
                                <!-- svelte-ignore a11y_autofocus -->
                                <input
                                        id={authButtonId}
                                        type="button"
                                        autofocus
                                        value={msgStr('passkey-doAuthenticate')}
                                        class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                />
                            </div>

                            <!-- Registration link rendered by infoNode (already shown on top), optional duplicate here if you prefer -->
                            <!-- {@render infoNode?.()} -->
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
