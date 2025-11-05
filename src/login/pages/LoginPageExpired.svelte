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
    }: PageProps<Extract<KcContext, { pageId: 'login-page-expired.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url } = kcContext;
    const { msg, msgStr } = $i18n;

    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();

    const restartUrl = url.loginRestartFlowUrl;
    const continueUrl = url.loginAction;

    const hasRestart = !!restartUrl && restartUrl !== '#' && restartUrl.trim() !== '';
    const hasContinue = !!continueUrl && continueUrl !== '#' && continueUrl.trim() !== '';
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('pageExpiredTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT: Headline / explainer -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('pageExpiredTitle')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {@render msg('pageExpiredMsg1')()}
                        </p>
                    </div>

                    <!-- RIGHT: Card with actions + full URLs -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('pageExpiredTitle')()}
                            </h2>
                            <div class="prose prose-invert max-w-none opacity-90">
                                <p id="instruction1" class="mb-4">
                                    {@render msg('pageExpiredMsg1')()}
                                    {#if hasRestart}
                                        &nbsp;<a id="loginRestartLink" href={restartUrl} class="link link-primary break-all">{restartUrl}</a>.
                                    {/if}
                                </p>
                                <p id="instruction2">
                                    {@render msg('pageExpiredMsg2')()}
                                    {#if hasContinue}
                                        &nbsp;<a id="loginContinueLink" href={continueUrl} class="link link-primary break-all">{continueUrl}</a>.
                                    {/if}
                                </p>
                            </div>

                            <!-- Buttons -->
                            <div class="{kcClsx('kcFormGroupClass')} mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                                {#if hasRestart}
                                    <a href={restartUrl} class="btn btn-ghost">{clean(msgStr('doClickHere'))} — {@render msg('restartLoginTooltip')()}</a>
                                {/if}
                                {#if hasContinue}
                                    <a href={continueUrl} class="btn btn-primary">{clean(msgStr('doClickHere'))}</a>
                                {/if}
                            </div>

                            <!-- Optional: show both URLs again below as plain links if you want them super visible -->
                            <div class="mt-4 space-y-2">
                                {#if hasRestart}
                                    <a href={restartUrl} class="link link-hover break-all">{restartUrl}</a>
                                {/if}
                                {#if hasContinue}
                                    <a href={continueUrl} class="link link-hover break-all">{continueUrl}</a>
                                {/if}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
