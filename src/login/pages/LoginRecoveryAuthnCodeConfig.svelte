<script lang="ts">
    import { useScript } from '@keycloakify/svelte/login/pages/LoginRecoveryAuthnCodeConfig.useScript';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import '../index.css';

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-recovery-authn-code-config.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction, url } = kcContext;
    const { msg, msgStr } = $i18n;

    const olRecoveryCodesListId = 'kc-recovery-codes-list';
    useScript({ olRecoveryCodesListId, i18n });

    // strip « » if a locale injects them
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
    {#snippet headerNode()}
        {@render msg('recovery-code-config-header')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <!-- LEFT: Title + warning -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('recovery-code-config-header')()}
              </span>
                        </h1>

                        <div class="alert alert-warning mt-6">
                            <span class="pficon pficon-warning-triangle-o"></span>
                            <span class="font-medium">
                {@render msg('recovery-code-config-warning-title')()}
              </span>
                        </div>

                        <p class="mt-3 opacity-85">
                            {@render msg('recovery-code-config-warning-message')()}
                        </p>
                    </div>

                    <!-- RIGHT: Glass card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('recovery-code-config-header')()}
                            </h2>

                            <!-- Codes list -->
                            <ol
                                    id={olRecoveryCodesListId}
                                    class="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm bg-base-100/40 rounded-xl p-4"
                            >
                                {#each recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code, index (code)}
                                    <li class="flex items-center gap-2">
                                        <span class="opacity-60 w-6 text-right">{index + 1}:</span>
                                        <span class="select-all">
                      {code.slice(0,4)}-{code.slice(4,8)}-{code.slice(8)}
                    </span>
                                    </li>
                                {/each}
                            </ol>

                            <!-- Actions (print / download / copy) -->
                            <div class="mt-4 flex flex-wrap gap-3">
                                <button id="printRecoveryCodes" type="button" class="btn btn-ghost btn-sm">
                                    <i class="pficon-print" aria-hidden="true"></i>
                                    <span class="ml-2">{@render msg('recovery-codes-print')()}</span>
                                </button>
                                <button id="downloadRecoveryCodes" type="button" class="btn btn-ghost btn-sm">
                                    <i class="pficon-save" aria-hidden="true"></i>
                                    <span class="ml-2">{@render msg('recovery-codes-download')()}</span>
                                </button>
                                <button id="copyRecoveryCodes" type="button" class="btn btn-ghost btn-sm">
                                    <i class="pficon-blueprint" aria-hidden="true"></i>
                                    <span class="ml-2">{@render msg('recovery-codes-copy')()}</span>
                                </button>
                            </div>

                            <!-- Confirmation checkbox enables submit -->
                            <div class="{kcClsx('kcFormOptionsClass')} mt-6">
                                <label for="kcRecoveryCodesConfirmationCheck" class="label cursor-pointer gap-3 items-start">
                                    <input
                                            class="{kcClsx('kcCheckInputClass')} checkbox checkbox-primary"
                                            type="checkbox"
                                            id="kcRecoveryCodesConfirmationCheck"
                                            name="kcRecoveryCodesConfirmationCheck"
                                            onchange={(event) => {
                      // @ts-expect-error keep parity with upstream snippet
                      document.getElementById('saveRecoveryAuthnCodesBtn').disabled = !event.currentTarget.checked;
                    }}
                                    />
                                    <span class="label-text leading-relaxed">
                    {@render msg('recovery-codes-confirmation-message')()}
                  </span>
                                </label>
                            </div>

                            <!-- Submit form -->
                            <form
                                    action={url.loginAction}
                                    class="{kcClsx('kcFormGroupClass')} mt-6"
                                    id="kc-recovery-codes-settings-form"
                                    method="post"
                            >
                                <input
                                        type="hidden"
                                        name="generatedRecoveryAuthnCodes"
                                        value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}
                                />
                                <input
                                        type="hidden"
                                        name="generatedAt"
                                        value={recoveryAuthnCodesConfigBean.generatedAt}
                                />
                                <input
                                        type="hidden"
                                        id="userLabel"
                                        name="userLabel"
                                        value={msgStr('recovery-codes-label-default')}
                                />

                                <!-- Logout other sessions (native checkbox for consistent alignment) -->
                                <div class="{kcClsx('kcFormGroupClass')} mt-2">
                                    <label class="label cursor-pointer gap-3 items-center">
                                        <input id="logout-sessions" name="logout-sessions" type="checkbox" class="checkbox checkbox-primary" value="on" />
                                        <span class="label-text">{@render msg('logoutOtherSessions')()}</span>
                                    </label>
                                </div>

                                <!-- Buttons -->
                                <div class="{kcClsx('kcFormButtonsClass')} mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    {#if isAppInitiatedAction}
                                        <input
                                                type="submit"
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonLargeClass')} btn btn-primary"
                                                id="saveRecoveryAuthnCodesBtn"
                                                value={clean(msgStr('recovery-codes-action-complete'))}
                                                disabled
                                        />
                                        <button
                                                type="submit"
                                                class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                                id="cancelRecoveryAuthnCodesBtn"
                                                name="cancel-aia"
                                                value="true"
                                        >
                                            {@render msg('recovery-codes-action-cancel')()}
                                        </button>
                                    {:else}
                                        <input
                                                type="submit"
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                                id="saveRecoveryAuthnCodesBtn"
                                                value={clean(msgStr('recovery-codes-action-complete'))}
                                                disabled
                                        />
                                    {/if}
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
