# Frontend MVP Task List (3-Day Hackathon)

**Task Numbering System:**

* FE: Frontend Team  
* D1/D2/D3: Day 1 / Day 2 / Day 3  
* T\#: Task Number  
* W/M/S: Web / Mobile / Shared

---

### **Day 1: Foundation and Static UI**

**Goal:** Establish the project structure, create static UI screens with mock data, and validate the shared component pipeline.

* **FED1T1S\_Setup:** **Monorepo Initialization and Dependency Installation.**  
  * Clone the finalized monorepo structure prepared by the DevOps team.  
  * Run pnpm install from the root directory to install all dependencies for the web, native, and shared packages.  
  * Confirm that both the web (apps/web) and native (apps/native) applications can be launched successfully.  
*   
* **FED1T2W\_WebNavigation:** **Web App Shell and Navigation.**  
  * Within apps/web, create the file-based routing structure for the main application screens:  
    * app/page.tsx (Home/Search Page)  
    * app/match/\[matchId\]/page.tsx (Match Details Page)  
    * app/profile/page.tsx (User Profile/Bets Page)  
  *   
  * Implement a basic layout component (components/Layout.tsx) that includes a header and placeholder navigation links.  
*   
* **FED1T3M\_MobileNavigation:** **Mobile App Shell and Navigation.**  
  * Within apps/native, configure React Navigation.  
  * Set up a Stack Navigator with initial routes for Search, MatchDetails, and Profile.  
  * Ensure basic navigation between these empty screens is functional.  
*   
* **FED1T4S\_SharedComponent:** **Create and Test a Shared UI Component.**  
  * In the packages/ui directory, create a universal \<Button\> component using React Native primitives (\<Pressable\>, \<Text\>).  
  * Ensure react-native-web is configured for the web app.  
  * Import and use this shared \<Button\> component in both the web app's main page and the mobile app's main screen to validate that the monorepo code-sharing is working correctly.  
*   
* **FED1T5S\_MockApiClient:** **Develop Mock API Client.**  
  * Create a packages/api-client directory. Inside, create a mock.ts file.  
  * This file will export functions that simulate API calls by returning hardcoded data.  
  * Implement getMatches(query: string): Returns a static array of 2-3 match objects. Use the **FOOTBALL BETTING MARKETS** data model for structure (e.g., include team names, competition, and a default 1X2 market).  
  * Implement getMatchDetails(matchId: string): Returns a single detailed match object, including several markets from the data model like **BOTH TEAMS TO SCORE (BTTS)** and **TOTAL GOALS (OVER / UNDER)**.  
  * **Note:** If the backend team provides their API specification (e.g., OpenAPI/Swagger doc) early, align the mock function signatures and return types with that specification.  
*   
* **FED1T6W\_MatchSearchScreen:** **Build Web Match Search Screen (Static).**  
  * Develop the UI for the main search page (app/page.tsx).  
  * Include a text input for search and a list to display results.  
  * Use the mock API client (getMatches) to fetch and display the list of matches when a user performs a search. Each item in the list should be a clickable link that navigates to the app/match/\[matchId\] route.  
*   
* **FED1T7M\_MatchSearchScreen:** **Build Mobile Match Search Screen (Static).**  
  * Develop the UI for the Search screen in the mobile app.  
  * This task is parallel to **FED1T6W\_MatchSearchScreen** and should achieve the same functionality using React Native components and the shared mock API client. Tapping a match item should navigate to the MatchDetails screen.  
*   
* **FED1T8S\_MarketComponents:** **Build Reusable Market Display Components.**  
  * In packages/ui, create components to display different types of betting markets based on the provided data model.  
  * Create a \<ThreeWayMarket\> component to display **1X2** markets.  
  * Create a \<BttsMarket\> component for **BOTH TEAMS TO SCORE (BTTS)**.  
  * Create an \<OverUnderMarket\> for **TOTAL GOALS (OVER / UNDER)** markets.  
  * These components will take market data as props and render the selectable options (e.g., "Home," "Draw," "Away," "Yes," "No," "Over 2.5"). For now, clicking these options can just log to the console.  
*   
* **FED1T9W\_MatchDetailsScreen:** **Build Web Match Details Screen (Static).**  
  * Develop the UI for the app/match/\[matchId\]/page.tsx screen.  
  * Use the mock API client (getMatchDetails) to fetch the details for a given match.  
  * Display the match information (teams, competition).  
  * Use the shared market components (**FED1T8S\_MarketComponents**) to render the list of available betting markets.  
*   
* **FED1T10M\_MatchDetailsScreen:** **Build Mobile Match Details Screen (Static).**  
  * Parallel to **FED1T9W\_MatchDetailsScreen**, implement the MatchDetails screen in the mobile app using the same shared components and mock data source.  
* 

---

### **Day 2: Interactivity and Connectivity**

**Goal:** Replace mock data with live API calls, implement state management, and integrate wallet connectivity.

* **FED2T1S\_LiveApiClient:** **Integrate Live Backend API.**  
  * In the packages/api-client directory, create a live.ts file.  
  * Implement the same functions as the mock client (getMatches, getMatchDetails), but this time use fetch or axios to call the backend's local development server (http://localhost:3000/api/...).  
  * Update all screens in both web and mobile apps to use the live API client.  
  * Implement loading states (e.g., show a spinner while fetching) and error states (e.g., display an error message if the API call fails).  
  * **Note:** If the backend API is not yet functional, continue using the mock client to avoid being blocked. The code should be structured to easily switch between mock and live clients.  
