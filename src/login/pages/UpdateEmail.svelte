<script lang="ts">
    import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useState } from '@keycloakify/svelte/tools/useState';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { Component } from 'svelte';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import '../index.css';

    type UpdateEmailProps = PageProps<Extract<KcContext, { pageId: 'update-email.ftl' }>, I18n> & {
        UserProfileFormFields: Component<UserProfileFormFieldsProps>;
        doMakeUserConfirmPassword: boolean;
    };

    const {
        Template,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
    }: UpdateEmailProps = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr } = $i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    // Optional: strip « »
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={messagesPerField.exists('global')}
        displayRequiredFields={true}
>
    {#snippet headerNode()}
        {@render msg('updateEmailTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="items-start">
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('updateEmailTitle')()}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {@render msg('updatePasswordMessage')()}
                            </p>

                            <form
                                    id="kc-update-email-form"
                                    class="{kcClsx('kcFormClass')} space-y-5"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <!-- Pre-styled Keycloakify fields -->
                                <UserProfileFormFields
                                        {kcContext}
                                        {i18n}
                                        {kcClsx}
                                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                                        {doMakeUserConfirmPassword}
                                />

                                <!-- Logout other sessions (native checkbox for perfect alignment) -->
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
                                    <div
                                            id="kc-form-buttons"
                                            class="{kcClsx('kcFormButtonsClass')} flex flex-col sm:flex-row gap-3 sm:justify-end"
                                    >
                                        <input
                                                disabled={!$isFormSubmittable}
                                                class="{kcClsx(
                        'kcButtonClass',
                        'kcButtonPrimaryClass',
                        !isAppInitiatedAction && 'kcButtonBlockClass',
                        'kcButtonLargeClass'
                      )} btn btn-primary"
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

                                    <!-- keep options hook for KC layout (empty but present) -->
                                    <div id="kc-form-options" class="{kcClsx('kcFormOptionsClass')}"></div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
