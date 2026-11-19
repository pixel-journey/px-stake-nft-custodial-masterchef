# Sources

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | Transfer NFT into custody |
| [WAX How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Ownership model |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Reward token, **not** `backasset` |
| [docs.wax.io](https://docs.wax.io/) | Contracts |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Time / auth patterns |

MasterChef is a widely known **index** pattern (accrue per share). This lab is an original teaching port of that idea, not a copy of any third-party farm contract.

## Product facts locked by tests

- **Custodial:** the contract account holds the NFT. Weight is a bigint stake unit in the tests.
- Accrue **before** every weight change. Deposit mid-stream harvests the old weight first.
- Empty pool (`totalWeight === 0`) advances `lastSec` and does **not** divide.
- `SCALE = 10^12`. Pending can still floor to 0 (dust) when weight is larger than `reward * SCALE`.
- Claim sets **debt** to the current index. Second claim at the same timestamp harvests **0**.
- Time must not go backwards. Reward / acc overflow caps refuse oversized values.
- This is **not** the non-custodial scanner. There the player keeps the NFT and claim re-reads owner.

## Related labs

| Lab | Topic |
| --- | --- |
| [non-custodial scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) | Owner still holds the NFT |
| [FT vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) | Share math |
| [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Floor without a scale |
| [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger) | Non-transferable points |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Curriculum order |
