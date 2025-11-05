<script lang="ts">
    import {useInitialize} from '@keycloakify/svelte/login/Template.useInitialize';
    import type {TemplateProps} from '@keycloakify/svelte/login/TemplateProps';
    import {useSetClassName} from '@keycloakify/svelte/tools/useSetClassName';
    import {kcSanitize} from 'keycloakify/lib/kcSanitize';
    import {getKcClsx} from 'keycloakify/login/lib/kcClsx';
    import {clsx} from 'keycloakify/tools/clsx';
    import {onMount} from 'svelte';
    import type {I18n} from './i18n';
    import type {KcContext} from './KcContext';
    import './index.css';

    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children,
    }: TemplateProps<KcContext, I18n> = $props();
    const {kcClsx} = getKcClsx({doUseDefaultCss, classes});

    const {msgStr, currentLanguage, enabledLanguages} = $i18n;

    const {realm, auth, url, message, isAppInitiatedAction} = kcContext;
    onMount(() => {
        document.title = documentTitle ?? msgStr('loginTitle', kcContext.realm.displayName);
    });
    useSetClassName({
        qualifiedName: 'html',
        className: kcClsx('kcHtmlClass'),
    });

    useSetClassName({
        qualifiedName: 'body',
        className: bodyClassName ?? kcClsx('kcBodyClass'),
    });
    const {isReadyToRender} = useInitialize({kcContext, doUseDefaultCss});
</script>

<style>
    .hero-gradient {
        background: radial-gradient(1200px 600px at 80% 10%, rgba(255, 64, 64, .35), transparent 60%),
        radial-gradient(900px 500px at 10% 20%, rgba(88, 101, 242, .35), transparent 60%),
        linear-gradient(180deg, rgba(0, 0, 0, .15), rgba(0, 0, 0, .35));
    }
</style>

{#if $isReadyToRender}
    <div class="hero-gradient p-3">

        <div class={kcClsx('kcFormCardClass')}>
            <header class={kcClsx('kcFormHeaderClass')}>
                {#if enabledLanguages.length > 1}
                    <div
                            class={kcClsx('kcLocaleMainClass')}
                            id="kc-locale"
                    >
                        <div
                                id="kc-locale-wrapper"
                        >
                            <div
                                    id="kc-locale-dropdown"
                            >

                            </div>
                        </div>
                    </div>
                {/if}
                {#snippet node()}
                    {#if !(auth !== undefined && auth.showUsername && !auth.showResetCredentials)}
                        <h1 id="kc-page-title"><!--{@render headerNode?.()}--></h1>
                    {/if}
                {/snippet}
                    {@render node()}
            </header>
            {#if displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction)}
                {#if (message.type === 'success')}
                    <div role="alert" class={clsx(`alert alert-success alert-soft`)}>
                        <span class={kcClsx('kcAlertTitleClass')}>{@html kcSanitize(message.summary)}</span>
                    </div>
                    {:else if (message.type === 'warning')}
                    <div role="alert" class={clsx(`alert alert-warning alert-soft`)}>
                        <span class={kcClsx('kcAlertTitleClass')}>{@html kcSanitize(message.summary)}</span>
                    </div>
                    {:else}
                    <div role="alert" class={clsx(`alert alert-error alert-soft`)}>
                        <span class={kcClsx('kcAlertTitleClass')}>{@html kcSanitize(message.summary)}</span>
                    </div>
                {/if}
            {/if}
            <div id="kc-content">
                <div id="kc-content-wrapper">
                    {@render children?.()}
                    {#if auth !== undefined && auth.showTryAnotherWayLink}
                        <form
                                id="kc-select-try-another-way-form"
                                action={url.loginAction}
                                method="post"
                        >
                            <div class={kcClsx('kcFormGroupClass')}>
                                <input
                                        type="hidden"
                                        name="tryAnotherWay"
                                        value="on"
                                />
                                <!-- svelte-ignore a11y_invalid_attribute -->
                                <a
                                        href="#"
                                        id="try-another-way"
                                        onclick={() => {
                    document.forms['kc-select-try-another-way-form' as never].requestSubmit();
                    return false;
                  }}
                                >
                                    {msgStr('doTryAnotherWay')}
                                </a>
                            </div>
                        </form>
                    {/if}

                </div>

            </div>

        </div>
    </div>
{/if}

<footer class="footer bg-base-200 text-base-content border-t border-base-300 px-10 py-4">
    <div class="w-full flex items-start gap-6">
        <!-- LEFT: brand + text + links -->
            <img src="/logo.png" alt="The Flames Logo" class="h-8 w-auto" />
            <div>
                <p class="font-semibold">The Flames</p>
                <p class="text-sm">
                    Where Creativity Meets Connectivity.
                    <br />
                    <small>
                        We are not affiliated with Mojang, Microsoft, or Minecraft in any way.
                        Minecraft is a trademark of Mojang Studios and/or Microsoft. All rights belong
                        to their respective owners.
                    </small>
                </p>

                <ul class="mt-2 flex gap-4 text-sm font-semibold">
                    <li>
                        <a href="https://the-flames.de/document/imprint" class="link link-hover">
                            Imprint
                        </a>
                    </li>
                    <li>
                        <a href="https://the-flames.de/document/privacy" class="link link-hover">
                            Privacy
                        </a>
                    </li>
                </ul>
            </div>

        <!-- RIGHT: language button -->
        <div class="ml-auto">
            <button
                    tabindex={1}
                    id="kc-current-locale-link"
                    popovertarget="popover-language-switch1"
                    style="anchor-name: --anchor-1"
                    aria-label={msgStr('languages')}
                    class="btn btn-outline"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="language-switch1"
            >
                {currentLanguage.label}
            </button>

            <!-- svelte-ignore a11y_incorrect_aria_attribute_type -->
            <ul
                    role="menu"
                    class="dropdown dropdown-top dropdown-left menu w-52 rounded-box bg-base-100 shadow-sm"
                    style="position-anchor: --anchor-1"
                    popover
                    tabindex={-1}
                    aria-labelledby="kc-current-locale-link"
                    aria-activedescendant=""
                    id="popover-language-switch1"
            >
                {#each enabledLanguages as enabledLanguage, i (enabledLanguage.languageTag)}
                    {@const { label, href } = enabledLanguage}
                    <li role="none">
                        <a role="menuitem" id={`language-${i + 1}`} {href}>
                            {label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</footer>


