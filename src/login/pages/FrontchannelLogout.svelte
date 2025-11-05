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
    }: PageProps<Extract<KcContext, { pageId: 'frontchannel-logout.ftl' }>, I18n> = $props();

    const { logout } = kcContext;
    const { msg, msgStr } = $i18n;

    let iframeLoadCount = $state(0);

    $effect(() => {
        const target = kcContext.logout.logoutRedirectUri;
        if (!target) return;
        if (iframeLoadCount !== kcContext.logout.clients.length) return;
        // All client logout iframes reported loaded → redirect
        window.location.replace(target);
    });

    const total = logout.clients.length;
    const percent = () => (total === 0 ? 100 : Math.round((iframeLoadCount / total) * 100));
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        documentTitle={msgStr('frontchannel-logout.title')}
        displayMessage={false}
>
    {#snippet headerNode()}
        {@render msg('frontchannel-logout.title')()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                    {@render msg('frontchannel-logout.title')()}
                </h1>

                <!-- Message -->
                <p class="opacity-80 mb-6">
                    {@render msg('frontchannel-logout.message')()}
                </p>

                <!-- Progress -->
                <div class="mb-4">
                    <progress class="progress progress-primary w-full" value={percent()} max="100"></progress>
                    <div class="mt-2 text-sm opacity-75">
                        {iframeLoadCount}/{total} | {percent()}%
                    </div>
                </div>

                <!-- Visible client list (names + full URLs) -->
                {#if total > 0}
                    <ul class="space-y-2 mb-6">
                        {#each logout.clients as client (client.name)}
                            <li class="text-sm">
                                <span class="font-medium">{client.name}</span>
                                {#if client.frontChannelLogoutUrl}
                                    <span class="opacity-70"> — </span>
                                    <a href={client.frontChannelLogoutUrl} class="link link-primary break-all">
                                        {client.frontChannelLogoutUrl}
                                    </a>
                                {/if}
                                <iframe
                                        src={client.frontChannelLogoutUrl}
                                        title={`frontchannel-logout-${client.name}`}
                                        class="hidden"
                                        onload={() => iframeLoadCount++}
                                ></iframe>
                            </li>
                        {/each}
                    </ul>
                {/if}

                <!-- Manual continue (full URL shown) -->
                {#if logout.logoutRedirectUri}
                    <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <a id="continue" class="btn btn-primary" href={logout.logoutRedirectUri}>
                            {@render msg('doContinue')()}
                        </a>
                        <a href={logout.logoutRedirectUri} class="link link-primary break-all">
                            {logout.logoutRedirectUri}
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</Template>
