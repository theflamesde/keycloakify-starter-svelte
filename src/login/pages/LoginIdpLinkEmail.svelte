<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-idp-link-email.ftl' }>, I18n> = $props();

    const { url, realm, brokerContext, idpAlias } = kcContext;
    const { msg, msgStr } = $i18n;

    // Optional: strip « »
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('emailLinkIdpTitle', idpAlias)()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT: Headline / context -->
                    <div class="text-center lg:text-left relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('emailLinkIdpTitle', idpAlias)()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg opacity-80">
                            {@render msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)()}
                        </p>

                        <div class="mt-8 flex items-center justify-center lg:justify-start gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-ghost">https://dc.the-flames.de</a>
                            <a href="https://the-flames.de/posts" target="_blank" class="btn btn-ghost">https://the-flames.de/posts</a>
                        </div>
                    </div>

                    <!-- RIGHT: Instructions card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('emailLinkIdpTitle', idpAlias)()}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {realm.displayName}
                            </p>

                            <div class="prose prose-invert max-w-none space-y-4">
                                <p id="instruction1" class="opacity-90">
                                    {@render msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)()}
                                </p>

                                <p id="instruction2" class="opacity-90">
                                    {@render msg('emailLinkIdp2')()}&nbsp;
                                    <br>
                                    <a href={url.loginAction} class="link link-primary break-all">{msgStr('doClickHere')}</a>
                                    &nbsp;{@render msg('emailLinkIdp3')()}
                                </p>

                                <p id="instruction3" class="opacity-90">
                                    {@render msg('emailLinkIdp4')()}&nbsp;
                                    <br>
                                    <a href={url.loginAction} class="link link-primary break-all">{msgStr('doClickHere')}</a>
                                    &nbsp;{@render msg('emailLinkIdp5')()}
                                </p>
                            </div>

                            <!-- Optional primary action to the same URL, for convenience -->
                            <div class="mt-8">
                                <a href={url.loginAction} class="btn btn-primary w-full">
                                    {clean(msgStr('doContinue'))}
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>
