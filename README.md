# Product Explorer  
Gavriel Shalem  

---

## 📱 Project Overview  
**Product Explorer** is a React Native (CLI) mobile application that allows users to explore products from the open [FakeStore API](https://fakestoreapi.com), view product details, and manage a favorites list.  

The project was developed according to the assignment requirements, using React Native CLI, Redux Toolkit, React Navigation, TypeScript, and Jest.  


## apk file 
https://drive.google.com/file/d/17F5xPdGw2LXl_y0YFOCEHU89yM86fLb1/view?usp=sharing---

## 🧩 Core Features

### 🏠 Home Screen
- **Fetch** button to retrieve products from the API.  
- Displays product **image, title, price**, and **favorite toggle**.  
- **Search bar** to filter products locally.  
- **Pull-to-refresh** and automatic fetch on mount.  
- **Action bar** with two buttons: **Fetch** and **Theme toggle (Dark/Light)**.  
- Optimized list using **FlatList** for smooth scrolling and virtualization.

### ℹ️ Product Details Screen
- Displays full **image, title, price, and description**.  
- Allows users to **add or remove favorites**.  
- Includes a **transition animation** between screens.

### ❤️ Favorites Screen
- Displays all favorited products.  
- Allows users to **remove items** from favorites.  
- Shows an **empty-state message** when there are no favorites.

---

## 🚀 Performance & Optimization
- **Memoization** using `useCallback`, `useMemo`, and `React.memo`.  
- **FlatList** optimization (windowSize, batch rendering, removeClippedSubviews).  
- **Redux selectors** to minimize unnecessary re-renders.  
- Cached API results via `redux-persist` to avoid redundant fetches.

---

## 🧠 Technical Highlights
- **PersistGate Integration** – waits for Redux state rehydration before rendering.  
- **ThemeProvider** – manages light/dark/system themes dynamically.  
- **Reusable Hooks** – `useAppDispatch`, `useAppSelector`, `useTheme`, `useThemeMode`.  
- **Error Handling** – shows a visual error banner when API fails.  
- **Responsive Design** – consistent spacing, adaptive colors, clean layout.  

---

## 🧪 Unit Tests
| Test File | Description |
|------------|--------------|
| `productsSlice.test.ts` | Verifies reducer and async thunk (fetchProducts). |
| `navigation.test.tsx` | Tests navigation from Home → Product Details. |
| `badge.test.tsx` | Checks that the Favorites tab badge updates correctly. |

---

## 📝 How to Run

### Prerequisites
- Node.js 18+  
- Android Studio SDK configured (`ANDROID_HOME` or `local.properties`)  
- Java 17 (Temurin or Zulu)

### Installation
```bash```
npm install

## Run the App

npm start        # Start Metro bundler
npm run android  # Build & run on Android emulator/device

## Run Tests
npm test

## ⚡Troubleshooting
npm start -- --reset-cache
cd android && gradlew clean && cd ..
npm run android

### 📈 Bonus Features Implemented

✅ TypeScript throughout the project
✅ Redux-Persist (Offline caching)
✅ Jest unit tests
✅ Light/Dark theme toggle
✅ Fade screen transition
✅ ESLint auto-cleanup

### 📄 Summary

All functional and technical requirements of the Product Explorer assignment were fully implemented:
- Home, Details, and Favorites screens
- Redux Toolkit, React Navigation, and TypeScript
- Performance optimization, Offline persistence, and Tests
Additional improvements likeark/Light mode toggle and screen animations elevate the UX and code quality to production standards.
