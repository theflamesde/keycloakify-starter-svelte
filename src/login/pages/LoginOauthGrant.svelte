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
    }: PageProps<Extract<KcContext, { pageId: 'login-oauth-grant.ftl' }>, I18n> = $props();

    const { url, oauth, client } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = $i18n;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    // Resolve app label for titles
    const appLabel = client.name ? advancedMsgStr(client.name) : client.clientId;

    // Clean helper (if some locales inject « » etc.)
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();

    // Convenience flags/values
    const hasTos = !!client.attributes?.tosUri;
    const hasPolicy = !!client.attributes?.policyUri;
    const scopes = oauth.clientScopesRequested ?? [];
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={false}
>
    {#snippet headerNode()}
    <span>
      {@render (client.name
          ? msg('oauthGrantTitle', appLabel)
          : msg('oauthGrantTitle', client.clientId))()}
    </span>
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">

                    <!-- Title + Logo -->
                    <div class="flex items-center gap-4 mb-4">
                        {#if client.attributes?.logoUri}
                            <img src={client.attributes.logoUri} alt="logo" class="h-10 w-10 rounded-xl object-contain" />
                        {/if}
                        <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight">
                            {@render (client.name
                                ? msg('oauthGrantTitle', appLabel)
                                : msg('oauthGrantTitle', client.clientId))()}
                        </h1>
                    </div>

                    <p class="opacity-80 mb-6">
                        {@render msg('oauthGrantRequest')()}
                    </p>

                    <!-- Requested scopes -->
                    {#if scopes.length > 0}
                        <ul class="list-disc pl-6 space-y-2 mb-6">
                            {#each scopes as clientScope, i (i)}
                                <li class="opacity-90">
                  <span>
                    {@render advancedMsg(clientScope.consentScreenText)()}
                      {#if clientScope.dynamicScopeParameter}
                      : <b>{clientScope.dynamicScopeParameter}</b>
                    {/if}
                  </span>
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    <!-- Policy / ToS -->
                    {#if hasTos || hasPolicy}
                        <div class="divider my-6 opacity-60">{@render (client.name
                            ? msg('oauthGrantInformation', appLabel)
                            : msg('oauthGrantInformation', client.clientId))()}</div>

                        <div class="space-y-3">
                            {#if hasTos}
                                <p class="break-all">
                                    {@render msg('oauthGrantReview')()}
                                    <a href={client.attributes.tosUri} target="_blank" class="link link-primary">
                                        {client.attributes.tosUri}
                                    </a>
                                </p>
                            {/if}
                            {#if hasPolicy}
                                <p class="break-all">
                                    {@render msg('oauthGrantReview')()}
                                    <a href={client.attributes.policyUri} target="_blank" class="link link-primary">
                                        {client.attributes.policyUri}
                                    </a>
                                </p>
                            {/if}
                        </div>
                    {/if}

                    <!-- Actions -->
                    <form action={url.oauthAction} method="POST" class="mt-8">
                        <input type="hidden" name="code" value={oauth.code} />

                        <div class={kcClsx('kcFormGroupClass')}>
                            <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                                <input
                                        class="btn btn-primary"
                                        name="accept"
                                        id="kc-accept"
                                        type="submit"
                                        value={clean(msgStr('doYes'))}
                                />
                                <input
                                        class="btn btn-ghost"
                                        name="cancel"
                                        id="kc-cancel"
                                        type="submit"
                                        value={clean(msgStr('doNo'))}
                                />
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    </div>
</Template>
