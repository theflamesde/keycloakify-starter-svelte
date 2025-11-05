<script lang="ts">
    import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
    import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
    import type { KcContext } from '../KcContext';
    import type { I18n } from '../i18n';
    import '../index.css';

    const {
        Template, kcContext, i18n, doUseDefaultCss, classes,
    }: PageProps<Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>, I18n> = $props();

    const { url } = kcContext;
    const { msg, msgStr } = $i18n;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    // --- Config ---
    const MIN = 6;
    const MAX = 12;

    // --- Runes state: length-limited code ---
    let raw = $state('');
    const onlyAN = (s: string) => s.replace(/[^A-Za-z0-9]/g, '');
    const normalized = $derived(onlyAN(raw).toUpperCase().slice(0, MAX));
    const len = $derived(normalized.length);
    const tooShort = $derived(len < MIN);
    const canSubmit = $derived(len >= MIN && len <= MAX);
    const remaining = $derived(Math.max(0, MIN - len));
    const reachedMax = $derived(len === MAX);
    const isEven = $derived(len > 0 && len % 2 === 0);

    function smartGroups(s: string): string[] {
        const n = s.length;
        if (!n) return [];
        // If even length -> groups of 2 look nicest
        if (n % 2 === 0) return s.match(/.{1,2}/g) ?? [];
        // If divisible by 3 -> groups of 3
        if (n % 3 === 0) return s.match(/.{1,3}/g) ?? [];
        // Otherwise (7 or 11): use 3-4 or 3-4-4
        const parts: string[] = [];
        if (n >= 3) {
            parts.push(s.slice(0, 3));
            s = s.slice(3);
        }
        if (s.length) {
            parts.push(...(s.match(/.{1,4}/g) ?? [s]));
        }
        return parts;
    }

    const groups = $derived(smartGroups(normalized));

    let inputEl: HTMLInputElement | null = null;

    function onInput(e: Event) { raw = (e.currentTarget as HTMLInputElement).value; }
    function pasteHandler(e: ClipboardEvent) { raw = e.clipboardData?.getData('text') ?? ''; e.preventDefault(); }
    function focusHidden() { inputEl?.focus(); const l = inputEl?.value?.length ?? 0; inputEl?.setSelectionRange?.(l, l); }
    function onSubmit(ev: Event) { if (!canSubmit) ev.preventDefault(); }
    function clearAll() { raw = ''; inputEl?.focus(); }
</script>

<style>
    .pin-preview { display:flex; flex-wrap:wrap; gap:.5rem .5rem; }
    .pin-chip {
        display:inline-flex; align-items:center; justify-content:center;
        min-width:3.2rem; padding:.6rem .8rem; border-radius:1rem;
        border:2px solid hsl(var(--p)/.4); background:hsl(var(--b2)/.8);
        backdrop-filter: blur(6px);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size:1.25rem; letter-spacing:.06em;
    }
    .pin-chip.empty { opacity:.5; }
    .pin-sep { display:inline-flex; align-items:center; opacity:.5; margin:0 .1rem; }
    .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
</style>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
    {#snippet headerNode()}
        {@render msg('oauth2DeviceVerificationTitle')()}
    {/snippet}

    <div class="min-h-[100dvh]">
        <section class="relative isolate px-6 pt-14 lg:px-8">
            <div class="mx-auto max-w-3xl py-14 lg:py-20">
                <div class="relative border-4 rounded-3xl border-primary/40 bg-base-200/80 backdrop-blur shadow-2xl p-6 sm:p-10">

                    <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                        {@render msg('oauth2DeviceVerificationTitle')()}
                    </h1>
                    <p class="opacity-80 mb-6">{@render msg('verifyOAuth2DeviceUserCode')()}</p>

                    <form
                            id="kc-user-verify-device-user-code-form"
                            class="space-y-6"
                            action={url.oauth2DeviceVerificationAction}
                            method="post"
                            on:submit={onSubmit}
                    >
                        <!-- Hidden real input posted to Keycloak -->
                        <input type="hidden" name="device_user_code" value={normalized} />

                        <!-- Accessible hidden input to capture typing/paste -->
                        <label for="device-user-code" class="sr-only">{@render msg('verifyOAuth2DeviceUserCode')()}</label>
                        <input
                                id="device-user-code"
                                aria-label={msgStr('verifyOAuth2DeviceUserCode')}
                                class="sr-only"
                                bind:this={inputEl}
                                value={raw}
                                on:input={onInput}
                                on:paste={pasteHandler}
                                autocomplete="one-time-code"
                                autocapitalize="characters"
                                spellcheck="false"
                                maxlength={MAX + 10}
                        />

                        <!-- Visual PIN-style preview; click to focus hidden input -->
                        <div class="pin-preview cursor-text select-none" role="group" aria-labelledby="device-user-code" on:click={focusHidden}>
                            {#if groups.length === 0}
                                <div class="pin-chip empty">--</div>
                                <div class="pin-sep">–</div>
                                <div class="pin-chip empty">--</div>
                            {:else}
                                {#each groups as g, i}
                                    <div class="pin-chip">{g}</div>
                                    {#if i !== groups.length - 1}
                                        <div class="pin-sep">–</div>
                                    {/if}
                                {/each}
                            {/if}
                        </div>

                        <!-- Helper row -->
                        <div class="text-sm flex items-center justify-between">
                            <div class="{tooShort ? 'text-warning' : 'opacity-70'}">
                                {#if tooShort}
                                    {remaining} more to reach 6 characters
                                {:else}
                                    {len} / 6–12
                                {/if}
                            </div>
                            <div class="{isEven ? 'text-success' : 'opacity-70'}">
                                {#if len === 0}
                                    &nbsp;
                                {:else if isEven}
                                    Even length ✓
                                {:else}
                                    Odd length
                                {/if}
                            </div>
                        </div>

                        <div class="flex gap-3 justify-end">
                            <button type="button" class="btn btn-ghost" on:click={clearAll}>
                                {@render msg('doClear')()}
                            </button>
                            <button type="submit" class="btn btn-primary" disabled={!canSubmit}>
                                {@render msg('doSubmit')()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</Template>