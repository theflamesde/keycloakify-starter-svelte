/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from '@keycloakify/svelte/login';
import type { ThemeName } from '../kc.gen';

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder.withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      alreadyHaveAccount: "Already have an account?",
      doClear: "Clear",
      pageExpiredPossibleCause1: "You were inactive for too long.",
      pageExpiredPossibleCause2: "You used the back/forward buttons or refreshed at the wrong time.",
      pageExpiredPossibleCause3: "Your session or cookies were cleared or changed.",
      helpTextFallback: "We could not determine the next step automatically. Use the button below to return to the start.",
      doConfigure: "Configure Now",
      updateProfile: "Update Profile",
      copyCodeSuccess: "Code copied to clipboard!",
      copyCodeError: "Could not copy code to clipboard.",
      doCopy: "Copy",
      chooseAnAuthenticatorToReset: "Choose an authenticator to reset",
      confirmOverrideIdpDescription: "You have already logged in using a different identity provider. If you continue, you will override your previous login."
    },
    de: {
      alreadyHaveAccount: "Bereits ein Konto vorhanden?",
      doClear: "Leeren",
      pageExpiredPossibleCause1: "Sie waren zu lange inaktiv.",
      pageExpiredPossibleCause2: "Sie haben die Zurück-/Vorwärts-Schaltflächen verwendet oder zu einem ungünstigen Zeitpunkt aktualisiert.",
      pageExpiredPossibleCause3: "Ihre Sitzung oder Cookies wurden gelöscht oder geändert.",
      helpTextFallback: "Wir konnten den nächsten Schritt nicht automatisch bestimmen. Verwenden Sie die Schaltfläche unten, um zum Anfang zurückzukehren.",
      doConfigure: "Jetzt konfigurieren",
      updateProfile: "Profil aktualisieren",
      copyCodeSuccess: "Code in die Zwischenablage kopiert!",
      copyCodeError: "Der Code konnte nicht in die Zwischenablage kopiert werden.",
      doCopy: "Kopieren",
      chooseAnAuthenticatorToReset: "Wählen Sie einen Authentifikator zum Zurücksetzen",
      confirmOverrideIdpDescription: "Sie haben sich bereits mit einem anderen Identitätsanbieter angemeldet. Wenn Sie fortfahren, wird Ihre vorherige Anmeldung überschrieben."
    }
  })
  .build();

type I18n = typeof ofTypeI18n;
export { useI18n, type I18n };
