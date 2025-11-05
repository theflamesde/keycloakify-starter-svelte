<script lang="ts">
    import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
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
    }: PageProps<Extract<KcContext, { pageId: 'login-update-password.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr } = $i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const hasPwError = messagesPerField.existsError('password', 'password-confirm');
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={!hasPwError}>
    {#snippet headerNode()}
        {@render msg('updatePasswordTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT -->
                    <div class="text-center lg:text-left">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
                             <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                               {@render msg('updatePasswordTitle')()}
                             </span>
                        </h1>
                        <div class="mt-8 flex items-center justify-center lg:justify-start gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">Discord</a>
                            <a href="/posts" class="btn btn-ghost">Posts</a>
                        </div>
                    </div>

                    <!-- RIGHT: card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('updatePasswordTitle')()}</h2>
                            <p class="opacity-70 mb-6">
                                {@render msg('passwordNew')()} / {@render msg('passwordConfirm')()}
                            </p>

                            <form id="kc-passwd-update-form" class="space-y-5" action={url.loginAction} method="post">
                                <!-- New password -->
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="password-new" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {@render msg('passwordNew')()}
                                    </label>
                                    <PasswordWrapper {kcClsx} {i18n} passwordInputId="password-new">
                                        <!-- svelte-ignore a11y_autofocus -->
                                        <input
                                                type="password"
                                                id="password-new"
                                                name="password-new"
                                                class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                                autofocus
                                                autocomplete="new-password"
                                                aria-invalid={hasPwError}
                                                aria-describedby={messagesPerField.existsError('password') ? 'input-error-password' : undefined}
                                        />
                                    </PasswordWrapper>
                                    {#if messagesPerField.existsError('password')}
                    <span id="input-error-password" class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block" aria-live="polite">
                      {@html kcSanitize(messagesPerField.get('password'))}
                    </span>
                                    {/if}
                                </div>

                                <!-- Confirm -->
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="password-confirm" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {@render msg('passwordConfirm')()}
                                    </label>
                                    <PasswordWrapper {kcClsx} {i18n} passwordInputId="password-confirm">
                                        <input
                                                type="password"
                                                id="password-confirm"
                                                name="password-confirm"
                                                class="{kcClsx('kcInputClass')} input input-bordered w-full"
                                                autocomplete="new-password"
                                                aria-invalid={hasPwError}
                                                aria-describedby={messagesPerField.existsError('password-confirm') ? 'input-error-password-confirm' : undefined}
                                        />
                                    </PasswordWrapper>
                                    {#if messagesPerField.existsError('password-confirm')}
                    <span id="input-error-password-confirm" class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block" aria-live="polite">
                      {@html kcSanitize(messagesPerField.get('password-confirm'))}
                    </span>
                                    {/if}
                                </div>

                                <!-- Logout other sessions (custom checkbox; replaces component) -->
                                <div class="{kcClsx('kcFormGroupClass')}">
                                    <label class="label cursor-pointer gap-3 items-center">
                                        <input
                                                id="logout-sessions"
                                                name="logout-sessions"
                                                type="checkbox"
                                                class="checkbox checkbox-primary"
                                                value="on"
                                        />
                                        <span class="label-text">{@render msg('logoutOtherSessions')()}</span>
                                    </label>
                                </div>

                                <!-- Actions -->
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <div id="kc-form-buttons" class="{kcClsx('kcFormButtonsClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <input
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass',!isAppInitiatedAction && 'kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                                type="submit"
                                                value={clean(msgStr('doSubmit'))}
                                        />
                                        {#if isAppInitiatedAction}
                                            <button
                                                    class="{kcClsx('kcButtonClass','kcButtonDefaultClass','kcButtonLargeClass')} btn btn-ghost"
                                                    type="submit"
                                                    name="cancel-aia"
                                                    value="true"
                                            >
                                                {@render msg('doCancel')()}
                                            </button>
                                        {/if}
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
