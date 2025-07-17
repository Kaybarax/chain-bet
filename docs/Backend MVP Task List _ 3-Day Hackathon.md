# Backend MVP Task List (3-Day Hackathon)

**Task Numbering System:**

* BE: Backend Team  
* D1/D2/D3: Day 1 / Day 2 / Day 3  
* T\#: Task Number

---

### **Day 1: API Scaffolding and Mocking**

**Goal:** Establish the complete API surface with mocked data to unblock the frontend team immediately. Set up the foundational database connection.

* **BED1T1\_ProjectSetup:** **Initialize Backend Environment.**  
  * Clone the monorepo prepared by the DevOps team.  
  * Navigate to the apps/web directory (the Next.js project).  
  * Verify that you can run the Next.js development server.  
  * Create a lib directory for shared utilities like database connections.  
*   
* **BED1T2\_HealthEndpoint:** **Create Health Check Endpoint.**  
  * Create the API route app/api/health/route.ts.  
  * Implement a GET handler that returns a 200 OK with the JSON body {"status": "ok"}. This will be used to confirm the backend server is running and accessible.  
*   
* **BED1T3\_MockMatchApi:** **Scaffold and Mock Match Endpoints.**  
  * Create the API route app/api/match/search/route.ts. Implement a GET handler that accepts a search query param (q). Return a hardcoded JSON array of 2-3 match objects.  
  * Create the API route app/api/markets/\[matchId\]/route.ts. Implement a GET handler. Return a hardcoded detailed match object including a list of betting markets.  
  * **Data Model:** For all returned objects, strictly follow the **FOOTBALL BETTING MARKETS** data model. Include a 1X2 market, a BOTH TEAMS TO SCORE (BTTS) market, and a TOTAL GOALS (OVER / UNDER) market with a 2.5 line to provide variety for the frontend.  
*   
* **BED1T4\_MockBetApi:** **Scaffold and Mock Bet and User Endpoints.**  
  * Create app/api/bets/analyze/route.ts. Implement a POST handler that returns a hardcoded JSON object with sample probabilities, e.g., {"HomeWin": 0.45, "Over2\_5Goals": 0.62}.  
  * Create app/api/user/bets/route.ts. Implement a GET handler that accepts a walletAddress query param. Return a hardcoded array of bet objects, including some with a status of 'Pending' and 'Won'.  
*   
* **BED1T5\_MockImageApi:** **Scaffold and Mock Image Identification Endpoint.**  
  * Create app/api/match/identify-by-image/route.ts.  
  * Implement a POST handler that accepts FormData. For now, ignore the image content and immediately return a hardcoded JSON array containing a single, known match object from your mock data. This unblocks the frontend's upload UI.  
*   
* **BED1T6\_DbConnection:** **Implement Database Connection Utility.**  
  * In the lib directory, create a mongodb.ts file.  
  * Write the connection logic to connect to the MongoDB instance running in the project's Docker container.  
  * Implement connection caching on a global variable to prevent creating new connections on every API call, which is critical for serverless environments.  
*   
* **BED1T7\_DbSeedScript:** **Create Database Seeding Script.**  
  * Create a standalone script (scripts/seed.ts) that uses the mongodb.ts utility.  
  * This script should populate the local MongoDB with the exact same mock match and market data that the API endpoints are hardcoded to return. This ensures a smooth transition when switching from mocked responses to live database queries on Day 2\.  
* 

---

### **Day 2: Logic Implementation and Live Data**

**Goal:** Replace all mocked API responses with live logic, including database queries and initial AI integration.

* **BED2T1\_LiveMatchSearch:** **Implement Live Match Search.**  
  * In app/api/match/search/route.ts, remove the hardcoded response.  
  * Connect to MongoDB using the utility from **BED1T6\_DbConnection**.  
  * Implement a search query on your matches collection based on the q query parameter. Use a text index for basic searching. Return the live results from the database.  
  * Do the same for app/api/markets/\[matchId\]/route.ts, fetching the specific match by its ID.  
*   
* **BED2T2\_AIBetAnalysis:** **Integrate Gemini for Bet Analysis.**  
  * In app/api/bets/analyze/route.ts, remove the mocked response.  
  * Use the Google AI SDK to make an API call to a Gemini text model (e.g., gemini-1.5-flash).  
  * Engineer a prompt that takes the match and market details from the request body and asks for probability analysis. Instruct the model to respond ONLY with a valid JSON object.  
  * Parse the JSON from the Gemini response and return it to the frontend.  
  * **Note:** If obtaining Gemini API keys is a blocker, the function should keep the real asynchronous call structure but mock the final return value from the AI service (e.g., return Promise.resolve(mockedAnalysis)).  
