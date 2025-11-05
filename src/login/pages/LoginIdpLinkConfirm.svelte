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
    }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, idpAlias } = kcContext;
    const { msg, msgStr } = $i18n;

    // Helper to strip « »
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
    {#snippet headerNode()}
        {@render msg('confirmLinkIdpTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT: Headline -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('confirmLinkIdpTitle')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {@render msg('confirmLinkIdpReviewProfile')()} –
                            {@render msg('confirmLinkIdpContinue', idpAlias)()}
                        </p>

                        <!-- Optional quick links (full URLs as text) -->
                        <div class="mt-8 flex items-center justify-center lg:justify-start gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">Discord</a>
                            <a href="/posts" class="btn btn-ghost">Posts</a>
                        </div>
                    </div>

                    <!-- RIGHT: Card with actions -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('confirmLinkIdpTitle')()}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {@render msg('confirmLinkIdpReviewProfile')()} ·
                                {@render msg('confirmLinkIdpContinue', idpAlias)()}
                            </p>

                            <form id="kc-register-form" action={url.loginAction} method="post" class="space-y-4">
                                <div class="{kcClsx('kcFormGroupClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    <!-- Review profile first -->
                                    <button
                                            type="submit"
                                            class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                            name="submitAction"
                                            id="updateProfile"
                                            value="updateProfile"
                                    >
                                        {@render msg('confirmLinkIdpReviewProfile')()}
                                    </button>

                                    <!-- Or link immediately -->
                                    <button
                                            type="submit"
                                            class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                            name="submitAction"
                                            id="linkAccount"
                                            value="linkAccount"
                                    >
                                        {clean(msgStr('confirmLinkIdpContinue', idpAlias))}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
