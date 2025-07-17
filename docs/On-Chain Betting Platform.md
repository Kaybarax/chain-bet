# **ChainBet: An On-Chain (Blockchain) Football Betting Application: Technical Specification and MVP Development Roadmap**

## **Part I: Strategic & Architectural Framework**

### **Section 1: Introduction and Revised Vision**

#### **Executive Summary**

This report provides a comprehensive technical specification and development roadmap for a next-generation, on-chain football betting application. It revises the initial project 1 by replacing the Hapi backend with a Next.js Backend-for-Frontend (BFF) architecture, enhancing the dual-chain strategy for Polygon and Moonbeam, and detailing a granular, parallelized 3-day hackathon plan for the Minimum Viable Product (MVP). The project's unique value lies in its triad of features: decentralized, verifiable betting via smart contracts; AI-driven match analysis and user assistance via Google Gemini; and a seamless cross-platform experience on web and mobile, all managed within a unified Turborepo monorepo.

#### **Rationale for Revisions**

The primary architectural change—migrating from a dedicated Node.js/Hapi backend to one built with Next.js API Routes—is a strategic decision aimed at maximizing development velocity and simplifying the initial DevOps footprint, particularly for the rapid MVP phase.2 Next.js, while primarily a React framework, offers robust "Route Handlers" that allow it to serve as an API layer.2 This approach creates a "Backend-for-Frontend" (BFF) pattern, where the API is tightly coupled with the web application but remains capable of serving external clients, such as the native mobile app. This decision leverages the full-stack capabilities of a framework likely already familiar to the frontend team, thereby reducing context-switching and accelerating the path to a demonstrable product. This report will thoroughly analyze the trade-offs of this decision and provide a clear path for implementation and future scaling.

### **Section 2: The Unified Full-Stack Architecture**

#### **2.1 The Monorepo Foundation: A Turborepo-Managed Codebase**

The project's foundation will be a monorepo managed by Turborepo, a high-performance build system designed for modern JavaScript and TypeScript codebases.1 This structure is not merely a convenience; it is a strategic choice critical for enabling the parallel development workflows required for the hackathon and for ensuring long-term consistency across the entire platform. The repository will be organized with a clear separation of concerns: an

apps directory will contain the deployable applications (web, native), and a packages directory will house shared code libraries (ui, config, types, hooks, contracts).6 This modular approach, a best practice demonstrated in numerous official and community examples, allows for efficient code sharing and streamlined dependency management.7

To manage dependencies within this structure, the project will utilize pnpm workspaces. pnpm is highly efficient in its handling of node\_modules, creating a content-addressable store and using symlinks to avoid duplication. This approach is not only fast but also integrates seamlessly with Turborepo's caching and task-running capabilities, making it the ideal choice for a complex, multi-package monorepo.6

#### **2.2 The Backend-for-Frontend (BFF) Pattern with Next.js**

##### **Architectural Shift Analysis**

As per the user directive, the backend architecture will pivot from a dedicated Node.js server with the Hapi framework to a BFF model implemented using Next.js Route Handlers.2 Route Handlers are files within the Next.js App Router (

app/api/.../route.ts) that export functions corresponding to HTTP methods (e.g., GET, POST), allowing the Next.js application to serve as a public API layer.4 This API can serve data to its own frontend components and to external clients, such as the React Native mobile application, making it a viable BFF implementation.3

##### **Justification for MVP**

For the 3-day hackathon and the initial product launch, the Next.js BFF architecture offers compelling advantages. It significantly reduces the cognitive overhead and context-switching for developers who are already working within the React ecosystem.3 It facilitates seamless sharing of TypeScript types, validation schemas, and utility functions between the web frontend and its own API, as they coexist within the same application package. This colocation drastically accelerates the initial setup and development cycle; a single

next dev command can launch both the frontend and backend, simplifying the local development environment. This speed is paramount for achieving the ambitious goals of the hackathon.

##### **Long-Term Considerations and Nuances**

While the BFF pattern with Next.js is optimal for speed, an expert architectural analysis must account for its long-term implications. Community and industry experience indicate that while Next.js API routes are excellent for frontend-centric tasks and MVPs, they were not designed to be a replacement for a full-fledged, standalone backend service handling complex logic for multiple, disparate clients at scale.3 Developers who have followed this path report that the architecture can become difficult to manage when the needs of the mobile app diverge significantly from the web app, potentially leading to a "costly and time-consuming migration later".3

The path forward, therefore, involves embracing the Next.js BFF for its velocity benefits during the MVP and initial launch phases, while architecting the backend logic for future scalability. The Next.js API routes should be treated as a thin "orchestration layer." Their primary responsibility will be to handle incoming HTTP requests, perform validation, and delegate the core business logic—such as interacting with the Gemini API or complex database operations—to modular, framework-agnostic services. These services, housed in the packages directory, will be simple TypeScript/JavaScript modules. This decoupling ensures that if the application's scale demands it, this core logic can be extracted and deployed as a dedicated microservice (e.g., using a more robust backend framework like NestJS) without a complete rewrite of the business rules. The Next.js API routes would then simply become clients to this new microservice.

| Feature | Next.js (BFF) | Dedicated Backend (e.g., NestJS) |
| :---- | :---- | :---- |
| **Development Velocity (MVP)** | **Excellent.** Reduced context switching, unified framework. | **Good.** Requires separate setup and inter-service communication from day one. |
| **Code Sharing (Web)** | **Excellent.** Seamlessly share types, logic, and utilities. | **Fair.** Requires publishing shared packages or using monorepo tooling. |
| **Code Sharing (Mobile)** | **Good.** Can share types/logic from packages, but API is the primary interface. | **Good.** Same as web; API is the contract. |
| **Scalability** | **Good for moderate scale.** Can become a bottleneck if backend logic is complex and tightly coupled. | **Excellent.** Designed for scalability, clear separation of concerns allows independent scaling. |
| **Separation of Concerns** | **Fair.** Tightly couples the web frontend's API to its implementation. | **Excellent.** Enforces a clean boundary between frontend and backend concerns. |
| **Team Learning Curve** | **Low.** Frontend developers can easily build API routes. | **Moderate.** Requires backend-specific framework knowledge. |
| **Long-Term Maintainability** | **Moderate.** Can become complex if not architected with modularity in mind. | **Excellent.** Clear structure and separation make it easier to maintain and evolve. |

#### **2.3 Data Persistence and Caching Strategy**

The application's data layer is designed with a polyglot persistence strategy, using the best tool for each specific job to ensure performance, flexibility, and scalability.

