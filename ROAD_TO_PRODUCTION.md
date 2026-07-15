# Road to Production: UBAGO

This guide outlines the necessary steps to take the UBAGO application from its current development state to a production-ready system capable of being deployed to the App Store and Play Store.

## 🚨 Critical Blockers (Must Fix Immediately)

### 1. Fix TypeScript Definitions
- **Issue**: `src/types/index.ts` is missing key interfaces (`Restaurant`, `MenuItem`, `FoodOrder`) despite being used in `firestore.service.ts`.
- **Action**: Update `src/types/index.ts` with the complete data model definitions.
- **Why**: The app may fail to build or produce runtime errors without these.

### 2. Remove "Demo Mode" & Backdoors
- **Issue**: `AuthContext.tsx` contains logic for `demo@ubago.com` that completely bypasses authentication. `LoginScreen.tsx` displays these credentials.
- **Action**: Delete the demo logic block in `login()` function and remove the instruction text from the UI.
- **Why**: Apple/Google reviews will reject apps with obvious security bypasses, and it's a security risk.

### 3. Secure Configuration (Environment Variables)
- **Issue**: Firebase API Keys and Google Client IDs are hardcoded in `src/config/firebase.ts` and `src/screens/LoginScreen.tsx`.
- **Action**:
  - Create a `.env` file (ensure it's in `.gitignore`).
  - Use `expo-constants` (extra) or `react-native-dotenv` to inject these values.
  - Update `app.json` to potentially use `eas.json` for secrets management during build.

## 🛠 Application Hardening

### 4. Permissions & Compliance
- **Issue**: `app.json` has minimal configuration.
- **Action**:
  - Add `NSLocationWhenInUseUsageDescription` (iOS) and Android permissions to `app.json`.
  - Add `NSCameraUsageDescription` if camera is used for profile pics/scanning.
  - Ensure Google Maps API keys are restricted to your package name/bundle ID in Google Cloud Console.

### 5. Assets & Branding
- **Issue**: The app uses default Expo icons/splash screens or placeholders.
- **Action**:
  - Generate adaptive icons (`android/adaptive-icon.png`) and iOS icons.
  - Create a branded Splash Screen.
  - Verify the `slug` and `scheme` in `app.json` match your final branding (e.g., `ubago`).

## 🚀 Deployment Setup

### 6. Build Configuration (EAS)
- **Action**:
  - Install EAS CLI: `npm install -g eas-cli`.
  - Run `eas build:configure`.
  - Set up `eas.json` with `production` and `preview` profiles.
  - Configure build credentials (signing keys) for Android (Keystore) and iOS (Distribution Certificate).

### 7. Store Listings
- Prepare strict privacy policy URL (required for Google Auth).
- Prepare screenshots for 6.5" and 5.5" (iOS) and feature graphics (Android).
- Write descriptions (Short & Long).

## ✅ Verification Checklist

- [ ] `npx tsc` passes without errors (Fix Types).
- [ ] No hardcoded 'demo' accounts work.
- [ ] Google Login works in a release build (SHA-1 fingerprint added to Firebase).
- [ ] Maps load correctly in release build (API Key restrictions configured).
- [ ] Push Notifications (if used) are configured with APNs (iOS) and FCM (Android).

---
**Recommendation**: Start with Task #1 (Fix Types) and Task #2 (Remove Demo Mode) immediately.
