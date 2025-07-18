# ChainBet: On-Chain Football Betting Platform

ChainBet is a next-generation, decentralized football betting application built on blockchain technology. It offers a unique combination of features:

- **Decentralized, Verifiable Betting**: Place bets directly through smart contracts on Polygon and Moonbeam blockchains
- **AI-Driven Match Analysis**: Get intelligent insights and probability analysis powered by Google Gemini
- **Cross-Platform Experience**: Seamless experience across web and mobile platforms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd chain-bet

# Run the setup script
./scripts/setup.sh

# Start development environment
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the web application.

## 🎮 Key Features

### Match Identification from Images
Upload a screenshot of a football match and our AI will identify the teams and competition, allowing you to quickly find betting markets.

### AI-Powered Probability Analysis
Get intelligent insights on your selected betting markets with our Google Gemini integration, helping you make more informed betting decisions.

### Multi-Chain Support
Place bets on either Polygon or Moonbeam blockchains, taking advantage of:
- Polygon's high transaction throughput and low gas fees
- Moonbeam's integration with the Polkadot ecosystem

### Cross-Platform Experience
Access ChainBet from:
- Web application (Next.js)
- Mobile application (React Native/Expo)

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Native** - Mobile app development with Expo
- **TypeScript** - Type safety across all applications
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Backend-for-Frontend (BFF) architecture
- **MongoDB** - Primary database for match data and betting history
- **Redis** - Caching and transient data storage
- **Elasticsearch** - Advanced search functionality for matches

### Blockchain
- **Polygon & Moonbeam** - EVM-compatible blockchains
- **Hardhat** - Ethereum development environment
- **Ethers.js** - Ethereum library
- **Chainlink Functions** - Oracle for sports results

## 🧪 Development

### Running the Application

```bash
# Start all services
pnpm dev

# Start specific app
pnpm dev:web     # Next.js web app
pnpm dev:mobile  # React Native app
```

### Database Setup

```bash
# Start MongoDB (if not using Docker)
mongod

# Run database migrations
pnpm db:migrate

# Seed database with sample data
pnpm db:seed
```

### Smart Contract Development

```bash
# Start local blockchain
pnpm dev:contracts

# Deploy contracts to local network
pnpm deploy:local

# Run contract tests
pnpm test:contracts
```

## 📱 Mobile App

The ChainBet mobile app provides the same core functionality as the web application, allowing users to:

1. Search for matches
2. Analyze betting markets with AI
3. Place bets using their mobile wallet
4. Track their betting history

To run the mobile app in development:

```bash
pnpm dev:mobile
```

## 🔐 Security

ChainBet prioritizes security through:

- Smart contract audits and best practices
- Secure wallet integration
- Trustless oracle implementation via Chainlink
- Comprehensive testing across all components

## 🤝 Contributing

We welcome contributions to ChainBet! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@chainbet.io
- 💬 Discord: [Join our community](https://discord.gg/chainbet)
- 🐛 Issues: [GitHub Issues](https://github.com/chainbet/chain-bet/issues)

---

**Built with ❤️ by the ChainBet Team**