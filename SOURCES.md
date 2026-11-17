# Sources

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | Transfer NFT into custody |
| [WAX How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Ownership model |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Reward token, **not** `backasset` |
| [docs.wax.io](https://docs.wax.io/) | Contracts |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Time / auth patterns |

MasterChef is a widely known **index** pattern (accrue per share). This lab is an original teaching port of that idea, not a copy of any third-party farm contract.

**Custodial:** the contract account holds the NFT. Accrue **before** every weight change. Empty pool still advances `lastSec`.

## Related labs

| Lab | Topic |
| --- | --- |
| [non-custodial scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) | Owner still holds the NFT |
| [FT vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) | Share math |
| [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger) | Non-transferable points |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Curriculum order |
