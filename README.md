# Product Explorer

This is a simple React Native application built without Expo. It allows you to fetch a list of products from the [FakeStoreAPI](https://fakestoreapi.com) and explore them. You can mark products as favourites, view details, and see a badge indicating the number of favourite items in the tab bar.

## Features

- **Home screen** — Displays a button to load products from the API. Once fetched, a list of products is shown with their image, title and price. Each item includes a heart icon to toggle it as a favourite and navigates to a detailed view when tapped.
- **Product details** — Shows the full product image, title, price and description. You can add or remove the product from your favourites directly from this screen.
- **Favourites screen** — Lists all favourited products. If you have not yet favourited anything a placeholder message is shown. A badge on the tab bar displays the current count of favourited items.
- **State management** — Implemented using [Redux Toolkit](https://redux-toolkit.js.org/). Products are fetched via an async thunk and favourites are stored as a list of product IDs.
- **Navigation** — Handled via [React Navigation](https://reactnavigation.org/) using a bottom tab navigator and a nested native stack.
- **TypeScript** — The project uses TypeScript throughout.

## Getting started

### Prerequisites

You need to have the React Native CLI environment installed on your machine. Follow the official [React Native environment setup guide](https://reactnative.dev/docs/environment-setup) for your platform (Android or iOS).

### Installation

Clone the repository and install the dependencies:

```sh
git clone <repository-url>
cd ProductExplorer
npm install
```

### Running the app

Start the Metro bundler:

```sh
npm start
```

In a separate terminal window, run the project on your target platform:

```sh
# For Android (make sure an emulator or device is connected)
npm run android

# For iOS (requires Xcode)
npm run ios
```

### Running tests

The project includes a simple Jest test that verifies the favourites toggle logic. Run the tests with:

```sh
npm test
```

## Notes

- The app makes network requests to the free FakeStoreAPI. If you run into issues fetching data, ensure your device has an internet connection.
- Icons are intentionally kept simple (using text characters) to avoid additional native dependencies. You can replace them with a proper icon library such as `react-native-vector-icons` if desired.
- This repository does not include a pre-built APK or IPA. To generate one, follow the standard React Native build process for your platform.

## License

This project is provided for assessment purposes and carries no specific license.
