<script lang="ts">
    import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useState } from '@keycloakify/svelte/tools/useState';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { Component } from 'svelte';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>, I18n> & {
        UserProfileFormFields: Component<UserProfileFormFieldsProps>;
        doMakeUserConfirmPassword: boolean;
    };

    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        classes,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
    }: IdpReviewUserProfileProps = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr } = $i18n;
    const { url, messagesPerField } = kcContext;

    // FIX: typo -> isFormSubmittable
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    // Optional: strip « » if your locale injects them
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
        {@render msg('loginIdpReviewProfileTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class=" items-start">

                    <!-- RIGHT: Glass card with form -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('loginIdpReviewProfileTitle')()}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {@render msg('updateProfile')() /* soft subtitle */}
                            </p>

                            <form
                                    id="kc-idp-review-profile-form"
                                    class="{kcClsx('kcFormClass')} space-y-4"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <UserProfileFormFields
                                        {kcContext}
                                        {i18n}
                                        {kcClsx}
                                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                                        {doMakeUserConfirmPassword}
                                />

                                <div class={kcClsx('kcFormGroupClass')}>
                                    <div id="kc-form-buttons" class="{kcClsx('kcFormButtonsClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <input
                                                class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                                type="submit"
                                                value={clean(msgStr('doSubmit'))}
                                                disabled={!$isFormSubmittable}
                                        />
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
