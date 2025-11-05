<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const props: PageProps<Extract<KcContext, { pageId: 'code.ftl' }>, I18n> = $props();
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { code } = kcContext;
    const { msg, msgStr } = $i18n;

    let copyStatus: 'idle' | 'ok' | 'err' = 'idle';

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(code.code ?? '');
            copyStatus = 'ok';
            setTimeout(() => (copyStatus = 'idle'), 1500);
        } catch {
            // Fallback: select textarea and execCommand
            try {
                const el = document.getElementById('kc-copy-code') as HTMLTextAreaElement | null;
                if (el) {
                    el.focus();
                    el.select();
                    document.execCommand('copy');
                    copyStatus = 'ok';
                    setTimeout(() => (copyStatus = 'idle'), 1500);
                    return;
                }
                copyStatus = 'err';
            } catch {
                copyStatus = 'err';
            }
        }
    }
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {#if code.success}
            {@render msg('codeSuccessTitle')()}
        {:else}
            {@render msg('codeErrorTitle', code.error)()}
        {/if}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                    {#if code.success}
                        {@render msg('codeSuccessTitle')()}
                    {:else}
                        {@render msg('codeErrorTitle', code.error)()}
                    {/if}
                </h1>

                <!-- Success body -->
                {#if code.success}
                    <p class="opacity-80 mb-4">
                        {@render msg('copyCodeInstruction')()}
                    </p>

                    <!-- Readonly code block as textarea (keeps kcTextareaClass, plus DaisyUI) -->
                    <textarea
                            id="kc-copy-code"
                            class="{kcClsx('kcTextareaClass')} textarea textarea-bordered w-full font-mono leading-relaxed"
                            rows="4"
                            readonly
                            on:focus={(e) => (e.currentTarget as HTMLTextAreaElement).select()}
                    >{code.code}</textarea>

                    <!-- Actions -->
                    <div class="mt-4 flex items-center gap-3">
                        <button type="button" class="btn btn-primary" on:click={copyToClipboard}>
                            {msgStr('doCopy') || 'Copy'}
                        </button>

                        <!-- Subtle live feedback -->
                        <span class="text-sm"
                              aria-live="polite">
              {#if copyStatus === 'ok'}
                {msgStr('copyCodeSuccess')}
              {:else if copyStatus === 'err'}
                {msgStr('copyCodeError')}
              {/if}
            </span>
                    </div>

                {:else if code.error}
                    <!-- Error body -->
                    <div id="kc-code" class="prose prose-invert max-w-none">
                        <p id="error" class="text-error">{@html kcSanitize(code.error)}</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</Template>
