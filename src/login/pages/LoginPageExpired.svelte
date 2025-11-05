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

    const restartUrl = url.loginRestartFlowUrl ?? '';
    const continueUrl = url.loginAction ?? '';

    const valid = (u: string) => !!u && u.trim() !== '' && u !== '#';
    const hasRestart = valid(restartUrl);
    const hasContinue = valid(continueUrl);

    // Safe fallback if KC doesn't provide URLs
    const fallbackUrl = '/';
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('pageExpiredTitle')()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                    {@render msg('pageExpiredTitle')()}
                </h1>

                <!-- Explanation (no raw URLs) -->
                <div class="opacity-90 space-y-3">
                    <p>
                        {@render msg('pageExpiredMsg1')() /* “To restart the login process …” base string, used here as context */ }
                    </p>
                    <ul class="list-disc pl-6 space-y-1">
                        <li>{msgStr('pageExpiredPossibleCause1')}</li>
                        <li>{msgStr('pageExpiredPossibleCause2')}</li>
                        <li>{msgStr('pageExpiredPossibleCause3')}</li>
                    </ul>
                    <p class="opacity-80">
                        {@render msg('pageExpiredMsg2')() /* “To continue the login process …” base string, used as guidance */ }
                    </p>
                    <p class="text-sm opacity-70">
                        {#if hasRestart || hasContinue}
                            {msgStr('doTryAgain')}
                        {:else}
                            {msgStr('helpTextFallback')}
                        {/if}
                    </p>
                </div>

                <!-- Actions (buttons only) -->
                <div class="{kcClsx('kcFormGroupClass')} mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    {#if hasRestart}
                        <a href={restartUrl} class="btn btn-ghost" id="btn-restart">
                            {@render msg('restartLoginTooltip')() /* e.g. “Restart login” */}
                        </a>
                    {/if}

                    {#if hasContinue}
                        <a href={continueUrl} class="btn btn-primary" id="btn-continue">
                            {msgStr('doContinue')}
                        </a>
                    {/if}

                    {#if !hasRestart && !hasContinue}
                        <a href={fallbackUrl} class="btn btn-primary" id="btn-fallback">
                            {msgStr('restartLoginTooltip')}
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Template>
