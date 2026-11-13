# Tips — MasterChef-style pools on WAX

## Math

- Accrue **before** any deposit/withdraw/claim that depends on index.
- Debt = `weight * accPerShare / SCALE` after each weight change.
- Empty pool: move `lastSec` forward **without** dividing by zero.

## Custody wording

"Custodial" means production would **own** the NFT after `atomicassets::transfer`. This lab is **weight accounting only** — no NFT transfer, no reward token transfer.

Do **not** pay rewards via AtomicAssets `backasset`. Use your own token contract.

## Related

| Concern | Lab |
| --- | --- |
| FT share vault rounding | [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) |
| Non-custodial scan patterns | [px-stake-nft-noncustodial-scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) |
| AA v2 notes | [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md) |
| C++ mirror | [pxchef](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) |

## Common mistakes

1. Forgetting to harvest on deposit/withdraw.
2. Updating weight before accruing.
3. Trusting wall clock in unit tests without injectable `now`.
