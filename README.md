# Weighted stake rewards (acc-per-share)

> **Domain:** custodial NFT stake + emission math  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** `px-contract-examples-vault` (private; not this public course)

**Goal:** MasterChef-style **acc-per-share** emission: harvested plus still-pending equals `elapsed * rewardPerSec`. Deposit/withdraw harvest on the old weight first.

**Code under test:** `npm test` (unit + composition + unsigned claim client). Pure accounting — no wasm in this repo.

**Build record, not this course:** a private compiler tree `pxchef` exists and is **not deployed**. It does not custody NFTs or transfer rewards. The course is `npm test` in this repository.

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
