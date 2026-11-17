# Tips — custodial weight accounting (MasterChef-style)

## Math

- Accrue **before** any deposit, withdraw, or claim that depends on the index.
- Debt = `weight * accPerShare / SCALE` after each weight change.
- Empty pool: move `lastSec` forward **without** dividing by zero.
- Second claim in the same second harvests 0. That is correct, not a stuck claim.

## Custody wording

"Custodial" in production means the contract **owns** the NFT after `atomicassets::transfer`. This lab is **weight accounting only** — no NFT move, no reward token move.

Do **not** pay rewards via AtomicAssets `backasset`. Use your own token contract.

## Common mistakes

1. Updating weight before accruing (user steals or loses index).
2. Forgetting to harvest on deposit and withdraw.
3. Using wall clock in unit tests without an injectable `now`.
4. Calling the player the owner of the NFT after a custodial deposit. The contract is the owner; your table stores the depositor.
5. Confusing this with [non-custodial scan](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner), which never takes the asset.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Multi-pool | One acc index per pool id |
| Boost by template | Multiply weight, re-test debt |
| Reward token tax | [transfer tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) on the claim transfer |
| Pause claims | [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |
| FT shares instead of NFT weight | [single-sided vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) |

## Related

[non-custodial scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) · [FT vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) · [pxchef mirror](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) · [AA v2 notes](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md)
