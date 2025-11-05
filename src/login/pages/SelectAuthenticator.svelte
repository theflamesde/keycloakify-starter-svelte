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
    }: PageProps<Extract<KcContext, { pageId: 'select-authenticator.ftl' }>, I18n> = $props();

    const { url, auth } = kcContext;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, advancedMsg } = $i18n;

    const selections = auth.authenticationSelections ?? [];
    const hasChoices = selections.length > 0;

    const restartUrl = url.loginRestartFlowUrl ?? '';
    const valid = (u: string) => !!u && u.trim() !== '' && u !== '#';
    const hasRestart = valid(restartUrl);
</script>

<style>
    /* Make KC icon/arrow slots behave nicely without shrinking */
    :global(.kcSelectAuthListItemIconClass){
        flex: 0 0 2.25rem;
        width: 2.25rem;
        height: 2.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    :global(.kcSelectAuthListItemArrowClass){
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }
    :global(.kcSelectAuthListItemIconPropertyClass){
        font-size: 1.25rem; /* ~text-xl */
        line-height: 1;
    }
</style>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('loginChooseAuthenticator')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <!-- LEFT: Headline -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('loginChooseAuthenticator')()}
              </span>
                        </h1>
                    </div>

                    <!-- RIGHT: Glass card with choices -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('loginChooseAuthenticator')()}</h2>

                            <form id="kc-select-credential-form" class="{kcClsx('kcFormClass')} mt-4" action={url.loginAction} method="post">
                                {#if hasChoices}
                                    <!-- Vertical list to avoid horizontal squish -->
                                    <div class="flex flex-col gap-4">
                                        {#each selections as s (s.authExecId)}
                                            <button
                                                    type="submit"
                                                    name="authenticationExecution"
                                                    value={s.authExecId}
                                                    class="w-full text-left rounded-2xl hover:border hover:border-primary border-base-300/70 bg-base-100/30 hover:bg-base-100/60 transition focus:outline-none focus:ring-2 focus:ring-primary/50 p-5 md:p-6"
                                            >
                                                <div class="flex items-start gap-4">
                                                    <!-- Icon (fixed width, no shrink) -->
                                                    <div class="{kcClsx('kcSelectAuthListItemIconClass')}">
                                                        <i class="{kcClsx('kcSelectAuthListItemIconPropertyClass', s.iconCssClass)}"></i>
                                                    </div>

                                                    <div class="min-w-0 flex-1 break-words">
                                                        <div class="font-semibold text-base md:text-lg leading-relaxed">
                                                            {@render advancedMsg(s.displayName)()}
                                                        </div>
                                                        <div class="opacity-80 text-sm leading-relaxed mt-1">
                                                            {@render advancedMsg(s.helpText)()}
                                                        </div>
                                                    </div>

                                                    <!-- Arrow (no shrink) -->
                                                    <div class="{kcClsx('kcSelectAuthListItemArrowClass')} ml-2">
                                                        <i class="{kcClsx('kcSelectAuthListItemArrowIconClass')}"></i>
                                                    </div>
                                                </div>
                                            </button>
                                        {/each}
                                    </div>
                                {:else}
                                    <div class="mt-6 flex justify-end">
                                        {#if hasRestart}
                                            <a href={restartUrl} class="btn btn-primary">
                                                {@render msg('restartLoginTooltip')()}
                                            </a>
                                        {:else}
                                            <a href="/" class="btn btn-primary">
                                                {@render msg('doBack')()}
                                            </a>
                                        {/if}
                                    </div>
                                {/if}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
