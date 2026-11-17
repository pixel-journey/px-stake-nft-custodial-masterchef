# Security — custodial weight accounting (MasterChef-style)

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Non-owner claim / withdraw | refused |
| Over-withdraw weight | refused |
| Time going backwards | refused |
| Empty pool divide | skipped; **clock still moves** |
| Acc / reward overflow caps | throws at MAX |
| Second claim same second | harvested **0** (correct) |

Accrue **before** any deposit, withdraw, or claim that depends on the index. Debt = `weight * accPerShare / SCALE` after each weight change.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| NFT custody | `atomicassets::transfer` in/out with memo hygiene |
| Reward funding | Solvent reward vault; do not mint unlimited IOUs silently |
| Auth | `require_auth(owner)` on claim/withdraw |
| Acc precision | Choose SCALE for your reward magnitude |
| Admin | set reward rate under msig; pause path |
| Token path | Own FT contract — **not** AtomicAssets `backasset` |

## Attack angles

1. Updating weight **before** accruing (user steals or loses index).
2. Forgetting to harvest on deposit and withdraw.
3. Dividing by zero when `totalWeight == 0` without moving `lastSec`.
4. Calling the player the owner of the NFT after a custodial deposit (contract is the owner).
5. Confusing this with [non-custodial scan](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner).

## Honesty limits

Weight accounting only. No NFT move, no reward token move. Mirror [pxchef](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) is accounting-only, not deployed.
