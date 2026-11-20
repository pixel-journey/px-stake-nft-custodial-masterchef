# Sources

| Source | Use |
| --- | --- |
| [atomicassets-contract v2.0.0](https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0) | A real custody is `atomicassets::transfer`. v2 removed the old `holders` primitive. This lab does not send that transfer. |
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
| [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger) | Non-transferable points |
| FT single-sided vault | [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) |
| integer dust lab | [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) — the dust case in this repo is the `SCALE` floor |
| treasury curriculum index | still private (`px-contract-examples-vault`) |
