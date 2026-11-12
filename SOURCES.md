# Official sources

MasterChef-style **acc-per-share** is a general DeFi pattern, not a WAX system contract. On WAX you still need a token contract for rewards and AtomicAssets (or another custody path) if the stake is an NFT.

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, permissions, time |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | If production takes NFT custody via `transfer` |
| [eosio.token reference](https://github.com/eosio/eosio.contracts) | Paying `harvested` as a token transfer |
| Org | [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md) — no holders table; do not use `backasset` for rewards |

## Domain map

| Repo | Role |
| --- | --- |
| [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) | Share floor/ceil vault |
| **This repo** | Weighted acc-per-share, claim once |
| [px-stake-nft-noncustodial-scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) | Stake without moving the NFT |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared math helpers |
