# px-stake-nft-custodial-masterchef

Quest 066. Private. Tested TypeScript rule. No C++ in this repository. Nothing was staked and nothing was paid on chain.

## What is true

`npm test` runs `invariants/chef.test.ts` and `client/claim-action.test.ts`.

- An empty pool moves the clock and does not divide.
- One staker receives `elapsed * rewardPerSec`.
- Two equal weights split that emission.
- `claim` pays once. The debt update makes a second claim at the same time pay 0.
- A later deposit harvests the pending amount, then pending is 0.
- `withdraw` harvests pending on the old weight, reduces weight and `totalWeight`, and sets debt to the remaining weight's index.
- Full withdraw leaves weight 0 and pool `totalWeight` 0.
- Withdraw above stake weight, zero weight, and non-owner are refused.
- Zero weight, a non-owner, and time going backwards are refused.
- When `totalWeight` is larger than `reward * 1e12`, the accumulator truncates and pending is 0.
- A reward of `2^53 + 1` stays exact. `Number` rounds that integer away.
- A reward above `2^62 - 1`, and an accumulator past 128 bits, are refused.
- `client/claim-action.ts` is an unsigned action body. It does not broadcast.

There is no contract file. `cdt-cpp` was not run. There is no wasm.

## Run

```bash
npm test
```

No host is called.

## AtomicAssets v2 — the name "custodial" is not the old holders table

v2 removed the custodial `holders` primitive (and AtomicMarket rentals that used it). This lab never called it. `deposit` / `withdraw` / `claim` move a **weight** and an accumulator. The comment on `withdraw` says it does not transfer an NFT.

A real NFT stake has to take the asset with `atomicassets::transfer` into your contract, then use this math. "Custodial" here means you would own the row. It does not mean `atomicassets::move` or a holders scope. Those actions are not in this tree.

Native backing is also gone. Do not pay rewards by calling `backasset`. Pay `harvested` from your own token contract. The harvested amount is a bigint. This file does not send it.

Map: [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md).

