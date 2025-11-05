<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template, kcContext, i18n, doUseDefaultCss, classes,
    }: PageProps<Extract<KcContext, { pageId: 'terms.ftl' }>, I18n> = $props();

    const { msgStr } = $i18n;
    const { url } = kcContext;

    const titleHtml = kcSanitize(msgStr('termsTitle'));
    const termsHtml = kcSanitize(msgStr('termsText'));
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();

    // Runes mode state/derived
    let accepted = $state(false);
    const isDisabled = $derived(!accepted);

    function onSubmit(ev: Event) {
        if (!accepted) ev.preventDefault();
    }

    function onAgreeChange(ev: Event) {
        const el = ev.currentTarget as HTMLInputElement;
        accepted = !!el?.checked;
    }
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        <span>{@html titleHtml}</span>
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                        {@html titleHtml}
                    </h1>

                    <div class="prose prose-invert max-w-none opacity-90 mb-8">
                        {@html termsHtml}
                    </div>

                    <form class="mt-6 flex flex-col gap-5" action={url.loginAction} method="POST" on:submit={onSubmit}>
                        <label class="flex items-center gap-3 select-none">
                            <input
                                    id="agree"
                                    type="checkbox"
                                    class="checkbox checkbox-primary"
                                    on:change={onAgreeChange}
                                    required
                            />
                            <span class="leading-tight">
                {clean(msgStr('acceptTerms') || 'I have read and accept the Terms.')}
              </span>
                        </label>

                        <button
                                class="btn btn-primary"
                                type="submit"
                                name="accept"
                                value="accept"
                                disabled={isDisabled}
                                title={isDisabled ? clean(msgStr('acceptTerms') || 'Please accept the Terms first') : clean(msgStr('doAccept'))}
                        >
                            {clean(msgStr('doAccept'))}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    </div>
</Template>
