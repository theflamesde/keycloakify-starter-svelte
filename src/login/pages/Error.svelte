<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import '../index.css';

    const {
        Template, kcContext, i18n, doUseDefaultCss, classes,
    }: PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n> = $props();

    const { message, client, skipLink } = kcContext;
    const { msgStr } = $i18n;

    // Prefer a real URL; Keycloak sometimes gives '#'
    const rawUrl = client?.baseUrl ?? '';
    const hasValidUrl = !!rawUrl && rawUrl !== '#' && rawUrl.trim() !== '';
    const backUrl: string | undefined = hasValidUrl ? rawUrl : undefined;

    // Locale strings as plain text (no Snippet)
    const backLabel = msgStr('backToApplication');
    const titleText = msgStr('errorTitle');

    function goBack(ev: MouseEvent) {
        ev.preventDefault();
        if (typeof history !== 'undefined' && history.length > 1) {
            history.back();
        } else if (backUrl) {
            window.location.href = backUrl;
        } else {
            window.location.href = '/';
        }
    }
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        <span>{titleText}</span>
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">

                    <!-- Title -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                        {titleText}
                    </h1>

                    <!-- Error message -->
                    <div class="prose prose-invert max-w-none opacity-90">
                        <p>{@html kcSanitize(message.summary)}</p>
                    </div>

                    <!-- Actions -->
                    {#if !skipLink}
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <!-- Always provide a Back button -->
                            <button class="btn btn-primary" on:click={goBack}>
                                {msgStr('doBack')}
                            </button>

                            <!-- Primary action + full URL only if valid -->
                            {#if backUrl}
                                <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                                    <a href={backUrl} class="btn btn-primary">
                                        {backLabel}
                                    </a>
                                    <!-- show full URL as link text -->
                                    <a href={backUrl} class="link link-hover break-all">
                                        {backUrl}
                                    </a>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </section>
    </div>
</Template>
