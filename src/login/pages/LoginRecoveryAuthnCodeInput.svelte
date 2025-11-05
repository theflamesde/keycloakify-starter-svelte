<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { kcSanitize } from 'keycloakify/lib/kcSanitize';
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
    }: PageProps<Extract<KcContext, { pageId: 'login-recovery-authn-code-input.ftl' }>, I18n> = $props();

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;
    const { msg, msgStr } = $i18n;

    const hasErr = messagesPerField.existsError('recoveryCodeInput');

    // format helpers: keep digits, insert dashes every 4, cap at 12 digits
    const normalizeDigits = (v: string) => v.replace(/\D+/g, '').slice(0, 12);
    const withDashes = (d: string) => d.replace(/(.{4})(?=.)/g, '$1-');
    const formatCode = (v: string) => withDashes(normalizeDigits(v));

    function onInput(e: Event) {
        const el = e.currentTarget as HTMLInputElement;
        const cur = el.value;
        const pos = el.selectionStart ?? cur.length;

        const digitsBefore = normalizeDigits(cur.slice(0, pos)).length;
        const formatted = formatCode(cur);

        el.value = formatted;

        // restore caret after reformat
        let newCaretDigits = digitsBefore;
        let caret = 0, seenDigits = 0;
        while (caret < formatted.length && seenDigits < newCaretDigits) {
            if (/\d/.test(formatted[caret])) seenDigits++;
            caret++;
        }
        el.setSelectionRange(caret, caret);
    }

    function onPaste(e: ClipboardEvent) {
        const data = e.clipboardData?.getData('text') ?? '';
        const formatted = formatCode(data);
        e.preventDefault();
        const el = e.currentTarget as HTMLInputElement;
        el.value = formatted;
    }
</script>

<Template
        {kcContext}
        {i18n}
        {doUseDefaultCss}
        {classes}
        displayMessage={!hasErr}
>
    {#snippet headerNode()}
        {@render msg('auth-recovery-code-header')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-4xl py-14 lg:py-20">
                <div class="items-start">
                    <!-- RIGHT: Glass card form -->
                    <div class="relative">
                        <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-8">
                            <h2 class="text-2xl font-bold mb-2">
                                {@render msg('auth-recovery-code-header')()}
                            </h2>
                            <p class="opacity-70 mb-6">
                                {@render msg('doLogIn')()}
                            </p>

                            <form
                                    id="kc-recovery-code-login-form"
                                    class="{kcClsx('kcFormClass')} space-y-5"
                                    action={url.loginAction}
                                    method="post"
                            >
                                <div class={kcClsx('kcFormGroupClass')}>
                                    <label for="recoveryCodeInput" class="{kcClsx('kcLabelClass')} mb-2 block">
                                        {@render msg('auth-recovery-code-prompt', `${recoveryAuthnCodesInputBean.codeNumber}`)()}
                                    </label>

                                    <!-- svelte-ignore a11y_autofocus -->
                                    <input
                                            tabindex={1}
                                            id="recoveryCodeInput"
                                            name="recoveryCodeInput"
                                            aria-invalid={hasErr}
                                            autocomplete="one-time-code"
                                            inputmode="numeric"
                                            pattern="[0-9\-]*"
                                            maxlength="14"
                                    type="text"
                                    class="{kcClsx('kcInputClass')} input input-bordered w-full font-mono tracking-wider"
                                    autofocus
                                    on:input={onInput}
                                    on:paste={onPaste}
                                    />
                                    {#if hasErr}
                    <span id="input-error" class="{kcClsx('kcInputErrorMessageClass')} text-error mt-2 block" aria-live="polite">
                      {@html kcSanitize(messagesPerField.get('recoveryCodeInput'))}
                    </span>
                                    {/if}
                                </div>

                                <div class="{kcClsx('kcFormGroupClass')} flex items-center justify-end">
                                    <input
                                            class="{kcClsx('kcButtonClass','kcButtonPrimaryClass','kcButtonBlockClass','kcButtonLargeClass')} btn btn-primary"
                                            name="login"
                                            id="kc-login"
                                            type="submit"
                                            value={msgStr('doLogIn')}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</Template>