*   
* **FED2T2S\_StateManagement:** **Implement Client-Side State.**  
  * Use React's Context API to create a global state provider.  
  * Create a BetSlipProvider to manage the state of the user's bet slip (selections, stake).  
  * Create a UserProvider to hold the connected wallet address and chain information.  
  * Wrap both the web and mobile application roots with these providers.  
*   
* **FED2T3S\_BetSlipFunctionality:** **Develop Interactive Bet Slip.**  
  * Create a \<BetSlip\> component in packages/ui.  
  * Update the market components (**FED1T8S\_MarketComponents**) so that clicking an outcome (e.g., "Home" win) adds that selection to the BetSlipContext.  
  * The \<BetSlip\> component should display the selected bets, include an input field for the stake amount, and have a "Place Bet" button. The button will be disabled for now.  
*   
* **FED2T4W\_WebWalletIntegration:** **Integrate Web3Modal for Web.**  
  * In apps/web, install and configure @web3modal/wagmi and wagmi.  
  * Set up the WagmiConfig with the required chains (Polygon, Moonbeam, and their testnets) and your WalletConnect projectId.  
  * Implement a "Connect Wallet" button in the header. Clicking it should open the Web3Modal interface.  
  * Upon successful connection, display the user's truncated address in the UI using the useAccount hook from wagmi.  
*   
* **FED2T5M\_MobileWalletIntegration:** **Integrate Web3Modal for Mobile.**  
  * In apps/native, install and configure @web3modal/wagmi-react-native, ensuring all peer dependencies (@react-native-async-storage/async-storage, react-native-modal, etc.) are correctly installed.  
  * Implement the "Connect Wallet" functionality, which will use deep-linking to open installed wallet apps.  
  * Mirror the functionality of **FED2T4W\_WebWalletIntegration**, displaying the connected user's address.  
*   
* **FED2T6S\_AIAnalysis:** **Integrate AI Analysis Feature.**  
  * On the Match Details screen, add an "Analyze Bet" button to the bet slip.  
  * When clicked, this button will call the backend's POST /api/bets/analyze endpoint, sending the matchId and the user's current selections.  
  * The frontend should then display the probabilities returned by the API in a clear, user-friendly format next to the corresponding markets.  
  * **Note:** If the backend endpoint is not ready, mock the request to return a sample probability object (e.g., {"HomeWin": 0.45, "Over2\_5Goals": 0.62}).  
* 

---

### **Day 3: On-Chain Actions and Final Integration**

**Goal:** Enable on-chain transactions, build the final screens, and perform end-to-end testing for the demo.

* **FED3T1S\_PlaceBet:** **Implement "Place Bet" On-Chain Transaction.**  
  * This is the critical path task. Obtain the final BettingManager smart contract address and ABI from the Smart Contracts team.  
  * In the \<BetSlip\> component, enable the "Place Bet" button.  
  * On click, use the useWriteContract hook from wagmi to call the placeBet function on the smart contract.  
  * The parameters (matchId, marketId, selection) should be sourced from the bet slip state, and the value should be the stake amount entered by the user (converted to the correct units, e.g., wei).  
  * **Note:** If the contract address/ABI is not yet available, the button should simply log all the transaction parameters to the console to prove the data is being correctly gathered.  
*   
* **FED3T2S\_TransactionFeedback:** **Implement Transaction State UI Feedback.**  
  * Leverage the state provided by the useWriteContract hook (isLoading, isSuccess, isError).  
  * When the "Place Bet" transaction is pending, show a loading indicator (e.g., "Processing transaction...").  
  * On success, show a confirmation message and a link to the transaction on the relevant block explorer (e.g., Polygonscan).  
  * On error, display a user-friendly error message.  
*   
* **FED3T3W\_UserBetHistory:** **Build Web User Bet History Page.**  
  * Develop the UI for the app/profile/page.tsx screen.  
  * When the screen loads, call the GET /api/user/bets?walletAddress={address} endpoint, using the currently connected wallet address.  
  * Display the returned list of bets, showing key information and the current status ('Pending', 'Won', 'Lost').  
  * **Note:** If the endpoint is not ready, use a mocked response that includes bets with different statuses to build the UI.  
*   
* **FED3T4M\_UserBetHistory:** **Build Mobile User Bet History Page.**  
  * Parallel to **FED3T3W\_UserBetHistory**, implement the Profile screen in the mobile app to display the user's betting history.  
*   
* **FED3T5W\_ImageUpload:** **Implement Image Upload UI for Web.**  
  * On the search page, add a button to upload an image.  
  * Use a file input to allow the user to select a screenshot.  
  * On selection, send the image file in a FormData object via a POST request to the /api/match/identify-by-image endpoint.  
  * Display the match candidates returned by the backend.  
  * **Note:** This is a "stretch goal" for the hackathon but demonstrates a key feature. If the backend is not ready, mock the response by immediately returning a hardcoded match after any image is selected.  
*   
* **FED3T6S\_E2E\_Testing:** **Full End-to-End Flow Testing.**  
  * As a full team, conduct a thorough test of the complete user journey on the web application.  
  * **Demo Script:** Search for a match \-\> Select it \-\> Add a bet to the slip \-\> Click "Analyze Bet" \-\> Connect Wallet \-\> Click "Place Bet" \-\> Confirm in MetaMask \-\> Verify success message \-\> Navigate to Profile \-\> See the "Pending" bet in history.  
  * Identify and fix any integration bugs found between the frontend, backend, and smart contract.  
*   
* **FED3T7S\_DemoPrep:** **Final Polish and Demo Preparation.**  
  * Address any major UI/UX issues to ensure the application is presentable.  
  * Confirm all team members have the demo script and necessary assets (e.g., funded testnet wallets).  
  * Assist in recording a video of the successful E2E flow as a backup for the live presentation.  
* 

