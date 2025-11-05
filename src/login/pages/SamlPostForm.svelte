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
    }: PageProps<Extract<KcContext, { pageId: 'saml-post-form.ftl' }>, I18n> = $props();

    const { msgStr, msg } = $i18n;
    const { samlPost } = kcContext;

    let htmlFormElement: HTMLFormElement | null = $state(null);

    $effect(() => {
        if (htmlFormElement === null) return;

        // Storybook / dev hint: don't auto-post when the target is a dummy "#"
        if (samlPost.url === '#') {
            alert('In a real Keycloak the user would be redirected immediately');
            return;
        }
        htmlFormElement.requestSubmit();
    });
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('saml.post-form.title')()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                    {@render msg('saml.post-form.title')()}
                </h1>

                <!-- Body -->
                <p class="opacity-80 mb-6">
                    {@render msg('saml.post-form.message')()}
                </p>

                <!-- (Optional) show destination as full URL for transparency -->
                {#if samlPost.url && samlPost.url !== '#'}
                    <p class="text-sm opacity-70 break-all mb-4">
                        {@render msg('backToApplication')()}:
                        <a href={samlPost.url} class="link link-primary break-all">{samlPost.url}</a>
                    </p>
                {/if}

                <!-- Auto-submitting form -->
                <form
                        name="saml-post-binding"
                        method="post"
                        action={samlPost.url}
                        bind:this={htmlFormElement}
                >
                    {#if samlPost.SAMLRequest}
                        <input type="hidden" name="SAMLRequest" value={samlPost.SAMLRequest} />
                    {/if}
                    {#if samlPost.SAMLResponse}
                        <input type="hidden" name="SAMLResponse" value={samlPost.SAMLResponse} />
                    {/if}
                    {#if samlPost.relayState}
                        <input type="hidden" name="RelayState" value={samlPost.relayState} />
                    {/if}

                    <!-- No-JS fallback -->
                    <noscript>
                        <div class="mt-4 space-y-3">
                            <p>{@render msg('saml.post-form.js-disabled')()}</p>
                            <a href={samlPost.url} class="link link-primary break-all">{samlPost.url}</a>
                            <div>
                                <input type="submit" value={msgStr('doContinue')} class="btn btn-primary" />
                            </div>
                        </div>
                    </noscript>
                </form>
            </div>
        </div>
    </div>
</Template>
