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
    }: PageProps<Extract<KcContext, { pageId: 'logout-confirm.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, client, logoutConfirm } = kcContext;
    const { msg, msgStr } = $i18n;

    // Helper to strip « »
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();

    const appUrl = client?.baseUrl ?? '';
    const hasAppUrl = !!appUrl && appUrl !== '#' && appUrl.trim() !== '';
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('logoutConfirmTitle')()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                    {@render msg('logoutConfirmTitle')()}
                </h1>

                <!-- Subtitle -->
                <p class="opacity-80 mb-6">
                    {@render msg('logoutConfirmHeader')()}
                </p>

                <!-- Form -->
                <form class="space-y-4" action={url.logoutConfirmAction} method="POST">
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />

                    <div class="{kcClsx('kcFormGroupClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <input
                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                name="confirmLogout"
                                id="kc-logout"
                                type="submit"
                                value={clean(msgStr('doLogout'))}
                        />
                    </div>
                </form>

                <!-- Back to application (full URL as link text) -->
                {#if !logoutConfirm.skipLink && hasAppUrl}
                    <div id="kc-info-message" class="mt-6">
                        <a href={appUrl} class="link link-primary break-all">{appUrl}</a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</Template>
