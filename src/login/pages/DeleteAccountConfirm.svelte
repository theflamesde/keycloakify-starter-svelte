<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'delete-account-confirm.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, triggered_from_aia } = kcContext;
    const { msg, msgStr } = $i18n;

    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('deleteAccountConfirm')()}
    {/snippet}

    <div class="min-h-[100dvh] flex items-center justify-center px-6">
        <div class="w-full max-w-3xl">
            <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                    {@render msg('deleteAccountConfirm')()}
                </h1>

                <!-- Warning -->
                <div class="alert alert-warning mb-6">
                    <span class="pficon pficon-warning-triangle-o"></span>
                    <span>{@render msg('irreversibleAction')()}</span>
                </div>

                <!-- Explanation -->
                <p class="opacity-90 mb-3">{@render msg('deletingImplies')()}</p>
                <ul class="list-disc pl-6 text-sm opacity-80 mb-4">
                    <li>{@render msg('loggingOutImmediately')()}</li>
                    <li>{@render msg('errasingData')()}</li>
                </ul>
                <p class="font-medium mb-6">{@render msg('finalDeletionConfirmation')()}</p>

                <!-- Actions -->
                <form action={url.loginAction} method="post" class="{kcClsx('kcFormClass')}">
                    <div id="kc-form-buttons" class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <input
                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-ghost text-error"
                                type="submit"
                                value={clean(msgStr('doConfirmDelete'))}
                        />
                        {#if triggered_from_aia}
                            <button
                                    class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-primary
"
                                    type="submit"
                                    name="cancel-aia"
                                    value="true"
                            >
                                {@render msg('doCancel')()}
                            </button>
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>
</Template>
