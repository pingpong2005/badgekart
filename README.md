# Badgekart

Badgekart is a mobile-first storefront for temple magnets, event badges, and custom image keepsakes. It uses React + Vite on the frontend and Firebase Authentication, Firestore, and Storage for the backend.

## Local setup

1. Copy `.env.example` to `.env` and add the Firebase Web App values.
2. In Firebase Authentication, enable Email/Password and Anonymous sign-in.
3. Create a Firestore database and Storage bucket, then deploy `firestore.rules` and `storage.rules`.
4. Create the first admin in Authentication, then add `admins/{uid}` with `{ "role": "admin" }` in Firestore. Admin records are intentionally not client-writable.
5. Install and start:

```bash
npm install
npm run dev
```

The admin dashboard's **Load starter catalog** action seeds the supplied temple images at ₹20 and custom magnet/badge catalog entries at ₹30. Prices, names, types, and images can then be edited from the dashboard.

Orders are stored in Firestore before a pre-filled WhatsApp message opens for the seller at +91 9886448576. Firebase configuration values are public web-app identifiers, but rules and admin documents are the security boundary; enable App Check before production launch.
# badgekart
