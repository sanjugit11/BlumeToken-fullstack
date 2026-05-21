=================================================
Step 1: Deploying BLXToken...
✓ BLXToken deployed at: 0x0CD4b3894ab7d059ba281BFD85b68CB80779C915

Step 2: Deploying stBLXToken...
✓ stBLXToken deployed at: 0x83a256da116E5beD7332cB4577779ceACb3ed948

Step 3: Deploying BlumeStaking...
✓ BlumeStaking deployed at: 0x2A8d73F37e2efe97546D07CFb143d47c2C7402C2

Step 4: Setting contract permissions...
✓ stBLXToken ownership transferred to BlumeStaking
✓ BlumeStaking added as minter on BLXToken

Step 5: Deploying Mock USDT...
✓ MockUSDT deployed at: 0x092096Fd1a02EE7DcCbB915d9E4110Db30602603

Step 6: Deploying Mock Chainlink Oracle...
✓ MockOracle price feed deployed at: 0xa07a547B0892D454ff1BB4b7a259aB18137ee6a3

Step 7: Deploying BlumeLP Pool...
✓ BlumeLP deployed at: 0x73B004fDA8F7054D15B002BD9191fE8eddC85EbF

Step 8: Deploying BlumeVault (EIP-4626)...
✓ BlumeVault deployed at: 0x49701D5F818F63Eb2B8e80Ff5fcBAfC965F354c0

Step 9: Setting BLX Transfer Limits Exclusions...
✓ Staking, LP, and Vault excluded from BLX transfer limits

Step 10: Seeding Liquidity Pool and Vault...
Approving tokens to BlumeLP pool...
Depositing initial reserves to BlumeLP pool...
✓ BlumeLP pool seeded with 100,000 BLX and 50,000 USDT!
Approving and depositing 10,000 BLX to BlumeVault...
✓ BlumeVault seeded with 10,000 BLX!
Approving and staking 5,000 BLX in BlumeStaking (Classic - 30 days)...
✓ Classic Staking seeded with 5,000 BLX!
Approving and staking 5,000 BLX in BlumeStaking (Liquid)...
✓ Liquid Staking seeded with 5,000 BLX!

=================================================
Ecosystem deployed successfully!

=================================================
3. Security Audit Report
=================================================

The smart contract security audit report is documented in:

`SECURITY_AUDIT_REPORT.md`

Summary:
- Compile result: PASS
- Hardhat security/unit tests: PASS, 5 passing
- Manual review covered reentrancy, flash-loan/oracle manipulation, arithmetic safety, front-running/slippage, access control, and gas considerations.
- Fix applied: `BlumeVault.totalAssets()` now includes vault-owned BLX that has been auto-staked into `BlumeStaking`.
- Fix applied: anti-whale wallet-limit test now validates the non-exempt user transfer path.
- Deployment note: the vault fix is in local source code; redeploy `BlumeVault`/ecosystem to Sepolia for the fix to exist on-chain.
- MythX status: artifacts are ready for MythX-style analysis, but MythX SaaS/API scan was not executed locally because credentials/tooling are not configured.
