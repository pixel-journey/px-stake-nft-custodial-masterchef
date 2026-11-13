# Weighted stake rewards (acc-per-share)

> **Domain:** custodial NFT stake + emission math  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** MasterChef-style **acc-per-share** emission: harvested plus still-pending equals `elapsed * rewardPerSec`. Deposit/withdraw harvest on the old weight first. Full withdraw moves the next window to whoever remains staked.

**Code under test:** `npm test` (unit + composition + unsigned claim client). Pure accounting — no wasm in this repo.

**Production mirror (C++ → wasm):** [wax-contract-compiler `pxchef`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxchef) — [run 30](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213844164). WASM SHA256 `fea9173324dc634dadccc3df662f9b623997d9107d0f0898cb3eafe05c20fa1c`. Audit 0 errors / 0 warnings. Does **not** custody NFTs or transfer rewards; **not deployed**.

"Custodial" here means a production build would **own** the NFT row after `atomicassets::transfer`. It does **not** mean the removed v2 `holders` table. Pay rewards from your own token contract — not `backasset`. See [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md).

Sibling vault math: [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault).

## Composition

`chef.composition.test.ts` runs two stakers through time. A second claim at the same timestamp pays 0. A full withdraw moves the next window to whoever is still staked. No token moves.

## What is true (executed)

- Empty pool moves the clock and does not divide.
- One staker receives `elapsed * rewardPerSec`; equal weights split emission.
- `claim` pays once; second claim at the same time pays 0; a later window pays only the delta.
- Deposit / withdraw harvest pending on the old weight first.
- Full withdraw clears weight; remaining staker takes the next emission.
- Over-withdraw and non-owner refused.
- `client/claim-action.ts` is unsigned; it does not broadcast.

```bash
npm test
```

MIT — Pixel Journey
