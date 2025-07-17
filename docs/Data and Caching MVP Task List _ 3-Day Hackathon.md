# Data & Caching MVP Task List (3-Day Hackathon)

**Task Numbering System:**

* DC: Data & Caching Team  
* D1/D2/D3: Day 1 / Day 2 / Day 3  
* T\#: Task Number

---

### **Day 1: Environment Setup and Data Modeling**

**Goal:** Validate the data infrastructure, define the core data schemas, and create the initial database collections to unblock the backend team.

* **DCD1T1\_DockerEnvValidation:** **Validate Data Service Connectivity.**  
  * Clone the monorepo from the DevOps team.  
  * From the root, run docker-compose up to start the MongoDB, Redis, and Elasticsearch containers.  
  * Using database tools (e.g., MongoDB Compass, Redis CLI, or just running docker ps), confirm that all three services are running and accessible on their default ports. This is the foundational step for all other data tasks.  
*   
* **DCD1T2\_SchemaDefinition:** **Define and Share Core Data Schemas.**  
  * In the packages/types directory, create a database.ts file.  
  * Inside this file, define and export the TypeScript interfaces for your MongoDB collections: Match, Market, and Bet.  
  * **Data Model:** Strictly adhere to the **football-betting-markets-data-model.md** for the structure of these interfaces. For example, the Match interface should contain team names, competition, and an array of Market objects. The Bet interface should include walletAddress, matchId, stake, selection, and a status field.  
  * This file will be the single source of truth for data structures, consumed by the Backend team.  
*   
* **DCD1T3\_MongoCollectionSetup:** **Create MongoDB Collections and Indexes.**  
  * Connect to the local MongoDB instance using a tool like MongoDB Compass or a script.  
  * Create two collections: matches and bets.  
  * In the matches collection, create a text index on the team name fields to enable basic search.  
  * In the bets collection, create an index on walletAddress to allow for efficient lookup of a user's betting history.  
*   
* **DCD1T4\_RedisConnectionUtil:** **Implement Reusable Redis Client.**  
  * In the apps/web/lib directory (alongside the MongoDB utility the BE team is creating), create a redis.ts file.  
  * Implement and export a singleton Redis client instance. This cached client should be configured via environment variables and will be used by the backend to interact with the Redis cache, preventing redundant connections.  
* 

---

### **Day 2: Seeding and Indexing**

**Goal:** Populate the databases with realistic test data and set up the search index, enabling the backend to build live, data-driven features.

* **DCD2T1\_SeedScript:** **Develop Comprehensive Database Seed Script.**  
  * Create a script scripts/seed-database.ts.  
  * This script will connect to MongoDB and wipe the existing matches and bets collections to ensure a clean slate.  
  * It will then insert 5-10 sample match records into the matches collection. Each match should have a variety of markets available, following the **football-betting-markets-data-model.md**. Include 1X2, Both Teams To Score, Double Chance, and several Total Goals (Over/Under) markets to ensure rich test data.  
  * **Note:** If the shared schema from **DCD1T2\_SchemaDefinition** is ready, use those TypeScript types within your script for type safety. Otherwise, mock the object structures for now.  
*   
* **DCD2T2\_ElasticsearchIndexSetup:** **Configure Elasticsearch Match Index.**  
  * Connect to the local Elasticsearch instance.  
  * Create an index named matches.  
  * Define a mapping for this index. The mapping should specify that team names and competition names are of type text (for full-text, fuzzy search) and that matchId is of type keyword (for exact matching).  
  * **Note:** This mapping is crucial for providing the fault-tolerant search the frontend needs.  
*   
* **DCD2T3\_MongoToElasticSync:** **Implement One-Time DB to Search Sync.**  
  * Create a new script scripts/sync-to-elastic.ts.  
  * This script will first read all documents from the MongoDB matches collection.  
  * It will then transform this data into the format required for Elasticsearch and perform a bulk insert into the matches index in Elasticsearch.  
  * For the MVP, this is a manual, one-time sync to be run after seeding the database.  
*   
* **DCD2T4\_RedisCachingWrapper:** **Develop a Generic Caching Utility.**  
  * In apps/web/lib/cache.ts, create a high-level caching wrapper function for the Backend team.  
  * The function signature should be: getOrSet(key: string, asyncFunction: () \=\> Promise\<T\>, ttl: number): Promise\<T\>.  
  * The logic should first try to get the key from Redis. If it exists, parse and return it. If not, it should execute the asyncFunction, set the result in Redis with the specified Time-To-Live (TTL), and then return the result.  
  * **Note:** This utility abstracts away the Redis logic, making it very simple for the backend team to add caching to any function.  
* 

---

### **Day 3: Integration Support and Demonstration**

**Goal:** Assist the backend team in integrating search and caching, monitor the data layer during E2E testing, and prepare for the final demo.

* **DCD3T1\_ElasticsearchQuerySupport:** **Provide Elasticsearch Queries to Backend Team.**  
  * Work directly with the Backend team to implement the GET /api/match/search endpoint.  
  * Your responsibility is to provide the exact Elasticsearch query JSON needed to perform the search.  
  * Provide a query object that uses a multi\_match query to search across the team name and competition fields, including the fuzziness: "AUTO" parameter to handle typos.  
  * **Note:** The deliverable here is the query object itself, which the backend team will embed in their API handler. You are the search expert; they are the API implementers.  
*   
* **DCD3T2\_RedisCacheIntegrationSupport:** **Assist Backend with Cache Implementation.**  
  * Pair with a Backend developer to identify the most expensive operations that would benefit from caching.  
  * Prime candidates are the GET /api/markets/\[matchId\] endpoint and the POST /api/bets/analyze AI analysis call.  
  * Guide the Backend developer on how to wrap their existing logic with the getOrSet caching utility created on Day 2 (**DCD2T4\_RedisCachingWrapper**).  
*   
* **DCD3T3\_E2E\_DataMonitoring:** **Live Data Monitoring and Management.**  
  * During the full team's E2E testing, your role is to be the "DBA on call."  
  * Have MongoDB Compass, Redis CLI, and the Elasticsearch console open.  
  * As the team tests the "Place Bet" and settlement flows, monitor the databases to confirm that records are being created and updated correctly in real-time.  
  * Be prepared to run the seed/sync scripts (**DCD2T1**, **DCD2T3**) on demand to reset the data environment to a clean state between test runs.  
*   
* **DCD3T4\_DemoPrep:** **Prepare Data Layer Talking Points.**  
  * Prepare a concise explanation of the polyglot persistence strategy for the final presentation.  
  * Be ready to answer: "Why use three different databases?"  
  * Example Answer: "We used MongoDB for its flexible document model, which is perfect for our evolving bet structures. We added Elasticsearch because it provides a far superior, fault-tolerant search experience for users trying to find matches. Finally, we used Redis as a high-speed cache to reduce load on our primary database and expensive AI calls, ensuring the application feels fast and responsive."  
* 

