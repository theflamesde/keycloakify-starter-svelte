<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import { onMount } from 'svelte';
    import '../index.css';

    const {
        Template, kcContext, i18n, doUseDefaultCss, classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-verify-email.ftl' }>, I18n> = $props();

    const { msgStr, msg } = $i18n;
    const { url, user } = kcContext;

    // Normalize and validate the action
    const rawAction = (url?.loginAction ?? '').trim();
    const hasValidAction = !!rawAction && rawAction !== '#';
    const actionHref: string | undefined = hasValidAction ? rawAction : undefined;

    const pageTitle = msgStr('emailVerifyTitle');

    let canUseHistory = false;
    onMount(() => {
        // Only true in the browser, avoids SSR pitfalls
        canUseHistory = typeof history !== 'undefined' && history.length > 1;
    });

    function reloadPage(e?: Event) {
        e?.preventDefault?.();
        if (typeof location !== 'undefined') location.reload();
    }

    function goBack(e: Event) {
        e.preventDefault();
        if (canUseHistory) {
            history.back();
            return;
        }
        if (actionHref) {
            // If Keycloak gave us a target, prefer that
            window.location.assign(actionHref);
        } else {
            // Absolute last resort
            window.location.assign('/');
        }
    }
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayInfo={true}
>
    {#snippet headerNode()}
        {@render msg('emailVerifyTitle')()}
    {/snippet}

    {#snippet infoNode()}
        <div class="opacity-90">
            <p class="mb-3">
                {@render msg('emailVerifyInstruction2')()}
            </p>

            {#if actionHref}
                <!-- Use POST: more compatible with Keycloak actions -->
                <form action={actionHref} method="post" class="inline-flex gap-2 items-baseline">
                    <button type="submit" class="link link-primary align-baseline">
                        {@render msg('doClickHere')()}
                    </button>
                    <span>&nbsp;{@render msg('emailVerifyInstruction3')()}</span>
                </form>

                <!-- Show the full URL plainly for copy/share -->
                <div class="mt-2 text-xs opacity-75 break-all">
                    {msgStr('doClickHere')}:
                    <a href={actionHref} class="link break-all" rel="noopener noreferrer">{actionHref}</a>
                </div>

                <noscript>
                    <!-- No JS fallback -->
                    <p class="mt-3">
                        <a href={actionHref}>{@render msg('doClickHere')()}</a>
                        &nbsp;{@render msg('emailVerifyInstruction3')()}
                    </p>
                </noscript>
            {:else}
                <!-- Fallback: if Keycloak returned '#' or empty, we can only refresh -->
                <button class="link link-primary" on:click={reloadPage}>
                    {@render msg('doClickHere')()}
                </button>
                &nbsp;{@render msg('emailVerifyInstruction3')()}
                <div class="mt-2 text-xs opacity-75">
                    ({msgStr('doClickHere')} ⇒ Reload)
                </div>
            {/if}
        </div>
    {/snippet}

    <div class="min-h-[60dvh]">
        <section class="relative isolate px-6 pt-10 lg:px-8">
            <div class="mx-auto max-w-3xl py-10 lg:py-14">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                        {pageTitle}
                    </h1>

                    <p class="opacity-90 mb-6">
                        {@render msg('emailVerifyInstruction1', user?.email ?? '')()}
                    </p>

                    <div class="mt-8">
                        <!-- Use anchor for proper semantics, but intercept click -->
                        <a
                                href={actionHref ?? '#'}
                                class="btn btn-primary"
                                on:click={goBack}
                        >
                            {msgStr('doBack')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>