* **MongoDB:** Serving as the primary database, MongoDB's flexible, document-based model is perfectly suited for the application's data structures, which are expected to evolve.1 Bet records, user profiles, and AI analysis results can be stored in a natural, JSON-like format. A critical consideration for using MongoDB with Next.js, especially when deployed to serverless environments like Vercel, is connection management. Naively creating a new database connection for every API request can quickly exhaust connection limits and degrade performance. The best practice, which will be implemented, is to use a connection management utility. This utility caches the MongoDB client promise in a global variable during development to survive hot-reloading and ensures that the connection is reused across serverless function invocations in production, preventing resource exhaustion.9

* **Redis:** This high-speed, in-memory data store will be leveraged for caching and transient data.1 Its primary use cases will be to cache the results of computationally expensive operations, such as the probability analysis from the Gemini API, for a short Time-To-Live (TTL). It will also cache frequently accessed, relatively static data, like upcoming match schedules or popular betting markets, to alleviate load on MongoDB.10 Furthermore, Redis can be used to implement rate-limiting on API endpoints to prevent abuse and ensure service stability. The integration will be handled via a simple utility file (  
  lib/redis.ts) that instantiates and exports a shared Redis client, configured via environment variables.10

* **Elasticsearch:** To deliver a superior user experience for match discovery, Elasticsearch will power the text-based search functionality.1 While MongoDB can perform basic text searches, Elasticsearch provides advanced capabilities like fault-tolerant fuzzy search (handling typos), partial matching, and relevance-based ranking. Match data, including team names, competitions, and dates, will be indexed from MongoDB into Elasticsearch. This creates a dedicated, highly optimized search service that can provide instant and accurate results to user queries, a feature that is difficult to replicate efficiently with a general-purpose database.

#### **2.4 The Decentralized Core: A Dual-Chain Strategy on Polygon and Moonbeam**

The application's on-chain logic will be deployed across two strategic, EVM-compatible blockchains: Polygon and Moonbeam. This dual-chain approach is designed to maximize user reach and leverage the unique advantages of two distinct and growing ecosystems.1

* **Polygon (PoS):** Chosen for its high transaction throughput, low gas fees, and massive, well-established ecosystem.11 Its performance characteristics make it the ideal environment for the high-frequency, low-value transactions typical of a betting application, ensuring a smooth and affordable user experience for placing bets.1

* **Moonbeam:** As an EVM-compatible parachain on Polkadot, Moonbeam serves as a crucial gateway into the Polkadot ecosystem.1 This enables the application to tap into Polkadot's user base and benefit from its shared security model and native interoperability with other parachains, providing a path for future cross-chain features and expansion.13

While both chains support Solidity and the EVM, they are distinct execution environments. They possess different performance metrics, with Polygon currently offering significantly higher transactions per second (TPS) and faster block times.11 They also have different governance models and require entirely separate deployments of smart contracts and Chainlink oracle configurations. The architecture will therefore treat them as independent deployment targets, with all chain-specific addresses and parameters managed through environment variables to ensure clean separation and easy configuration.

#### **2.5 DevOps and Automation: Containerization and Continuous Integration**

A robust DevOps foundation is essential for ensuring smooth, repeatable, and automated development and deployment cycles.

* **Docker & Dev Containers:** To guarantee a consistent environment for all developers, the entire application stack—including the Next.js application, MongoDB, Redis, and Elasticsearch—will be defined and orchestrated using Docker and a docker-compose.yml file. Furthermore, a .devcontainer configuration will be created for Visual Studio Code.1 This allows any developer to launch a complete, containerized development environment with all services and dependencies pre-installed and configured with a single click. This practice effectively eliminates the "it works on my machine" problem and dramatically reduces onboarding time.

* **GitHub Actions for CI/CD:** A continuous integration and continuous deployment (CI/CD) pipeline will be established using GitHub Actions.1 On every pull request, automated workflows will trigger to run linters (like ESLint), code formatters (like Prettier), and the full suite of automated tests for all packages in the monorepo. Upon a successful merge to the  
  main branch, another workflow will build the production-ready Docker image for the Next.js application and push it to a container registry (e.g., GitHub Container Registry or Docker Hub), preparing it for deployment to a cloud environment.

## **Part II: Component Implementation Guide**

### **Section 3: Backend Development with Next.js**

#### **3.1 API Design: Structuring Route Handlers**

The backend API will be built using Next.js App Router Route Handlers. All API logic will reside within the src/app/api/ directory of the Next.js project.2 The file-based routing convention dictates that each endpoint corresponds to a folder path, with the logic contained in a

route.ts file inside that folder. This file will export named functions corresponding to the HTTP methods it supports (e.g., export async function GET(request: Request) {}).4 This structure provides a clean and intuitive organization for the API layer.

The following table specifies the API contract, serving as a clear source of truth for both frontend and backend teams and enabling concurrent development.

| Endpoint | HTTP Method | Description | Request Body/Params | Success Response (2xx) | Error Response (4xx/5xx) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| POST /api/match/identify-by-image | POST | Uploads a match screenshot, invokes Gemini for analysis, and returns potential match candidates. | FormData with image file. | 200 OK with JSON array of Match objects. | 400 Bad Request, 500 Internal Server Error. |
| GET /api/match/search | GET | Searches for matches via Elasticsearch based on a text query. | Query param: q={searchText}. | 200 OK with JSON array of Match objects. | 400 Bad Request, 500 Internal Server Error. |
| GET /api/markets/{matchId} | GET | Fetches the list of available betting markets for a given match. | Path param: {matchId}. | 200 OK with JSON array of Market objects. | 404 Not Found, 500 Internal Server Error. |
| POST /api/bets/analyze | POST | Submits a match and selected markets to Gemini for probability analysis. | JSON body: { matchId, markets: \[...\] }. | 200 OK with JSON probability object. | 400 Bad Request, 500 Internal Server Error. |
| GET /api/user/bets | GET | Fetches the betting history for a specific user wallet from MongoDB. | Query param: walletAddress={address}. | 200 OK with JSON array of Bet objects. | 400 Bad Request, 500 Internal Server Error. |
| POST /api/events/webhook | POST | Internal webhook for the blockchain event listener to report settled bets. | JSON body: { txHash, betId, outcome }. | 204 No Content. | 500 Internal Server Error. |

#### **3.2 AI-Powered Match Intelligence with Google Gemini**

A key differentiator of this application is its intelligent use of Google's Gemini models to enhance the user experience. The integration will focus on two primary functions: match identification from images and probability analysis for bets.

##### **Implementation \- Match Identification (Image Upload)**

The most robust and reliable way to implement image-based match identification is to combine Gemini's multimodal input capabilities with its structured output feature. While documentation provides separate examples for multimodal input and structured JSON output, it confirms that these features can be used together, allowing an image to be processed and returned as a predictable JSON object.15 This avoids brittle string parsing and creates a resilient data pipeline.