*   
* **BED2T3\_AIImageAnalysis:** **Implement Simplified Image-to-Match Flow.**  
  * In app/api/match/identify-by-image/route.ts, implement a simplified version of the AI flow for the hackathon.  
  * Instead of a full multimodal call, use a server-side JavaScript OCR library (like Tesseract.js) on the uploaded image to extract text (team names).  
  * Use the extracted text to perform a search against your MongoDB database.  
  * Return the match candidates found. This simulates the core user experience effectively for the demo.  
  * **Note:** If OCR library setup is too time-consuming, revert to the Day 1 mock. The goal is to show the "image upload \-\> match found" flow, even if the logic is simple.  
*   
* **BED2T4\_LiveUserBets:** **Implement Live User Bet History.**  
  * In app/api/user/bets/route.ts, replace the mock response.  
  * Implement a query to the MongoDB bets collection to find all bets associated with the provided walletAddress.  
  * Return the live data. Initially, this will be empty until the on-chain flow is complete.  
*   
* **BED2T5\_ListenerScriptInit:** **Develop Initial Blockchain Event Listener.**  
  * Create a new standalone script (listeners/blockchainListener.ts).  
  * Use ethers.js or viem to establish a WebSocket connection to the Polygon Mumbai testnet RPC.  
  * Write logic to subscribe to the BetSettled event from a smart contract.  
  * **Note:** Use a placeholder contract address for now. The goal is to get the connection working. When an event is detected, simply console.log the event data. This script will be a long-running process, separate from the Next.js server process.  
* 

---

### **Day 3: Integration and End-to-End Flow**

**Goal:** Connect the backend to the live smart contract, enable database updates from blockchain events, and support the frontend team in E2E testing.

* **BED3T1\_WebhookEndpoint:** **Create Internal Webhook for Settled Bets.**  
  * Create the API route app/api/events/webhook/route.ts.  
  * Implement a POST handler that is secured (e.g., expects a secret API key in the header).  
  * This endpoint will receive settled bet information (bet ID, outcome) from the event listener. Its job is to take this data and update the status of the corresponding bet in the MongoDB bets collection from 'Pending' to 'Won' or 'Lost'.  
*   
* **BED3T2\_ListenerIntegration:** **Finalize and Integrate Event Listener.**  
  * Obtain the final, deployed BettingManager contract address from the Smart Contracts team. Update the blockchainListener.ts script to monitor this correct address.  
  * Instead of just logging to the console, the listener script should now, upon detecting a BetSettled event, make a secure POST request to its own backend's internal webhook (/api/events/webhook from **BED3T1\_WebhookEndpoint**), passing the event data.  
  * This architecture decouples the listener from the main application's database logic.  
*   
* **BED3T3\_PlaceBetSync:** **Implement Off-Chain Bet Record Creation.**  
  * The placeBet action is initiated on the frontend, but the backend needs a record of it.  
  * Modify the blockchain listener (**BED3T2\_ListenerIntegration**) to also listen for the BetPlaced event.  
  * When a BetPlaced event is detected, the listener should call another internal webhook (e.g., /api/events/new-bet) which will create a new bet document in the MongoDB bets collection with a status of 'Pending'. This ensures the user's bet history page updates almost instantly after their on-chain transaction is confirmed.  
*   
* **BED3T4\_IntegrationSupport:** **E2E Integration Support and Debugging.**  
  * Be on standby to support the frontend team during full end-to-end testing.  
  * Use the Next.js server logs and database inspection tools (like MongoDB Compass) to actively debug any issues in the data flow from the client, through the backend, to the database, and back.  
  * Be prepared to quickly resolve any discrepancies found in API request/response formats.  
*   
* **BED3T5\_DemoPrep:** **Prepare Backend for Demonstration.**  
  * Ensure all necessary environment variables (database connection string, AI API key, webhook secret) are correctly configured.  
  * Have a terminal window ready to run the blockchainListener.ts script live during the demo.  
  * Be prepared to show the database records changing in real-time as bets are placed and settled during the demonstration.  
* 

