<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template, kcContext, i18n, doUseDefaultCss, classes,
    }: PageProps<Extract<KcContext, { pageId: 'info.ftl' }>, I18n> = $props();

    const { msgStr, advancedMsgStr } = $i18n;

    const {
        messageHeader, message, requiredActions, skipLink,
        pageRedirectUri, actionUri, client
    } = kcContext;

    // Build info HTML
    const infoHtml = (() => {
        let html = message.summary;
        if (requiredActions?.length) {
            const list = requiredActions
                .map(ra => advancedMsgStr(`requiredAction.${ra}`))
                .join(', ');
            html += ` <b>${list}</b>`;
        }
        return html;
    })();

    // Resolve target URL (avoid '#')
    const rawUrl = pageRedirectUri ?? actionUri ?? client?.baseUrl ?? '';
    const hasValidUrl = !!rawUrl && rawUrl !== '#' && rawUrl.trim() !== '';
    const backUrl: string | undefined = hasValidUrl ? rawUrl : undefined;

    // Button label (plain string)
    const primaryLabel =
        pageRedirectUri || client?.baseUrl
            ? msgStr('backToApplication')
            : msgStr('proceedWithAction');

    // Optional: if your locale injects « », strip them
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();

    function goBack(ev: MouseEvent) {
        ev.preventDefault();
        // Prefer native history if available
        if (typeof history !== 'undefined' && history.length > 1) {
            history.back();
        } else if (backUrl) {
            // Fallback to resolved URL
            window.location.href = backUrl;
        } else {
            // Last resort: go to root
            window.location.href = '/';
        }
    }
</script>


<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        <span>{@html kcSanitize(messageHeader ?? message.summary)}</span>
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">

                    <!-- Title -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                        {@html kcSanitize(messageHeader ?? message.summary)}
                    </h1>

                    <!-- Body -->
                    <div class="prose prose-invert max-w-none opacity-90">
                        <p>{@html kcSanitize(infoHtml)}</p>
                    </div>

                    <!-- Actions -->
                    {#if !skipLink}
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <!-- Left: Back button always available -->
                            <button class="btn btn-primary" on:click={goBack}>
                                {clean(msgStr('doBack'))}
                            </button>

                            <!-- Right: URL + primary action only if valid -->
                            {#if backUrl}
                                <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                                    <a href={backUrl} class="btn btn-primary">
                                        {clean(primaryLabel)}
                                    </a>
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
