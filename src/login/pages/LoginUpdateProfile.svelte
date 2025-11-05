<script lang="ts">
    import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useState } from '@keycloakify/svelte/tools/useState';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { Component } from 'svelte';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import '../index.css';

    type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: 'login-update-profile.ftl' }>, I18n> & {
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
    }: LoginUpdateProfileProps = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { messagesPerField, url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = $i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    // Optional: strip « » some locales inject
    const clean = (s: string) => s.replace(/&laquo;|&raquo;|«|»/g, '').trim();
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayRequiredFields={true}
        displayMessage={messagesPerField.exists('global')}
>
    {#snippet headerNode()}
        {@render msg('loginProfileTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT: Update Profile Card -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('loginProfileTitle')()}
                            </h2>

                            <form
                                    id="kc-update-profile-form"
                                    class="{kcClsx('kcFormClass')} space-y-4"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <!-- Pre-styled, prerendered fields -->
                                <UserProfileFormFields
                                        {kcContext}
                                        {i18n}
                                        {kcClsx}
                                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                                        {doMakeUserConfirmPassword}
                                />

                                <div class={kcClsx('kcFormGroupClass')}>
                                    <!-- Buttons -->
                                    <div id="kc-form-buttons" class="{kcClsx('kcFormButtonsClass')} flex flex-col sm:flex-row gap-3 sm:justify-end">
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
                                                    class="{kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')} btn btn-ghost"
                                                    type="submit"
                                                    name="cancel-aia"
                                                    value="true"
                                                    formnovalidate
                                            >
                                                {@render msg('doCancel')()}
                                            </button>
                                        {/if}
                                    </div>

                                    <!-- (Optional) Options row placeholder to preserve KC layout hooks -->
                                    <div id="kc-form-options" class="{kcClsx('kcFormOptionsClass')}"></div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- RIGHT: Brand headline / links (mirrors your Login/Register) -->
                    <div class="text-center lg:text-right relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {@render msg('loginProfileTitle')()}
              </span>
                        </h1>
                        <p class="mt-4 text-lg text-gray-300">
                            {@render msg('personalInfo')() /* or your own static copy */}
                        </p>
                        <div class="mt-8 flex items-center justify-center lg:justify-end gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">Discord</a>
                            <a href="/posts" class="btn btn-ghost">Posts</a>
                        </div>

                        <!-- Optional decorative image, matching your Login page -->
                        <!-- <img src="/blog_post_leaning.png" alt="Decor" class="hidden lg:block w-[64rem] max-w-none rounded-xl absolute -left-40 -top-10 pointer-events-none opacity-30" /> -->
                    </div>
                </div>
            </div>
        </section>
    </div>
</Template>
