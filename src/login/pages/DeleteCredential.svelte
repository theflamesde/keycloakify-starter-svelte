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
    }: PageProps<Extract<KcContext, { pageId: 'delete-credential.ftl' }>, I18n> = $props();

    const { msgStr, msg } = $i18n;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, credentialLabel } = kcContext;

    // Helper to strip « » if present
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('deleteCredentialTitle', credentialLabel)()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title (once) -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                    {@render msg('deleteCredentialTitle', credentialLabel)()}
                </h1>

                <!-- Explanation -->
                <p id="kc-delete-text" class="opacity-85 mb-6">
                    {@render msg('deleteCredentialMessage', credentialLabel)()}
                </p>

                <!-- Actions -->
                <form class="{kcClsx('kcFormClass')} flex flex-col sm:flex-row gap-3 sm:justify-end" action={url.loginAction} method="POST">
                    <input
                            class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                            name="accept"
                            id="kc-accept"
                            type="submit"
                            value={clean(msgStr('doConfirmDelete'))}
                    />
                    <!-- BUGFIX: cancel-aia must be 'true' -->
                    <button
                            class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                            name="cancel-aia"
                            value="true"
                            id="kc-decline"
                            type="submit"
                    >
                        {@render msg('doCancel')()}
                    </button>
                </form>
            </div>
        </div>
    </div>
</Template>
