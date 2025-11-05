<script lang="ts">
    import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { useState } from '@keycloakify/svelte/tools/useState';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import { clsx } from 'keycloakify/tools/clsx';
    import type { Component } from 'svelte';
    import type { I18n } from '../i18n';
    import type { KcContext } from '../KcContext';
    import TermsAcceptance from "../components/TermsAcceptance.svelte";

    type RegisterProps = PageProps<Extract<KcContext, { pageId: 'register.ftl' }>, I18n> & {
        UserProfileFormFields: Component<UserProfileFormFieldsProps>;
        doMakeUserConfirmPassword: boolean;
    };
    const props: RegisterProps = $props();
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } =
        props;
    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes,
    });

    const {
        messageHeader,
        url,
        messagesPerField,
        recaptchaRequired,
        recaptchaVisible,
        recaptchaSiteKey,
        recaptchaAction,
        termsAcceptanceRequired,
    } = kcContext;

    const { msg, msgStr, advancedMsg } = $i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    let htmlFormElement: HTMLFormElement | null = $state(null);

    $effect(() => {
        if (htmlFormElement === null) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)['onSubmitRecaptcha'] = () => {
            // @ts-expect-error; form not null
            htmlFormElement.requestSubmit();
        };

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any)['onSubmitRecaptcha'];
        };
    });
</script>

<style>
    :root { --discord-color: 88, 101, 242; }
    .btn-discord { background-color: rgba(var(--discord-color), 1); transition: background-color .3s ease; }
    .btn-discord:hover { background-color: rgba(var(--discord-color), .7); }
</style>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={messagesPerField.exists('global')}
        displayRequiredFields={true}
>
    {#snippet headerNode()}
        {#if messageHeader !== undefined}
            {@render advancedMsg(messageHeader)()}
        {:else}
            {@render msg('registerTitle')()}
        {/if}
    {/snippet}

    <!-- THEMED WRAPPER (mirrors login.svelte) -->
    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-6xl py-16 lg:py-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <!-- LEFT: Register Card (mirrored) -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">{@render msg('registerTitle')()}</h2>
                            <p class="opacity-70 mb-6">{@render msg('registerTitle')()}</p>

                            <!-- YOUR EXISTING FORM, untouched -->
                            <form
                                    id="kc-register-form"
                                    class="{kcClsx('kcFormClass')} space-y-4"
                                    action={url.registrationAction}
                                    method="post"
                                    bind:this={htmlFormElement}
                            >
                                <UserProfileFormFields
                                        {kcContext}
                                        {i18n}
                                        {kcClsx}
                                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                                        {doMakeUserConfirmPassword}
                                />

                                {#if termsAcceptanceRequired}
                                    <TermsAcceptance
                                            {i18n}
                                            {kcClsx}
                                            {messagesPerField}
                                            areTermsAccepted={$areTermsAccepted}
                                            onAreTermsAcceptedValueChange={setAreTermsAccepted}
                                    />
                                {/if}

                                {#if recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined)}
                                    <div class="form-group w-full">
                                        <div class="{kcClsx('kcInputWrapperClass')} w-full">
                                            <div
                                                    class="g-recaptcha"
                                                    data-sitekey={recaptchaSiteKey}
                                                    data-action={recaptchaAction}
                                            ></div>
                                        </div>
                                    </div>
                                {/if}

                                <div class={kcClsx('kcFormGroupClass')}>
                                        {#if recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined}
                                            <div id="kc-form-buttons" class={kcClsx('kcFormButtonsClass')}>
                                                <button
                                                        class={clsx(
                                                        kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass'),
                                                        'g-recaptcha', 'btn', 'btn-primary', 'w-full')}
                                                        data-sitekey={recaptchaSiteKey}
                                                        data-callback="onSubmitRecaptcha"
                                                        data-action={recaptchaAction}
                                                        type="submit"
                                                >
                                                    {@render msg('doRegister')()}
                                                </button>
                                            </div>
                                        {:else}
                                            <div id="kc-form-buttons" class={kcClsx('kcFormButtonsClass')}>
                                                <input
                                                        disabled={!$isFormSubmittable || (termsAcceptanceRequired && !$areTermsAccepted)}
                                                        class="{kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')} btn btn-primary w-full"
                                                        type="submit"
                                                        value={msgStr('doRegister')}
                                                />
                                            </div>
                                        {/if}

                                    <div id="kc-form-options" class="{kcClsx('kcFormOptionsClass')} mt-6">
                                        <div class="{kcClsx('kcFormOptionsWrapperClass')} text-center">
                                            <span class="opacity-80">
                                                {@render msg('alreadyHaveAccount')()}&nbsp;
                                              <a href={url.loginUrl} class="link link-primary">
                                                {@render msg('backToLogin')()}
                                              </a>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- RIGHT: Brand headline / links (mirrored vs. login) -->
                    <div class="text-center lg:text-right relative">
                        <h1 class="text-4xl sm:text-5xl font-extrabold">
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                {msgStr('registerTitle')}
              </span>
                        </h1>
                        <p class="mt-4 text-lg text-gray-300">
                            Erstelle dein Konto, um Zugriff auf unsere Dienste zu erhalten.
                        </p>
                        <div class="mt-8 flex items-center justify-center lg:justify-end gap-3">
                            <a href="https://dc.the-flames.de" target="_blank" class="btn btn-discord">https://dc.the-flames.de</a>
                            <a href="/posts" class="btn btn-ghost">/posts</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- background mesh -->
        </section>
    </div>
</Template>
