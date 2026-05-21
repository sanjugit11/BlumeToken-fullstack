import React, { useState } from "react";
import { Web3Provider, useWeb3 } from "./context/Web3Context";

const DashboardApp = () => {
  const {
    walletConnected,
    walletAddress,
    chainId,
    networkName,
    isSandbox,
    loading,
    stats,
    balances,
    userStakes,
    txHistory,
    addresses,
    backendMode,
    setBackendMode,
    connectWallet,
    disconnectWallet,
    stakeClassic,
    unstakeClassic,
    claimClassicRewards,
    stakeLiquid,
    unstakeLiquid,
    depositVault,
    withdrawVault,
    addLiquidity,
    removeLiquidity,
    swapTokens,
    faucetUSDT,
    refreshLiveData
  } = useWeb3();

  const [activeTab, setActiveTab] = useState("overview");

  // Input states
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedLockPeriod, setSelectedLockPeriod] = useState(1); // 30 Days default
  
  const [liquidStakeAmt, setLiquidStakeAmt] = useState("");
  const [liquidUnstakeAmt, setLiquidUnstakeAmt] = useState("");

  const [vaultDepositAmt, setVaultDepositAmt] = useState("");
  const [vaultWithdrawAmt, setVaultWithdrawAmt] = useState("");

  const [swapInput, setSwapInput] = useState("");
  const [swapTokenIn, setSwapTokenIn] = useState("USDT");
  const [swapTokenOut, setSwapTokenOut] = useState("BLX");

  const [lpBlxAmt, setLpBlxAmt] = useState("");
  const [lpUsdtAmt, setLpUsdtAmt] = useState("");
  const [lpRemoveShares, setLpRemoveShares] = useState("");

  // Helpers
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  const displayAddress = (addr) => addr || "Not configured";

  const handleSwapTokenToggle = () => {
    const temp = swapTokenIn;
    setSwapTokenIn(swapTokenOut);
    setSwapTokenOut(temp);
    setSwapInput("");
  };

  const getEstimatedSwapOutput = () => {
    if (!swapInput || isNaN(swapInput)) return "0";
    const amt = parseFloat(swapInput);
    
    // constant product reserves
    const blxRes = stats.pool.blxReserve;
    const usdtRes = stats.pool.usdtReserve;
    
    const fee = 0.997; // 0.3% fee
    if (swapTokenIn === "BLX") {
      return ((amt * fee * usdtRes) / (blxRes + amt * fee)).toFixed(4);
    } else {
      return ((amt * fee * blxRes) / (usdtRes + amt * fee)).toFixed(4);
    }
  };

  return (
    <div>
      {/* 1. Navbar */}
      <header className="navbar">
        <div className="logo-container">
          <div className="logo-icon glow-logo">B</div>
          <div className="logo-text">BLUME DEFI</div>
        </div>

        <div className="nav-wallet-actions">
          <button 
            className="btn-secondary" 
            onClick={faucetUSDT} 
            disabled={loading || !walletConnected}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          >
            Claim USDT Faucet
          </button>

          {walletConnected ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{formatAddress(walletAddress)}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--secondary)" }}>
                  {networkName ? networkName.toUpperCase() : "CONNECTED"}
                </span>
              </div>
              <button className="btn-primary" onClick={disconnectWallet} style={{ padding: "0.5rem 1rem" }}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={connectWallet} disabled={loading}>
              {loading ? <div className="spinner"></div> : "Connect MetaMask"}
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="dashboard-container">
        
        {/* Dynamic Dual-Backend Switcher Ribbon */}
        {/* <div 
          className="sandbox-banner" 
          style={{ 
            background: "linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(34, 211, 238, 0.2))", 
            border: "1px solid var(--primary-active)", 
            marginBottom: "1.5rem" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>⚡ <strong>Backend API Framework:</strong></span>
            <span 
              className="badge" 
              style={{ 
                background: backendMode === "node" ? "rgba(168,85,247,0.3)" : "rgba(34,211,238,0.3)", 
                color: "#fff", 
                padding: "0.4rem 0.8rem", 
                fontSize: "0.85rem",
                fontWeight: "800"
              }}
            >
              {backendMode === "node" ? "Node.js (Express)" : "Laravel (Artisan)"}
            </span>
            <button 
              className="btn-secondary" 
              onClick={() => setBackendMode(backendMode === "node" ? "laravel" : "node")}
              style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", height: "auto" }}
            >
              Switch to {backendMode === "node" ? "Laravel API" : "Node.js API"}
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Active endpoint: <code>{backendMode === "node" ? "http://localhost:5000/api" : "http://localhost:8000/api"}</code>
          </div>
        </div> */}

        {/* Sandbox alert notification */}
        {isSandbox && (
          <div className="sandbox-banner">
            <div>
              <strong>Wallet Not Connected</strong> — Connect MetaMask on Sepolia to read balances and send live contract transactions.
            </div>
            <button 
              className="btn-primary" 
              onClick={connectWallet} 
              style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", background: "rgba(255,255,255,0.1)", border: "1px solid var(--primary)" }}
            >
              Connect MetaMask
            </button>
          </div>
        )}

        {/* 3. Global Stats Ribbon */}
        <section className="stat-grid">
          <div className="glass-panel stat-card">
            <span className="stat-label">BLX Market Price</span>
            <span className="stat-value">${stats.blxPrice.toFixed(2)} USDT</span>
            <span className="stat-sub">Based on Pool reserves ratio</span>
          </div>
          <div className="glass-panel stat-card secondary">
            <span className="stat-label">Protocol TVL</span>
            <span className="stat-value">${stats.totalTVL.toLocaleString()}</span>
            <span className="stat-sub">Across Staking & Vaults</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">Liquid Staking APY</span>
            <span className="stat-value">{stats.staking.liquidAPY}% APY</span>
            <span className="stat-sub">Compounding automatically</span>
          </div>
          <div className="glass-panel stat-card secondary">
            <span className="stat-label">BLX Circulating Supply</span>
            <span className="stat-value">{stats.blxSupply.toLocaleString()} BLX</span>
            <span className="stat-sub">1,000,000,000 Cap limit</span>
          </div>
        </section>

        {/* 4. Tab Selector */}
        <nav className="tab-navigator">
          <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            📊 Portfolio Dashboard
          </button>
          <button className={`tab-btn ${activeTab === "staking" ? "active" : ""}`} onClick={() => setActiveTab("staking")}>
            🥩 High-Yield Staking
          </button>
          <button className={`tab-btn ${activeTab === "swap" ? "active" : ""}`} onClick={() => setActiveTab("swap")}>
            🔀 Liquidity Pool & Swap
          </button>
          <button className={`tab-btn ${activeTab === "vault" ? "active" : ""}`} onClick={() => setActiveTab("vault")}>
            🔒 Secure Yield Vault
          </button>
        </nav>

        {/* ==========================================================
            TAB: Overview Portfolio
            ========================================================== */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", marginBottom: "2rem" }}>
              {/* Asset list */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                  Wallet Holdings
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700" }}>Blume Token (BLX)</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Core Ecosystem Token</div>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--primary)" }}>{balances.blx.toFixed(2)} BLX</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700" }}>Liquid Staked Blume (stBLX)</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Staking shares representation</div>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--secondary)" }}>{balances.stBlx.toFixed(2)} stBLX</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700" }}>Vault Blume Shares (vBLX)</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>EIP-4626 Storage Certificate</div>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--accent)" }}>{balances.vBlx.toFixed(2)} vBLX</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700" }}>Pool LP Shares</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>BLX-USDT Pool backing</div>
                    </div>
                    <span style={{ fontWeight: "800" }}>{balances.lp.toFixed(2)} LP</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700" }}>Tether USD (USDT)</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Pair currency</div>
                    </div>
                    <span style={{ fontWeight: "800", color: "var(--secondary)" }}>${balances.usdt.toFixed(2)} USDT</span>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Accrued Staking Rewards:</span>
                    <span style={{ fontWeight: "700", color: "var(--secondary)" }}>+{balances.pendingRewards.toFixed(2)} BLX</span>
                  </div>
                </div>
              </div>

              {/* Ecosystem details */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                  Platform Contracts Overview
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>BLX ERC-20 Address:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{displayAddress(addresses.BLXToken)}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>Staking Manager:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{displayAddress(addresses.BlumeStaking)}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>Liquidity Pool AMM:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{displayAddress(addresses.BlumeLP)}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                    <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>EIP-4626 Yield Vault:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{displayAddress(addresses.BlumeVault)}</span>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "10px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>STAKING TVL</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)" }}>
                      ${((stats.staking.classicStaked + stats.staking.liquidStaked) * stats.blxPrice).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>VAULT SECURED</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent)" }}>
                      ${(stats.vault.tvl * stats.blxPrice).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>POOL LIQUIDITY</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--secondary)" }}>
                      ${(stats.pool.usdtReserve * 2).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction feed log */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: "1.25rem" }}>Ecosystem Transactions History Log</h3>
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Quantity / Position</th>
                      <th>User Account</th>
                      <th>Tx Hash</th>
                      <th>Time Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txHistory.length > 0 ? (
                      txHistory.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <span className="badge badge-success">{tx.action}</span>
                          </td>
                          <td style={{ fontWeight: "700" }}>{tx.amount}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{formatAddress(tx.address)}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>{tx.hash}</td>
                          <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {new Date(tx.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)" }}>
                          No transactions tracked yet. Deposit or Stake to generate logs!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB: High Yield Staking
            ========================================================== */}
        {activeTab === "staking" && (
          <div className="staking-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Staking interface */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: "1.5rem" }}>Classic High-Yield Staking</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <button 
                    className={`staking-card-btn ${selectedLockPeriod === 0 ? "active" : ""}`}
                    onClick={() => setSelectedLockPeriod(0)}
                  >
                    <div style={{ fontWeight: "700" }}>Flexible</div>
                    <div style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: "800" }}>{stats.staking.flexibleAPY}% APY</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>0-Day lockup</div>
                  </button>

                  <button 
                    className={`staking-card-btn ${selectedLockPeriod === 1 ? "active" : ""}`}
                    onClick={() => setSelectedLockPeriod(1)}
                  >
                    <div style={{ fontWeight: "700" }}>30 Days</div>
                    <div style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: "800" }}>{stats.staking.locked30APY}% APY</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>30-Day lockup</div>
                  </button>

                  <button 
                    className={`staking-card-btn ${selectedLockPeriod === 2 ? "active" : ""}`}
                    onClick={() => setSelectedLockPeriod(2)}
                  >
                    <div style={{ fontWeight: "700" }}>90 Days</div>
                    <div style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: "800" }}>{stats.staking.locked90APY}% APY</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>90-Day lockup</div>
                  </button>

                  <button 
                    className={`staking-card-btn ${selectedLockPeriod === 3 ? "active" : ""}`}
                    onClick={() => setSelectedLockPeriod(3)}
                  >
                    <div style={{ fontWeight: "700" }}>180 Days</div>
                    <div style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: "800" }}>{stats.staking.locked180APY}% APY</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>180-Day lockup</div>
                  </button>
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <span>Stake Amount</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      Balance: {balances.blx.toFixed(2)} BLX
                      <button
                        className="btn-max"
                        onClick={() => refreshLiveData(walletAddress)}
                        disabled={loading || !walletConnected}
                      >
                        Refresh
                      </button>
                    </span>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0.0" 
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                    <div className="token-badge">
                      <span>BLX</span>
                      <button className="btn-max" onClick={() => setStakeAmount(balances.blx.toString())}>MAX</button>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
                  onClick={async () => {
                    if (!stakeAmount || isNaN(stakeAmount)) return;
                    const ok = await stakeClassic(stakeAmount, selectedLockPeriod);
                    if (ok) setStakeAmount("");
                  }}
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : "Stake BLX Tokens"}
                </button>
              </div>

              {/* Liquid staking interface */}
              <div className="glass-panel">
                <div style={{ display: "flex", justifySpaceBetween: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3>Liquid Staking Manager (stBLX)</h3>
                  <span className="badge badge-claimable" style={{ fontSize: "0.8rem", background: "rgba(34, 211, 238, 0.15)" }}>
                    Exchange Rate: 1 stBLX = {stats.staking.stBLXRate.toFixed(4)} BLX
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  Stake your BLX and get liquid stBLX back immediately! stBLX maintains dynamic utility (swapping/LPing) while automatically collecting compounding staking yield over time.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {/* Mint stBLX */}
                  <div>
                    <div className="form-label">
                      <span>Stake BLX for stBLX</span>
                      <span>Bal: {balances.blx.toFixed(1)}</span>
                    </div>
                    <div className="input-container">
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0.0" 
                        value={liquidStakeAmt}
                        onChange={(e) => setLiquidStakeAmt(e.target.value)}
                      />
                      <span style={{ fontWeight: "700", color: "var(--primary)" }}>BLX</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.5rem 0 1rem" }}>
                      Estimated Mint: {(parseFloat(liquidStakeAmt || 0) / stats.staking.stBLXRate).toFixed(2)} stBLX
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={async () => {
                        if (!liquidStakeAmt || isNaN(liquidStakeAmt)) return;
                        const ok = await stakeLiquid(liquidStakeAmt);
                        if (ok) setLiquidStakeAmt("");
                      }}
                      disabled={loading}
                    >
                      {loading ? <div className="spinner"></div> : "Stake Liquid"}
                    </button>
                  </div>

                  {/* Redeem stBLX */}
                  <div>
                    <div className="form-label">
                      <span>Redeem stBLX for BLX</span>
                      <span>Bal: {balances.stBlx.toFixed(1)}</span>
                    </div>
                    <div className="input-container">
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="0.0" 
                        value={liquidUnstakeAmt}
                        onChange={(e) => setLiquidUnstakeAmt(e.target.value)}
                      />
                      <span style={{ fontWeight: "700", color: "var(--secondary)" }}>stBLX</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.5rem 0 1rem" }}>
                      Estimated Payout: {(parseFloat(liquidUnstakeAmt || 0) * stats.staking.stBLXRate).toFixed(2)} BLX
                    </div>
                    <button 
                      className="btn-secondary" 
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={async () => {
                        if (!liquidUnstakeAmt || isNaN(liquidUnstakeAmt)) return;
                        const ok = await unstakeLiquid(liquidUnstakeAmt);
                        if (ok) setLiquidUnstakeAmt("");
                      }}
                      disabled={loading}
                    >
                      {loading ? <div className="spinner"></div> : "Unstake / Redeem"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Staking Portfolio info card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="glass-panel">
                <h3 style={{ marginBottom: "1rem" }}>Staking Position</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Total Classic Staked:</span>
                    <span style={{ fontWeight: "700" }}>{balances.blx > 20000 ? "5,000.00" : "0.00"} BLX</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Total Liquid Staked:</span>
                    <span style={{ fontWeight: "700", color: "var(--secondary)" }}>{balances.stBlx.toFixed(2)} stBLX</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Unclaimed Rewards:</span>
                    <span style={{ fontWeight: "800", color: "var(--primary)" }}>{balances.pendingRewards.toFixed(2)} BLX</span>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}
                  onClick={claimClassicRewards}
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : "Claim Staking Yield"}
                </button>
              </div>

              {/* Active Stakes list */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: "1rem" }}>Active Locking Stakes</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {userStakes.map((stake) => (
                    <div 
                      key={stake.index}
                      style={{ 
                        border: "1px solid var(--border)", 
                        borderRadius: "8px", 
                        padding: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.01)"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700" }}>{stake.amount} BLX</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          APY: {stake.apy}% | Lock: {stake.unlockDate}
                        </div>
                      </div>

                      <button 
                        className="btn-primary"
                        style={{ 
                          padding: "0.35rem 0.75rem", 
                          fontSize: "0.75rem", 
                          background: stake.status === "Claimable" ? "var(--primary-solid)" : "rgba(255,255,255,0.05)" 
                        }}
                        onClick={() => unstakeClassic(stake.index)}
                        disabled={loading}
                      >
                        Unstake
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB: Swap & LP Pool
            ========================================================== */}
        {activeTab === "swap" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
            {/* Swap Card */}
            <div className="glass-panel swap-card">
              <h3 style={{ marginBottom: "1.5rem" }}>Ecosystem Swap</h3>

              <div className="form-group">
                <div className="form-label">
                  <span>Pay</span>
                  <span>Balance: {swapTokenIn === "BLX" ? balances.blx.toFixed(2) : balances.usdt.toFixed(2)}</span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.0" 
                    value={swapInput}
                    onChange={(e) => setSwapInput(e.target.value)}
                  />
                  <span style={{ fontWeight: "700", color: swapTokenIn === "BLX" ? "var(--primary)" : "var(--secondary)" }}>
                    {swapTokenIn}
                  </span>
                </div>
              </div>

              <div className="swap-arrows">
                <button className="swap-arrow-btn" onClick={handleSwapTokenToggle}>
                  ⇄
                </button>
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Receive (Estimated)</span>
                  <span>Balance: {swapTokenOut === "BLX" ? balances.blx.toFixed(2) : balances.usdt.toFixed(2)}</span>
                </div>
                <div className="input-container" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly 
                    value={getEstimatedSwapOutput()}
                  />
                  <span style={{ fontWeight: "700", color: swapTokenOut === "BLX" ? "var(--primary)" : "var(--secondary)" }}>
                    {swapTokenOut}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", margin: "1rem 0" }}>
                <span>Trading Fee (0.3%):</span>
                <span>{(parseFloat(swapInput || 0) * 0.003).toFixed(4)} {swapTokenIn}</span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: "100%", justifyContent: "center" }}
                onClick={async () => {
                  if (!swapInput || isNaN(swapInput)) return;
                  const estOut = getEstimatedSwapOutput();
                  const ok = await swapTokens(swapTokenIn, swapInput, (parseFloat(estOut) * 0.98).toString()); // 2% slippage tolerance
                  if (ok) setSwapInput("");
                }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : `Swap ${swapTokenIn}`}
              </button>
            </div>

            {/* Liquidity Pool (LP) deposits */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: "1rem" }}>BLX-USDT Liquidity Provision</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Deposit an equal value ratio of BLX and USDT to back the pool swaps. In return, earn a proportional share of the 0.3% fees generated by traders, compounding directly inside the pool reserves!
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {/* BLX Input */}
                <div>
                  <div className="form-label">
                    <span>BLX Reserve</span>
                    <span>Bal: {balances.blx.toFixed(1)}</span>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0.0" 
                      value={lpBlxAmt}
                      onChange={(e) => {
                        setLpBlxAmt(e.target.value);
                        if (e.target.value) {
                          setLpUsdtAmt((parseFloat(e.target.value) * 0.5).toString());
                        } else {
                          setLpUsdtAmt("");
                        }
                      }}
                    />
                    <span style={{ fontWeight: "700", color: "var(--primary)" }}>BLX</span>
                  </div>
                </div>

                {/* USDT Input */}
                <div>
                  <div className="form-label">
                    <span>USDT Reserve</span>
                    <span>Bal: ${balances.usdt.toFixed(1)}</span>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0.0" 
                      value={lpUsdtAmt}
                      onChange={(e) => {
                        setLpUsdtAmt(e.target.value);
                        if (e.target.value) {
                          setLpBlxAmt((parseFloat(e.target.value) * 2.0).toString());
                        } else {
                          setLpBlxAmt("");
                        }
                      }}
                    />
                    <span style={{ fontWeight: "700", color: "var(--secondary)" }}>USDT</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: "100%", justifyContent: "center", marginBottom: "2rem" }}
                onClick={async () => {
                  if (!lpBlxAmt || !lpUsdtAmt) return;
                  const ok = await addLiquidity(lpBlxAmt, lpUsdtAmt);
                  if (ok) {
                    setLpBlxAmt("");
                    setLpUsdtAmt("");
                  }
                }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Deposit Liquidity Pair"}
              </button>

              {/* LP Redemptions */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "1rem" }}>Withdraw Liquidity</h4>
                <div className="form-label">
                  <span>Burn LP Shares</span>
                  <span>LP Shares Owned: {balances.lp.toFixed(2)} LP</span>
                </div>
                <div className="input-container" style={{ marginBottom: "1rem" }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.0" 
                    value={lpRemoveShares}
                    onChange={(e) => setLpRemoveShares(e.target.value)}
                  />
                  <span style={{ fontWeight: "700" }}>LP Shares</span>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={async () => {
                    if (!lpRemoveShares || isNaN(lpRemoveShares)) return;
                    const ok = await removeLiquidity(lpRemoveShares);
                    if (ok) setLpRemoveShares("");
                  }}
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : "Withdraw Reserves"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB: Secure Yield Vault
            ========================================================== */}
        {activeTab === "vault" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* Storage deposits */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: "1rem" }}>Secure Vault Deposits</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Deposit your BLX tokens into the highly secure EIP-4626 standard storage vault. Stored tokens mint `vBLX` shares which capture automated yields, under strict safety rules:
              </p>
              
              <ul style={{ color: "var(--text-muted)", fontSize: "0.85rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <li>🔒 <strong>Sandwich Protection:</strong> Standard 24-hour delay before withdrawal to defend against yield manipulation exploits.</li>
                <li>🏛 <strong>Withdrawal Fee:</strong> Standard 0.5% withdrawal fee distributed back to the Treasury to support ecosystem sustainability.</li>
              </ul>

              <div className="form-group">
                <div className="form-label">
                  <span>Lock Amount</span>
                  <span>Balance: {balances.blx.toFixed(2)} BLX</span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.0" 
                    value={vaultDepositAmt}
                    onChange={(e) => setVaultDepositAmt(e.target.value)}
                  />
                  <span style={{ fontWeight: "700", color: "var(--primary)" }}>BLX</span>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
                onClick={async () => {
                  if (!vaultDepositAmt || isNaN(vaultDepositAmt)) return;
                  const ok = await depositVault(vaultDepositAmt);
                  if (ok) setVaultDepositAmt("");
                }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Secure Deposit BLX"}
              </button>
            </div>

            {/* Withdrawals */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: "1rem" }}>Redeem Vault Shares</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Burn your `vBLX` shares to withdraw the underlying BLX tokens. Your returned assets will automatically include accumulated compound yields, minus the treasury fee.
              </p>

              <div className="form-group" style={{ margin: "2rem 0" }}>
                <div className="form-label">
                  <span>Redeem Shares</span>
                  <span>vBLX Shares: {balances.vBlx.toFixed(2)} vBLX</span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.0" 
                    value={vaultWithdrawAmt}
                    onChange={(e) => setVaultWithdrawAmt(e.target.value)}
                  />
                  <span style={{ fontWeight: "700", color: "var(--accent)" }}>vBLX</span>
                </div>
              </div>

              <button 
                className="btn-secondary" 
                style={{ width: "100%", justifyContent: "center", borderColor: "var(--accent)", color: "var(--accent)" }}
                onClick={async () => {
                  if (!vaultWithdrawAmt || isNaN(vaultWithdrawAmt)) return;
                  const ok = await withdrawVault(vaultWithdrawAmt);
                  if (ok) setVaultWithdrawAmt("");
                }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : "Unlocks & Withdraw Assets"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Web3Provider>
      <DashboardApp />
    </Web3Provider>
  );
};

export default App;
