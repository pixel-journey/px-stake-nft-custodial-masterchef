# Security notes — weighted stake rewards

## Mitigated in the lab

| Issue | Behavior |
| --- | --- |
| Non-owner claim/withdraw | refused |
| Over-withdraw weight | refused |
| Time going backwards | refused |
| Empty pool divide | skipped; clock moves |
| Acc / reward overflow caps | throws at MAX |
| Second claim same second | harvested 0 |

## Production still needs

| Concern | Guidance |
| --- | --- |
| NFT custody | `atomicassets::transfer` in/out with memo hygiene |
| Reward funding | Solvent reward vault; do not mint unlimited IOUs silently |
| Auth | `require_auth(owner)` on claim/withdraw |
| Acc precision | Choose SCALE for your reward magnitude |
| Admin | set reward rate under msig; pause path |

Mirror [pxchef](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) is accounting-only, not deployed.
