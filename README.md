# MyHR - Payslip Management App

React Native application for viewing and managing payslips with native file handling.


## Tech Stack

- **React Native 0.83** (CLI) + TypeScript
- **React Navigation** (native-stack)
- **React Context** (state management)
- **Moment.js** (date utilities)
- **Jest + Testing Library** (47 tests)

**Native modules:**
- `react-native-fs` - File operations
- `react-native-file-viewer` - iOS Quick Look
- `react-native-blob-util` - Android Intents

---

## Setup

### Prerequisites
- Node.js >= 20
- Xcode (iOS) / Android Studio (Android)

### Install
```bash
yarn install
cd ios && pod install && cd ..
```

### Run
```bash
yarn start          # Start Metro
yarn ios            # Run iOS
yarn android        # Run Android
```

---

## Testing

```bash
yarn test                    # Run all tests
yarn test --coverage         # Generate coverage report
open coverage/lcov-report/index.html
```
Note: All the useful scripts are added under scripts in package.json

**Coverage:**
- 47 tests across 5 suites
- 100% on date utilities
- 95% on state management
- 92% on list screen

Note: Find more details by generating the coverage report

---

## Implementation Notes

### Native File Handling
- PDFs bundled in `src/assets/payslips/`
- iOS: Added to Xcode's "Copy Bundle Resources"
- Android: Placed in `android/app/src/main/assets/`
- Preview uses platform-specific native viewers
- Download copies to user-accessible directories

### Search
Searches across: ID, filename, month name, year, company name

### State Management
React Context with `useMemo` for filtering/sorting performance

---

## Known Limitations

- Mock data only (no API)
- iOS Simulator may not support file preview (use real device)

---

## Future Improvements

- API integration
- Upload to Google Drive option
- Multiple selection, timeline view and allow user to switch between full & half-width list views
- UX: Press & hold to quickly preview the document, shared element transition when navigating to details screen
- Replace alerts with toast
- Biometric authentication
- File sharing
- Dark mode
- Increase test coverage to 100%

---

## Screenshots

Screenshots can be found under Snapshots folder for visual reference.