When a user uploads an image to the POST /api/match/identify-by-image endpoint, the backend will construct a request to a Gemini model that supports multimodal inputs (e.g., gemini-2.5-flash).18 The request will contain the image data, a text prompt instructing the model, and, crucially, a

responseSchema that defines the desired JSON structure.16

Example Prompt:

"Analyze the provided image of a football match. Extract the names of the two teams, the competition or league, and the current score if it is visible. Adhere strictly to the provided JSON schema and only return the JSON object."

JSON Schema Definition (responseSchema):

This schema will be passed in the generationConfig of the API call to enforce a structured response.17

JSON

{  
  "type": "OBJECT",  
  "properties": {  
    "homeTeam": { "type": "STRING", "description": "The full name of the home team identified." },  
    "awayTeam": { "type": "STRING", "description": "The full name of the away team identified." },  
    "competition": { "type": "STRING", "description": "The name of the league or tournament, if identifiable." },  
    "score": { "type": "STRING", "description": "The current score in 'H-A' format, e.g., '2-1'. Null if not visible." }  
  },  
  "required":  
}

The backend receives this structured JSON, which it can then use to reliably query its own database (MongoDB/Elasticsearch) to find the exact match fixture and return it to the user.

##### **Implementation \- Bet Probability Analysis**

After a user selects a match and the betting markets they are interested in, the frontend will call the POST /api/bets/analyze endpoint. The backend will then leverage a text-based Gemini model to provide AI-driven insights. This requires careful prompt engineering to instruct the model to act as a sports analyst and return probabilities in a structured format.20

Example Prompt Engineering:

The prompt will combine context, a clear instruction, and an output format specification. Using few-shot examples (providing one or two examples of the desired input and output) can further improve the model's consistency and accuracy.20

"You are an expert sports betting analyst. For the upcoming Premier League match between Manchester United and Liverpool, provide the estimated probability (as a decimal between 0 and 1\) for each of the following outcomes. Respond ONLY with a single, valid JSON object that adheres to the following structure: {\\"HomeWin\\": number, \\"Over2\_5Goals\\": number, \\"BothTeamsToScore\\": number}. Do not include any explanatory text before or after the JSON object."

The backend will parse the returned JSON and forward the probability matrix to the frontend, which can then display these insights to the user, enhancing their decision-making process.

#### **3.3 Interacting with the Blockchain: Event Listening**

The Next.js backend's primary role in blockchain interaction is passive listening, not active transaction submission. The user's wallet is responsible for signing and sending transactions like placing a bet.1 The backend's responsibility is to maintain an up-to-date off-chain state that reflects on-chain activity.

To achieve this, a dedicated event listener service will be implemented. This service, which can be a long-running process managed separately or initiated within the Next.js environment, will use a library like ethers.js or viem. It will establish a persistent WebSocket connection to an RPC endpoint for both Polygon and Moonbeam. Through this connection, it will subscribe to specific events emitted by our deployed BettingManager smart contracts, namely BetPlaced and BetSettled.

Upon detecting a BetSettled event, the listener service will parse the event data (which includes the bet identifier, outcome, and payout information). It will then update the corresponding record in the MongoDB database, marking the bet as 'won' or 'lost'. This off-chain database serves as a fast, queryable cache of a user's betting history, which can be efficiently served to the frontends via the /api/user/bets endpoint without needing to scan the blockchain on every request.

### **Section 4: Cross-Platform Frontend Development**

#### **4.1 Maximizing Code Reuse: The packages Directory**

The monorepo's packages directory is the cornerstone of the cross-platform strategy, enabling maximum code sharing between the web and mobile applications.6

* **packages/ui:** This will be a shared component library. A direct one-to-one sharing of React DOM components with React Native is not feasible. The established best practice is to build components using React Native primitives (e.g., \<View\>, \<Text\>, \<Pressable\>) and then use the react-native-web library to compile these components into web-compatible HTML elements. The ui package will therefore contain universal components like \<Button\>, \<Card\>, and \<Input\> written in React Native, which are then consumed by both the native application and the web application. This approach ensures a consistent look, feel, and logic across both platforms from a single source of truth.7

* **packages/types:** This package will export all shared TypeScript types and interfaces, such as Match, Bet, Market, and User. By having all applications and the backend reference this single source for data models, the project enforces end-to-end type safety, reducing integration errors and improving developer confidence.

* **packages/config:** This will contain shared configurations for development tools like ESLint (eslint-config-custom) and TypeScript (tsconfig). This ensures that all code across the monorepo adheres to the same quality standards and compiler options, promoting consistency.7

* **packages/hooks:** This package will house platform-agnostic React hooks. Any business logic encapsulated in a hook that does not depend on a specific platform's APIs (e.g., data formatting, state calculations) can be placed here and reused in both the web and mobile apps, further reducing code duplication.6

#### **4.2 Web App (Next.js & React) and Mobile App (Expo & React Native)**

* **Web App:** The web application will reside in the apps/web directory. It will be built with Next.js and React, leveraging the framework's features like server components for data fetching and optimized rendering. It will consume data from the API routes within the same Next.js project and will use the shared wagmi configuration to interact directly with user wallets for on-chain actions.

* **Mobile App:** The native mobile app for iOS and Android will be located in apps/native and built using Expo.1 Expo provides a managed workflow that simplifies development, building, and updates.1 A critical configuration step for using React Native within a  
  pnpm or yarn monorepo is modifying the metro.config.js file. This configuration must be updated to correctly resolve modules from the root node\_modules directory and to enable support for symlinks, which is how workspaces are handled. This prevents module resolution errors and is essential for the monorepo setup to function correctly.6

#### **4.3 Secure, Multi-Chain Wallet Integration**

To provide a modern, seamless, and secure wallet connection experience, the project will use the combination of Web3Modal and wagmi. This stack is the current industry standard, offering a polished, multi-wallet UI and a comprehensive set of React hooks that dramatically simplify blockchain interactions.22

##### **Multi-Chain Configuration**

The key to supporting both Polygon and Moonbeam lies in the wagmi configuration. The configureChains function is the central point for defining which networks the dApp will support.25

1. **Chain Definitions:** We will import the pre-defined chain objects for polygon and polygonMumbai directly from the wagmi/chains package.26 For Moonbeam, if a pre-defined object is not available, a custom chain object will be created. This object simply requires the network's  
   id, name, nativeCurrency, and an array of rpcUrls.26 The necessary details for Moonbeam are publicly available.27

