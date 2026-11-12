# px-stake-nft-custodial-masterchef

> **Domain:** weighted stake rewards (acc-per-share)  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

Private. Tested TypeScript rule. No C++ in this repository. Nothing was staked and nothing was paid on chain.

"Custodial" here means a production build would **own** the NFT row after `atomicassets::transfer`. It does **not** mean the removed v2 `holders` table. Pay rewards from your own token contract — not `backasset`. See [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md) and [SOURCES.md](SOURCES.md).

Sibling vault math: [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault).

## Composition note

`chef.composition.test.ts` runs two stakers through time. Harvested plus still-pending equals `elapsed * rewardPerSec`. A second claim at the same timestamp pays 0. A full withdraw moves the next window to whoever is still staked. No token moves.

## What is true

`npm test` runs `invariants/chef.test.ts`, `invariants/chef.composition.test.ts`, and `client/claim-action.test.ts`.

- Empty pool moves the clock and does not divide.
- One staker receives `elapsed * rewardPerSec`; equal weights split emission.
- `claim` pays once; second claim at the same time pays 0; a later window pays only the delta.
- Deposit / withdraw harvest pending on the old weight first.
- Full withdraw clears weight; remaining staker takes the next emission.
- Over-withdraw and non-owner refused.
- `client/claim-action.ts` is unsigned; it does not broadcast.

There is no wasm.

## Run

```bash
npm test
```

No host is called.
