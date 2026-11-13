# Weighted stake rewards (acc-per-share)

> **Domain:** custodial NFT stake + emission math  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** MasterChef-style **acc-per-share** emission: harvested plus still-pending equals `elapsed * rewardPerSec`. Deposit/withdraw harvest on the old weight first.

**Code under test:** `npm test` (unit + composition + unsigned claim client). Pure accounting — no wasm in this repo.

**Production mirror:** [pxchef](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) — [run 30](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213844164). **Not deployed.** Does not custody NFTs or transfer rewards.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Single/multi staker, harvest-on-deposit |
| [TIPS.md](TIPS.md) | Accrue order, custody wording |
| [SECURITY.md](SECURITY.md) | Owner checks and overflow |
| [SOURCES.md](SOURCES.md) | Official + pxchef |

## What is true (executed)

- Empty pool moves the clock and does not divide.
- Equal weights split emission; second claim at same time pays 0.
- Deposit/withdraw harvest pending on old weight first.
- Full withdraw clears weight; remaining staker takes next emission.
- `client/claim-action.ts` is unsigned; does not broadcast.

```bash
npm test
```

MIT — Pixel Journey