2. **Provider Setup:** A provider component (e.g., WagmiProvider.tsx) will be created to wrap the root of both the web and mobile applications. This component will initialize wagmi and Web3Modal using the defined chains.  
   **Example wagmi Configuration Snippet:**  
   TypeScript  
   import { configureChains, createConfig } from 'wagmi';  
   import { polygon, polygonMumbai } from 'wagmi/chains';  
   import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';  
   import { createWeb3Modal } from '@web3modal/wagmi/react';

   // Custom chain definition for Moonbeam  
   const moonbeam \= {  
     id: 1284,  
     name: 'Moonbeam',  
     network: 'moonbeam',  
     nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },  
     rpcUrls: {  
       public: { http: \['https://rpc.api.moonbeam.network'\] },  
       default: { http: \['https://rpc.api.moonbeam.network'\] },  
     },  
     blockExplorers: {  
       default: { name: 'Moonscan', url: 'https://moonbeam.moonscan.io' },  
     },  
   };

   const projectId \= process.env.NEXT\_PUBLIC\_WALLETCONNECT\_PROJECT\_ID;

   const { chains, publicClient } \= configureChains(  
     \[polygon, moonbeam, polygonMumbai\], // Add mainnet and testnet chains  
     }) })\]  
   );

   const wagmiConfig \= createConfig({  
     autoConnect: true,  
     publicClient,  
     connectors: \[...\] // Connectors configured for Web3Modal  
   });

   createWeb3Modal({ wagmiConfig, projectId, chains });

##### **React Native Specifics**

For the mobile app, the @web3modal/wagmi-react-native package is required.22 Its implementation necessitates the installation of several peer dependencies, including

react-native-modal, react-native-svg, and @react-native-async-storage/async-storage. Crucially, it also requires the @walletconnect/react-native-compat package to ensure compatibility and handle deep-linking between the dApp and external wallet applications correctly.22

### **Section 5: Smart Contract and Oracle Implementation**

#### **5.1 The Core Betting Contract: A Deep Dive into the Solidity Code**

The on-chain logic will be encapsulated within a single, robust BettingManager.sol smart contract. This contract will serve as the decentralized backend, responsible for the trustless management of all betting activities.

* **Core Data Structures:**

  * struct Bet: A structure to hold the essential information for each individual bet, including the bettor's address, the stake amount (in wei), the marketId, and the user's selection.

  * mapping(bytes32 \=\> Bet) public betsByMatch: A mapping that groups all bets by a unique matchId. This allows for efficient retrieval and processing of all bets related to a specific match during settlement.

  * mapping(bytes32 \=\> bool) public matchSettled: A flag to prevent a match from being settled more than once.

