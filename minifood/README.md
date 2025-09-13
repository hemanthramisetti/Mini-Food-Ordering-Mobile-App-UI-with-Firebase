# Mini Food Ordering Mobile App (Expo + Firebase)

A minimal food-ordering UI built with React Native (Expo) and Firebase Firestore. Users can browse menu items, add to cart, adjust quantities, and submit an order.

## Features
- Real-time menu from Firestore (`onSnapshot` with `orderBy('name')`)
- Add to cart with quantity selection
- Cart management and order summary
- Submit order to Firestore with timestamp
- Cart persistence via AsyncStorage (survives app restarts)
- Tab icons with live cart badge
- Product details screen (stack inside Menu tab)
- Light/Dark mode following system theme
- Dev-only: one-tap seed sample menu items

## Prerequisites
- Node.js LTS
- Expo CLI: `npm i -g expo`
- A Firebase project (Firestore in Native/Production mode)

## 1) Install dependencies
```bash
npm install
```

## 2) Configure Firebase
Edit `src/config/firebase.js` with your Firebase web config (from Firebase Console > Project Settings > General > Your apps).

Firestore collections expected:
- **menu**: documents like
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomatoes, mozzarella, basil",
  "price": 8.99,
  "imageUrl": "https://..."
}
```
- **orders**: will be created automatically when you submit an order.

## 3) Run the app
```bash
npm run start
```
- Open with Expo Go on your device (Android/iOS) or run on an emulator.

## 4) Dev helper: Seed sample items
- If your `menu` collection is empty, the Menu screen shows a "Seed Sample Menu" button.
- Tapping it will populate a few example items using a batch write.

## 5) Screenshots for submission
Please capture the following screens and include them in the `screenshots/` folder before zipping:
- Menu screen showing a list of items
- Product details screen
- Cart screen with items and total
- Order summary screen before confirmation
- Order confirmation alert (or Firestore orders collection showing new order)

## Notes
- Basic error and loading states are implemented.
- Simple, modern UI with React Navigation (Tabs + Stack).
- No authentication is required for this exercise.