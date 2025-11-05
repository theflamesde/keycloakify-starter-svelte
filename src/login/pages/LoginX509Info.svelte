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
    }: PageProps<Extract<KcContext, { pageId: 'login-x509-info.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, x509 } = kcContext;
    const { msg, msgStr } = $i18n;

    const hasCert = !!x509.formData.subjectDN;
    const userEnabled = !!x509.formData.isUserEnabled;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {msgStr('doLogIn')}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <!-- LEFT: Headline / explainer -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {msgStr('clientCertificate')}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {msgStr('doX509Login') /* “Login with client certificate” */}
                        </p>
                    </div>

                    <!-- RIGHT: Glass card with certificate details -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {msgStr('doLogIn')}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {msgStr('clientCertificate')}
                            </p>

                            <form
                                    id="kc-x509-login-info"
                                    class="{kcClsx('kcFormClass')} space-y-6"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <!-- Subject DN -->
                                <div class="{kcClsx('kcFormGroupClass')}">
                                    <label for="certificate_subjectDN" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {msgStr('clientCertificate')}
                                    </label>

                                    {#if hasCert}
                                        <label id="certificate_subjectDN" class="{kcClsx('kcLabelClass')} block font-mono break-words opacity-90">
                                            {x509.formData.subjectDN}
                                        </label>
                                    {:else}
                                        <label id="certificate_subjectDN" class="{kcClsx('kcLabelClass')} block opacity-70">
                                            {msgStr('noCertificate')}
                                        </label>
                                    {/if}
                                </div>

                                <!-- Suggested username (if mapped and enabled) -->
                                {#if userEnabled}
                                    <div class="{kcClsx('kcFormGroupClass')}">
                                        <label for="username" class="{kcClsx('kcLabelClass')} mb-2 block">
                                            {msgStr('doX509Login')}
                                        </label>
                                        <!-- svelte-ignore a11y_label_has_associated_control -->
                                        <label id="username" class="{kcClsx('kcLabelClass')} block font-medium">
                                            {x509.formData.username}
                                        </label>
                                    </div>
                                {/if}

                                <!-- Actions -->
                                <div class="{kcClsx('kcFormGroupClass')}">
                                    <div id="kc-form-buttons" class="{kcClsx('kcFormButtonsClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <input
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                                name="login"
                                                id="kc-login"
                                                type="submit"
                                                value={msgStr('doContinue')}
                                        />
                                        {#if userEnabled}
                                            <input
                                                    class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                                    name="cancel"
                                                    id="kc-cancel"
                                                    type="submit"
                                                    value={msgStr('doIgnore')}
                                            />
                                        {/if}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