* **Key Functions:**

  * placeBet(bytes32 matchId, uint256 marketId, uint256 selection) external payable: This is the primary user-facing function. It will require that msg.value (the bettor's stake) is greater than zero and that the specified match has not yet been settled. It will construct a Bet struct with the transaction details and push it to the betsByMatch array for the given matchId. Finally, it will emit a BetPlaced(bytes32 indexed matchId, address indexed bettor, uint256 stake) event, which the backend listener can track.

  * settleMatch(bytes32 matchId, bytes memory resultData): This is an internal or access-controlled function that will be triggered by the fulfillment of a Chainlink Functions request. It can only be called by the trusted Chainlink oracle (enforced via require(msg.sender \== functionsOracle)). Its logic will involve:

    1. Decoding the resultData (e.g., the final score) provided by the oracle.

    2. Iterating through the betsByMatch\[matchId\] array.

    3. For each bet, determining if the selection was a winner based on the decoded result.

    4. Aggregating the stakes from losing bets into a prize pool.

    5. Distributing the prize pool proportionally to the winning bettors.

    6. Emitting a BetSettled(address indexed bettor, uint256 payout, bool won) event for each bet.

#### **5.2 Trustless Data Feeds: Integrating Chainlink Functions for Sports Results**

A pivotal update to the architecture is the move from relying on non-existent, pre-built sports data feeds to leveraging the power and flexibility of Chainlink Functions. Publicly available, on-chain data feeds for specific, real-time sports results are not as common as financial price feeds.29 Chainlink Functions is the purpose-built solution for this exact scenario, providing a secure, decentralized, and serverless platform for smart contracts to call any external Web2 API.32 This allows the project to integrate with any professional sports data provider without running its own centralized infrastructure.

* **Implementation Strategy:**

  1. **JavaScript Source Code (sports-api-request.js):** A small JavaScript script will be written. This script will be executed off-chain by the nodes in the Chainlink Decentralized Oracle Network (DON). It will receive a matchId as an argument, construct an HTTP GET request to a chosen sports data API (e.g., SportMonks, TheRundown), and parse the JSON response to extract the final score. Any necessary API keys will be securely managed as encrypted secrets within the Chainlink Functions platform, never exposed on-chain or in the source code.34 The script will then encode the final score into bytes and return it.

  2. **Consumer Contract (BettingManager.sol):** The contract will be modified to become a Chainlink Functions consumer by inheriting from FunctionsClient.sol.35

  3. **Request Triggering:** The process of fetching a match result will be initiated by a Chainlink Automation trigger. A time-based trigger can be configured to run shortly after a match's scheduled end time. This automation will call a requestResult(bytes32 matchId) function in the BettingManager contract.

  4. **Fulfillment:** The requestResult function will build and send the request to the Chainlink Functions DON, specifying the JavaScript source code to execute. Once the DON has executed the script and reached consensus on the result, it will call the fulfillRequest callback function in our contract. This fulfillRequest function is the trusted entry point for the oracle's response. Its implementation will simply call the internal settleMatch function with the data returned by the DON, completing the trustless settlement process.35

#### **5.3 Multi-Chain Deployment with Hardhat**

Hardhat will serve as the comprehensive environment for compiling, testing, and deploying the smart contracts.36

* **Multi-Network Configuration (hardhat.config.ts):** The Hardhat configuration file is the central hub for managing deployments across different networks. It will contain distinct network objects for polygon, polygonMumbai, moonbeam, and moonbaseAlpha.37 Each network configuration will specify its unique RPC  
  url (sourced from a provider like Alchemy or Chainstack) and the accounts to be used for deployment. The deployer's private key will be stored securely in a .env file and loaded into the configuration via process.env.PRIVATE\_KEY to avoid committing sensitive credentials to version control.37

* **Generic and Reusable Deployment Script (scripts/deploy.ts):** A single, elegant deployment script will be written to handle deployments to any configured network. The script will fetch the contract factory using hre.ethers.getContractFactory("BettingManager") and deploy it. To manage chain-specific parameters, such as the unique address of the Chainlink Functions Router on Polygon versus Moonbeam, the script will not hardcode these values. Instead, it will import a helper utility that provides the correct addresses based on the network name (hre.network.name) being targeted during deployment.39 This makes the script highly reusable and maintainable.  
  **Example Deployment Snippet:**  
  TypeScript  
  // scripts/deploy.ts  
  import { ethers, network } from "hardhat";  
  import { getChainConfig } from "../chain-config";

  async function main() {  
    const chainConfig \= getChainConfig(network.name);  
    const BettingManager \= await ethers.getContractFactory("BettingManager");  
    const bettingManager \= await BettingManager.deploy(chainConfig.functionsRouter, chainConfig.linkToken);  
    await bettingManager.waitForDeployment();  
    console.log(\`BettingManager deployed to ${network.name} at: ${await bettingManager.getAddress()}\`);  
  }  
  main().catch((error) \=\> { console.error(error); process.exit(1); });

* **Centralized Chain Configuration (chain-config.ts):** To support the generic deployment script, a dedicated configuration file will centralize all network-specific variables. This is a critical piece of infrastructure for any multi-chain project, as it provides a single source of truth and keeps the deployment logic clean.

| Network Name | Chain ID | Chainlink Functions Router | LINK Token Address |
| :---- | :---- | :---- | :---- |
| polygonMumbai | 80001 | 0x... (Mumbai Address) | 0x... (Mumbai Address) |
| moonbaseAlpha | 1287 | 0x... (Moonbase Address) | 0x... (Moonbase Address) |
| polygon | 137 | 0x... (Mainnet Address) | 0x... (Mainnet Address) |
| moonbeam | 1284 | 0x... (Mainnet Address) | 0x... (Mainnet Address) |

## **Part III: The 3-Day Hackathon MVP: A Parallelized Execution Plan**

### **Section 6: MVP Scope and Parallel Workstream Definitions**

The primary goal of the 3-day hackathon is to build and demonstrate a functional, end-to-end prototype of the core user journey. The focus is on proving the viability of the integrated technology stack, not on UI polish or feature completeness. The MVP will validate the flow: **Search Match \-\> Select Bet \-\> Receive AI Analysis \-\> Place Bet On-Chain \-\> Simulate Settlement \-\> View Result.**

To achieve this ambitious goal within the timeframe, the work is structured into four parallel workstreams, allowing different teams to build their respective components concurrently using mocked interfaces. These streams will converge on Day 3 for final integration.

1. **Team Frontend (Web & Mobile):** Builds all user-facing screens and components. Initially works against a mock API server and simulates wallet interactions.

2. **Team Backend (Next.js & AI):** Develops the API endpoints and AI integration logic. Initially provides hardcoded responses to unblock the frontend team.

3. **Team Smart Contracts (Solidity & Chainlink):** Writes, tests, and deploys the BettingManager contract. Interacts with it via scripts, independent of the UI.

4. **Team DevOps & Setup:** The foundational team that prepares the entire monorepo, CI/CD, and development environment for everyone else.

#### **Hackathon MVP Task Breakdown**

| Task | Team | Day 1 (Foundation) | Day 2 (Implementation) | Day 3 (Integration) |
| :---- | :---- | :---- | :---- | :---- |
| **Monorepo & Docker Setup** | DevOps | **To Do:** Init Turborepo, create app/package skeletons, setup Docker Compose, create devcontainer. | **Done** | **Done** |
| **API Endpoint Scaffolding** | Backend | **To Do:** Create all API routes (route.ts) with hardcoded JSON responses. | **Done** | **Done** |
| **Static UI Screens** | Frontend | **To Do:** Build static screens (Search, Markets) with placeholder data. Set up navigation. | **Done** | **Done** |
| **Smart Contract v1 Draft** | Contracts | **To Do:** Write BettingManager.sol with placeBet. Write unit tests. Deploy to local node. | **Done** | **Done** |
| **Database Integration** | Backend | **Done** | **In Progress:** Replace mock data with live MongoDB queries. | **Done** |
| **AI Integration (Simplified)** | Backend | **Done** | **In Progress:** Implement simplified AI flow (OCR for image, real API for text). | **Done** |
| **API Client Integration** | Frontend | **Done** | **In Progress:** Replace mock client with fetch calls to the live backend. | **Done** |
| **Wallet Integration (Connect)** | Frontend | **Done** | **In Progress:** Integrate Web3Modal/wagmi. Implement "Connect Wallet" button. | **Done** |
| **Contract Deployment (Testnet)** | Contracts | **Done** | **In Progress:** Finalize contract, write deployment script, deploy to Polygon Mumbai. | **Done** |
| **Mock Oracle Script** | Contracts | **Done** | **In Progress:** Write Hardhat script to manually call settleMatch. | **Done** |
| **Full E2E Integration** | All | **Done** | **Done** | **In Progress:** Connect Frontend \-\> Backend \-\> Contracts. |
| **E2E Testing & Demo Prep** | All | **Done** | **Done** | **In Progress:** Full user flow testing, record video, prepare talking points. |

### **Section 7: Day 1 \- Foundation and Scaffolding (Parallel Tasks)**

The goal of Day 1 is to establish a solid foundation for each component, enabling teams to work independently with clear interfaces.

* **Team DevOps & Setup:**

  * Execute pnpm dlx create-turbo@latest to initialize the monorepo with pnpm workspaces.6

  * Within the apps directory, create the initial project structures for web (using create-next-app) and native (using create-expo-app).7

  * Establish the packages directory with subfolders for ui, types, config, and contracts.

  * Create a docker-compose.yml file at the root to define services for mongodb and redis, allowing the entire backend stack to be run locally.

  * Author the .devcontainer/devcontainer.json file to configure a containerized VS Code development environment, specifying the Docker Compose file and installing necessary extensions.

  * Commit and push this foundational structure to the project's GitHub repository, providing a clean starting point for all other teams.

* **Team Backend:**

  * Clone the repository set up by the DevOps team.

  * Within the Next.js project, create the folder structure for all API endpoints specified in the design (e.g., app/api/match/search/route.ts).4

  * Implement each route.ts file with handler functions (GET, POST) that return hardcoded, static JSON data. This acts as a live mock server for the frontend team. For instance, a GET request to /api/match/search?q=team will always return a predefined array of two match objects.

  * Implement a simple /api/health endpoint that returns { status: 'ok' } to verify the server is running.

  * Set up the lib/mongodb.ts connection utility and connect to the local MongoDB instance running in Docker.9 Create a simple script to seed the database with the same hardcoded match data that the mock API returns.

* **Team Frontend:**

  * Begin work within the apps/web and apps/native directories.

  * Implement the basic navigation structure. For the web app, this is handled by Next.js file-based routing. For the mobile app, set up React Navigation with a stack navigator for the primary screens.

  * Build the UI for the main screens (Match Search Page, Betting Markets Page, Bet Slip Component) as static components. Populate them with hardcoded placeholder data to focus on layout and structure.

  * Create a mock API client service (services/apiClient.ts) that simulates fetch calls but returns the same hardcoded JSON data defined by the backend team. This completely decouples the frontend from the backend's progress on Day 1\.

  * Develop one or two simple, universal components in the packages/ui library, such as a themed \<Button\>, and use it in both the web and mobile apps to validate the shared component pipeline.

* **Team Smart Contracts:**

  * Inside packages/contracts, initialize a new Hardhat project (npx hardhat init).36

  * Write the first version of the BettingManager.sol contract, focusing on the core state variables (struct Bet, mappings) and the placeBet function.

  * In the test/ directory, write unit tests using Hardhat and ethers.js specifically for the placeBet function. Tests should verify that the correct events are emitted, stakes are transferred to the contract, and the bet data is stored correctly.

  * Create a simple deployment script in scripts/deploy.ts that can deploy the contract to the local in-memory Hardhat Network, allowing for rapid testing cycles.

### **Section 8: Day 2 \- Feature Implementation and Mocked Connections (Parallel Tasks)**

Day 2 focuses on building out the core logic of each component, replacing initial mocks with functional implementations while maintaining separation between the major parts of the stack.

* **Team Backend:**

  * The primary task is to replace the mocked API responses with live logic. The /api/match/search endpoint should now execute a real query against the local MongoDB instance.

  * **Simplified AI Integration:**

    * **Match Identification:** For the /api/match/identify-by-image endpoint, instead of a full Gemini multimodal integration which may be complex for a hackathon, implement a simplified proxy. Use a lightweight JavaScript OCR library (e.g., Tesseract.js) to extract team names from the uploaded image. Use this extracted text to perform a search against the database. This simulates the "image-to-match" flow effectively for the demo.

    * **Probability Analysis:** For the /api/bets/analyze endpoint, make a real API call to a Gemini text model. If obtaining API keys is a bottleneck, the function can be implemented to return a plausible but randomly generated probability (e.g., Math.random()). The key is to demonstrate the asynchronous call and response flow.

  * Begin development of the blockchain event listener. This can start as a simple Node.js script that uses ethers.js to connect to the Polygon Mumbai testnet RPC via a WebSocket and logs a message to the console whenever it detects a BetSettled event from a predefined address.

* **Team Frontend:**

  * Rip out the mock API client and replace it with actual fetch or axios calls to the backend's local development server (http://localhost:3000/api/...). Implement proper loading and error states in the UI (e.g., show spinners during API calls, display error messages on failure).

  * Implement a simple client-side state management solution (React Context API is sufficient for the MVP) to manage the global state of the application, such as the currently connected wallet address, the selected match, and the contents of the user's bet slip.

  * Integrate Web3Modal and wagmi. The "Connect Wallet" button should now trigger the Web3Modal UI, allowing a user to connect a real wallet (like MetaMask). Upon connection, the UI should display the user's address and balance. The configuration in wagmi should be set up for both Polygon Mumbai and Moonbase Alpha to demonstrate multi-chain readiness.24

* **Team Smart Contracts:**

  * Finalize the BettingManager.sol contract by implementing the full logic for the settleMatch function, including iterating through bets and calculating payouts.

  * Write comprehensive Hardhat tests for the settlement logic, covering scenarios with single winners, multiple winners, and no winners.

  * Enhance the deployment script (scripts/deploy.ts) to be network-aware. Configure hardhat.config.ts with the network details for Polygon Mumbai (RPC URL and deployer private key from .env).

  * Execute the script to deploy the finalized contract to the Polygon Mumbai testnet. Carefully record the deployed contract address.

  * Create a new, separate Hardhat task or script named scripts/settle.ts. This script will act as the "mocked oracle" for the demo. It will take a matchId and a result as arguments and call the settleMatch function on the deployed contract.

### **Section 9: Day 3 \- Integration, E2E Testing, and Demonstration**

Day 3 is integration day. The parallel streams converge to create a single, working application, followed by testing and preparation for the final demonstration.

* **Integration Morning (Critical Path):**

  1. **Contracts \-\> Backend & Frontend:** The Smart Contracts team shares the final Polygon Mumbai contract address and the compiled ABI (BettingManager.json) with the other teams. The Backend team updates their event listener script to monitor this specific address. The Frontend team updates their code to use this address and ABI.

  2. **Frontend \-\> Contracts:** The Frontend team implements the final piece of the on-chain interaction. The "Place Bet" button will now use the useWriteContract hook from wagmi to call the placeBet function on the deployed smart contract, passing the required parameters and the user's stake as the transaction value. This completes the primary end-to-end flow.

  3. **Frontend \-\> Backend:** A final integration pass is performed to ensure all API calls from the frontend to the backend are functioning correctly with the now-live (non-mocked) logic. Any discrepancies in data formats or endpoint behavior are resolved.

* **E2E Testing & Polish:**

  * The entire team collaborates on a full, end-to-end test of the user journey, primarily on the web application for ease of debugging.

  * **The Demo Flow:**

    1. A user searches for a pre-seeded match (e.g., "Manchester United vs Liverpool").

    2. The user selects the match and sees the available betting markets.

    3. They select a market (e.g., "Home Win") and click "Analyze," seeing a probability returned from the backend's AI service.

    4. They enter a stake amount (e.g., 0.1 MATIC) and click "Place Bet."

    5. The MetaMask browser extension prompts for confirmation of the transaction on the Polygon Mumbai testnet.

    6. The user confirms, and the frontend displays a "Transaction Submitted" message, followed by a success confirmation with a link to the transaction on Polygonscan.

  * **The Settlement Demo:**

    1. To simulate the match ending, the Smart Contract team runs their scripts/settle.ts task from the command line, passing the appropriate matchId and a result that makes the user's bet a winner.

    2. The Backend team monitors their console to show that the event listener has detected the BetSettled event.

    3. The Frontend team can then demonstrate the result, either by manually refreshing a "My Bets" page to show the bet's status has changed to "Won," or, if time permits, by implementing a basic WebSocket connection from the backend to push the update to the UI in real-time.

* **Preparing the Demonstration:**

  * Record a high-quality video of the complete, successful E2E flow. This serves as a reliable backup in case of live demo issues.

  * Prepare a clear and concise presentation. Each team lead should have talking points to explain their component's architecture and its role in the overall system.

  * Ensure all necessary testnet wallets are pre-funded with sufficient test MATIC from a public faucet.

  * Have a sample screenshot of a football match ready to demonstrate the image identification feature.

## **Part IV: Future Considerations**

### **Section 10: Post-Hackathon Roadmap**

Following a successful MVP demonstration, the subsequent month will be dedicated to transforming the prototype into a production-ready application. This involves refactoring, hardening, and completing the feature set.

* **Week 1: Refactoring and Hardening:**

  * Refactor all "hackathon-quality" code into clean, maintainable, and well-documented modules.

  * Write a comprehensive suite of unit and integration tests for all components: frontend (React Testing Library, Jest), backend (Jest), and smart contracts (Hardhat).

  * Implement the full, robust Chainlink Functions integration, replacing the mocked oracle script with real Chainlink Automation triggers and secure secret management for API keys.

  * Finalize the CI/CD pipelines in GitHub Actions for automated testing and builds.

* **Week 2: Feature Expansion:**

  * Implement the full range of betting markets as defined in the project specifications, including dynamic UI for markets that require user input.

  * Complete the dual-chain deployment by deploying the finalized contracts and oracle configurations to the Moonbeam mainnet and its testnet, Moonbase Alpha.

  * Build out user-centric features, such as a detailed user profile page and a comprehensive, filterable bet history screen.

* **Week 3: Security and Optimization:**

  * Conduct a thorough internal security review of the BettingManager.sol smart contract, using static analysis tools like Slither and MythX to identify potential vulnerabilities (e.g., reentrancy, integer overflows, access control issues).

  * Profile and optimize the application for performance. This includes optimizing database queries with proper indexing in MongoDB and Elasticsearch, refining AI prompts for faster responses, and ensuring efficient rendering on the frontend.

* **Week 4: Mainnet Deployment and Launch Preparation:**

  * Engage a reputable third-party firm for a professional security audit of the smart contracts. No real funds should be handled before this is complete and all critical issues are remediated.

  * Deploy the audited contracts to the Polygon and Moonbeam mainnets.

  * Deploy the backend and frontend applications to a production cloud environment (e.g., Vercel for the Next.js app, AWS/GCP for containerized services).

  * Conduct final User Acceptance Testing (UAT) with a group of beta testers.

  * Prepare user-facing documentation, tutorials, and support materials for launch.

### **Section 11: Architectural Scaling and Security**

* **Scaling the Next.js BFF:** The choice of a Next.js BFF is a calculated trade-off favoring initial velocity. It is crucial to acknowledge its potential long-term limitations for a complex, multi-client system.3 As the application grows, if API load becomes a performance bottleneck or if the backend requirements for the mobile and web apps diverge significantly, a scaling strategy must be in place. The recommended path is to extract the core business logic (the modular services responsible for AI interaction, database operations, and event processing) into a dedicated, containerized microservice using a backend-first framework like NestJS. The Next.js API routes would then evolve into a true, thin BFF layer, responsible only for authenticating, validating, and proxying requests to this new, independently scalable backend service. The initial modular design makes this transition feasible without a full rewrite.

* **Smart Contract Security:** Security is the most critical aspect of this project, as the smart contracts are intended to manage real user funds. The internal review and static analysis are necessary first steps, but they are not sufficient. Before any mainnet launch, a full, professional security audit by a reputable third-party firm specializing in blockchain security is **non-negotiable**. This audit must cover the BettingManager.sol contract, the Chainlink Functions integration, and the overall economic model to identify and mitigate any potential exploits, including reentrancy attacks, flawed access control, oracle manipulation risks, and logic errors that could lead to a loss of funds. The results of this audit should be made public to build user trust.

#### 

#### **Works cited**

1. Guides: Backend for Frontend | Next.js, accessed July 16, 2025, [https://nextjs.org/docs/app/guides/backend-for-frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)

2. Next.js as backend for mobile and web app : r/nextjs \- Reddit, accessed July 16, 2025, [https://www.reddit.com/r/nextjs/comments/1lx18xx/nextjs\_as\_backend\_for\_mobile\_and\_web\_app/](https://www.reddit.com/r/nextjs/comments/1lx18xx/nextjs_as_backend_for_mobile_and_web_app/)

3. Building APIs with Next.js, accessed July 16, 2025, [https://nextjs.org/blog/building-apis-with-nextjs](https://nextjs.org/blog/building-apis-with-nextjs)

4. Turborepo, accessed July 16, 2025, [https://turborepo.com/](https://turborepo.com/)

5. Setting Up a React and React Native Monorepo with TurboRepo and pnpm | by Alex Derville, accessed July 16, 2025, [https://medium.com/@alex.derville/setting-up-a-react-and-react-native-monorepo-with-turborepo-and-pnpm-8310c1faf18c](https://medium.com/@alex.derville/setting-up-a-react-and-react-native-monorepo-with-turborepo-and-pnpm-8310c1faf18c)

6. Turborepo & React Native Starter \- Vercel, accessed July 16, 2025, [https://vercel.com/templates/next.js/turborepo-react-native](https://vercel.com/templates/next.js/turborepo-react-native)

7. Start with an example \- Turborepo, accessed July 16, 2025, [https://turborepo.com/docs/getting-started/examples](https://turborepo.com/docs/getting-started/examples)

8. How to integrate MongoDB into your Next.js apps | Blog ..., accessed July 16, 2025, [https://www.codewithharry.com/blogpost/how-to-integrate-mongodb-into-your-nextjs-apps](https://www.codewithharry.com/blogpost/how-to-integrate-mongodb-into-your-nextjs-apps)

9. Using Redis with Next.js for Lightning-Fast API Responses | by Melvin Prince | Medium, accessed July 16, 2025, [https://medium.com/@melvinmps11301/using-redis-with-next-js-for-lightning-fast-api-responses-e148f90ad4f0](https://medium.com/@melvinmps11301/using-redis-with-next-js-for-lightning-fast-api-responses-e148f90ad4f0)

10. Polygon vs Moonbeam \[TPS, Max TPS, Block Time\] \- Chainspect, accessed July 16, 2025, [https://chainspect.app/compare/polygon-vs-moonbeam](https://chainspect.app/compare/polygon-vs-moonbeam)

11. Moonbeam: The EVM of Polkadot, accessed July 16, 2025, [https://soliditydeveloper.com/moonbeam](https://soliditydeveloper.com/moonbeam)

12. Moonbeam Network Has Integrated the Chainlink Oracle Network on TestNet, accessed July 16, 2025, [https://moonbeam.network/news/moonbeam-network-has-integrated-the-chainlink-oracle-network-on-testnet/](https://moonbeam.network/news/moonbeam-network-has-integrated-the-chainlink-oracle-network-on-testnet/)

13. NEXT.JS AND MONGODB: IMPLEMENTING CRUD OPERATIONS AND TESTING WITH POSTMAN \- DEV Community, accessed July 16, 2025, [https://dev.to/hezronokwach/building-a-nextjs-back-end-with-mongodb-for-crud-operations-a-guide-to-testing-with-postman-4ne7](https://dev.to/hezronokwach/building-a-nextjs-back-end-with-mongodb-for-crud-operations-a-guide-to-testing-with-postman-4ne7)

14. Image understanding | Gemini API | Google AI for Developers, accessed July 16, 2025, [https://ai.google.dev/gemini-api/docs/image-understanding](https://ai.google.dev/gemini-api/docs/image-understanding)

15. Structured output | Gemini API | Google AI for Developers, accessed July 16, 2025, [https://ai.google.dev/gemini-api/docs/structured-output](https://ai.google.dev/gemini-api/docs/structured-output)

16. Structured output \- Google Gemini API, accessed July 16, 2025, [https://gemini-api.apidog.io/doc-965858](https://gemini-api.apidog.io/doc-965858)

17. Gemini models | Gemini API | Google AI for Developers, accessed July 16, 2025, [https://ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)

18. Generate structured output (like JSON and enums) using the Gemini API | Firebase AI Logic, accessed July 16, 2025, [https://firebase.google.com/docs/ai-logic/generate-structured-output](https://firebase.google.com/docs/ai-logic/generate-structured-output)

19. Prompt design strategies | Gemini API | Google AI for Developers, accessed July 16, 2025, [https://ai.google.dev/gemini-api/docs/prompting-strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

20. How To Get Consistent JSON From Google Gemini (With Practical Example), accessed July 16, 2025, [https://hasanaboulhasan.medium.com/how-to-get-consistent-json-from-google-gemini-with-practical-example-48612ed1ab40](https://hasanaboulhasan.medium.com/how-to-get-consistent-json-from-google-gemini-with-practical-example-48612ed1ab40)

21. How to build a React Native dapp with AppKit \- Reown, accessed July 16, 2025, [https://reown.com/blog/how-to-build-react-native-dapp-with-web3modal](https://reown.com/blog/how-to-build-react-native-dapp-with-web3modal)

22. Web3 Wallets connection using WalletConnect in Next.js | by Kirankumar Gonti \- Medium, accessed July 16, 2025, [https://medium.com/@kirankumar\_gonti/web3-wallets-connection-using-walletconnect-in-next-js-ee9eb97d73c4](https://medium.com/@kirankumar_gonti/web3-wallets-connection-using-walletconnect-in-next-js-ee9eb97d73c4)

23. Best DX for React Native Web3 dApps With Web3Modal and Wagmi, accessed July 16, 2025, [https://www.callstack.com/blog/best-dx-for-react-native-web3-dapps-with-web3modal-and-wagmi](https://www.callstack.com/blog/best-dx-for-react-native-web3-dapps-with-web3modal-and-wagmi)

24. Configuring Chains – @wagmi/core, accessed July 16, 2025, [https://1.x.wagmi.sh/core/providers/configuring-chains](https://1.x.wagmi.sh/core/providers/configuring-chains)

25. wagmi/chains \- React Hooks for Ethereum, accessed July 16, 2025, [https://1.x.wagmi.sh/react/chains](https://1.x.wagmi.sh/react/chains)

26. Add Moonbeam to MetaMask \- Revoke.cash, accessed July 16, 2025, [https://revoke.cash/learn/wallets/add-network/moonbeam](https://revoke.cash/learn/wallets/add-network/moonbeam)

27. Build Modern Web3 dApps on Ethereum With React Native and Viem \- Callstack, accessed July 16, 2025, [https://www.callstack.com/blog/build-modern-web3-dapps-on-ethereum-with-react-native-and-viem](https://www.callstack.com/blog/build-modern-web3-dapps-on-ethereum-with-react-native-and-viem)

28. Decentralized Data Feeds | Chainlink, accessed July 16, 2025, [https://data.chain.link/](https://data.chain.link/)

29. Chainlink Data Feeds: Off-Chain Data for Smart Contracts, accessed July 16, 2025, [https://chain.link/data-feeds](https://chain.link/data-feeds)

30. Chainlink \- Polygon Knowledge Layer, accessed July 16, 2025, [https://docs.polygon.technology/tools/oracles/chainlink/](https://docs.polygon.technology/tools/oracles/chainlink/)

31. Chainlink Functions, accessed July 16, 2025, [https://docs.chain.link/chainlink-functions](https://docs.chain.link/chainlink-functions)

32. Chainlink Any API Documentation, accessed July 16, 2025, [https://docs.chain.link/any-api/introduction](https://docs.chain.link/any-api/introduction)

33. Chainlink Functions — Bring off-chain data into smart contracts easily | by BizThon \- Medium, accessed July 16, 2025, [https://medium.com/@BizthonOfficial/chainlink-functions-bring-off-chain-data-into-smart-contracts-easily-5329a65db5d0](https://medium.com/@BizthonOfficial/chainlink-functions-bring-off-chain-data-into-smart-contracts-easily-5329a65db5d0)

34. Call an API with HTTP Query Parameters \- Chainlink Documentation, accessed July 16, 2025, [https://docs.chain.link/chainlink-functions/tutorials/api-query-parameters](https://docs.chain.link/chainlink-functions/tutorials/api-query-parameters)

35. Deploy a contract with Hardhat \- Polygon Knowledge Layer, accessed July 16, 2025, [https://docs.polygon.technology/zkEVM/how-to/using-hardhat/](https://docs.polygon.technology/zkEVM/how-to/using-hardhat/)

36. Hardhat \- Polygon Knowledge Layer, accessed July 16, 2025, [https://docs.polygon.technology/tools/dApp-development/common-tools/hardhat/](https://docs.polygon.technology/tools/dApp-development/common-tools/hardhat/)

37. Moonbeam tooling \- Chainstack Docs, accessed July 16, 2025, [https://docs.chainstack.com/docs/moonbeam-tooling](https://docs.chainstack.com/docs/moonbeam-tooling)

38. wighawag/hardhat-deploy \- GitHub, accessed July 16, 2025, [https://github.com/wighawag/hardhat-deploy](https://github.com/wighawag/hardhat-deploy)

39. Deploying your contracts | Ethereum development environment for professionals by Nomic Foundation \- Hardhat, accessed July 16, 2025, [https://hardhat.org/hardhat-runner/docs/guides/deploying](https://hardhat.org/hardhat-runner/docs/guides/deploying)

40. Next.js \- Turborepo, accessed July 16, 2025, [https://turborepo.com/docs/guides/frameworks/nextjs](https://turborepo.com/docs/guides/frameworks/nextjs)