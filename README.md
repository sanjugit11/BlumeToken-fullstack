# Blume Token (BLX) Decentralized DeFi Ecosystem

Welcome to the **Blume Token (BLX)** DeFi Ecosystem. This monorepo implements a production-grade decentralized finance suite with:
1. **Solidity Smart Contracts**: Capped ERC-20 Blume Token (`BLX`), Liquid Staking Token (`stBLX`), unified Staking Manager, EIP-4626 compliant secure Yield Vault, and a constant product AMM Liquidity Pool (`BlumeLP`).
2. **Secure Node.js Express API**: Safe data layer with `ethers.js` wallet caching, request rate-limiting, and dual live-node / simulated sandbox fallback models.
3. **Vite React Frontend**: Glassmorphism DeFi dashboard utilizing modern Outfit typography, ambient neon glows, full MetaMask integration, and dynamic mock states.

---

## 🚀 Quick Start Guide

### 📦 1. Installation

Install all package dependencies across all three workspaces:

```bash
# Install Blockchain Hardhat suite dependencies
cd blockchain && npm install

# Install API Backend dependencies
cd ../backend && npm install

# Install Vite React Client dependencies
cd ../frontend && npm install
```

---

### 🛡 2. Blockchain (Smart Contracts) Setup

The smart contracts are located in the `blockchain/` directory, managed via **Hardhat**.

#### Compile Contracts
```bash
cd blockchain
npx hardhat compile
```

#### Run Unit Tests
Execute the Mocha-Chai validation suite (covering reentrancy defenses, locks, vault calculations, and AMM swaps):
```bash
npx hardhat test
```

#### Run a Local Testnet Node
Start a local EVM node simulating Ethereum accounts:
```bash
npx hardhat node
```

#### Deploy Contracts to Local Testnet
In a separate terminal, deploy, assign permission ownerships, and seed the pools/vaults with initial reserves:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*This command automatically exports the deployed contract addresses to `deployed-addresses.json` at the root directory.*

#### Deploy Contracts to Sepolia Testnet
1. Create a `.env` file inside the `blockchain/` directory or root:
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   PRIVATE_KEY=your_metamask_private_key
   ```
2. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

---

### 📡 3. Secure Node.js Express API Setup

The backend acts as a high-performance caching database and logs transactions.

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Start the API server:
   ```bash
   npm start
   ```
   *The server runs at `http://localhost:5000`. If a local node was run and contracts deployed, it connects live via Ethers.js. Otherwise, it gracefully activates the dynamic simulated sandbox mode.*

---

### 💻 4. Vite React Frontend Setup

Launch the interface dashboard.

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Launch the dev client:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 💎 Features & Interactive Demonstration Walkthrough

When you launch the client, you will see a sleek glassmorphic dashboard:

1. **Faucet Faucet**: Click **"Claim Faucet"** in the top navigation. In **Sandbox Mode**, this instantly gives you `1,000 USDT` and `500 BLX` in your browser wallet state. In **Web3 Mode**, it fires an on-chain transaction to mint real faucet tokens to your MetaMask wallet.
2. **Ecosystem Swaps**: Go to **"Liquidity Pool & Swap"**, type in an amount of USDT, and click **"Swap USDT"**. The card calculates swap slippage and constant-product product reserves ($x \cdot y = k$).
3. **Add Liquidity**: Deposit equal value ratio of `BLX` and `USDT` (e.g. 1000 BLX and 500 USDT) to receive LP shares and begin accruing proportional trading fees.
4. **Classic Staking**: Lock BLX tokens under various schedules (Flexible, 30 days, 90 days, 180 days) yielding higher APY multipliers (up to 28% APY). Unstake matured locking positions or claim rewards.
5. **Liquid Staking (stBLX)**: Deposit BLX to mint liquid `stBLX` shares. You will see the stBLX exchange rate grow over time relative to BLX as simulated validator yields compound. Trade or redeem your stBLX back for BLX + rewards at any time.
6. **EIP-4626 Vault**: Deposit BLX to secure your assets inside the Vault and receive `vBLX` yield shares. Withdrawals enforce a 24-hour lock period to defend against flash loans and charge a 0.5% fee that funds the treasury.

---

### 🏃 How to Run the Project

#### 1. Blockchain (Smart Contracts)

1. Navigate to the `blockchain/` directory:
   ```bash
   cd blockchain
   ```
2. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
3. Start a local testnet node:
   ```bash
   npx hardhat node
   ```
4. Deploy the contracts to the local testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

#### 2. Backend (Node.js Express API)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:5000`.

#### 3. Frontend (React.js)

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at:
   ```
   http://localhost:3000
   ```



   BLXToken deployed at: 0x0CD4b3894ab7d059ba281BFD85b68CB80779C915
   stBLXToken deployed at: 0x83a256da116E5beD7332cB4577779ceACb3ed948
   BlumeStaking deployed at: 0x2A8d73F37e2efe97546D07CFb143d47c2C7402C2
   MockUSDT deployed at: 0x092096Fd1a02EE7DcCbB915d9E4110Db30602603
   MockOracle price feed deployed at: 0xa07a547B0892D454ff1BB4b7a259aB18137ee6a3
   BlumeLP deployed at: 0x73B004fDA8F7054D15B002BD9191fE8eddC85EbF
   BlumeVault deployed at: 0x49701D5F818F63Eb2B8e80Ff5fcBAfC965F354c0
