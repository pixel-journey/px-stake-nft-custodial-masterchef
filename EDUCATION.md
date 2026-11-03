# Education — acc-per-share, without a pool divide-by-zero

> **Rung:** `npm test` passes. No NFT is custodied. No reward token is transferred. There is no wasm.  
> **The test is the rule.**

`px-stake-ft-single-sided-vault` rounds shares. This lab accrues a reward index. Different question.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Give one staker the whole emission, then split it across two equal weights |
| Intermediate | Show why the second claim is 0, and why an empty pool must not divide |
| Masterclass | Place the `1e12` scale next to the dust case, and say what custody still is |

---

## Beginner — one scene

Pool starts empty: `accPerShare 0`, `totalWeight 0`, `rewardPerSec 5`, `lastSec 0`.

Alice deposits weight 10 at time 0. Four seconds later, pending is **20**.

```text
elapsed   = 4
reward    = 4 * 5 = 20
accDelta  = floor(20 * 10^12 / 10) = 2 * 10^12
pending   = floor(10 * accDelta / 10^12) - debt = 20
```

Bob deposits the same weight at time 0, before any time passes. Four seconds later each pending is **10**. The emission is split.

`claim` of Alice's 20 sets her debt to the accrued index. A second claim at the same timestamp harvests **0**.

### Words

| Word | Meaning here |
| --- | --- |
| `SCALE` | `10n ** 12n`. It lives in the accumulator so small rewards survive integer division |
| Weight | Stake size. The tests use a bigint, not an NFT id |
| Debt | The index already paid. Claim sets debt to the current accrued value |
| Empty pool | `totalWeight === 0`. Time moves. `accPerShare` stays 0. No division |

### Predict, then run

```bash
npm test
```

1. Accrue an empty pool from 0 to 10 with rate 5. `accPerShare` is still 0. `lastSec` is 10.
2. Deposit more weight for Alice at time 4. Harvested is 20, then pending at time 4 is 0.
3. Weight 0 throws `non-positive weight`. Bob cannot deposit onto Alice's stake, and Bob cannot claim it.

---

## Intermediate — the index

```text
if totalWeight == 0:
    lastSec = now
    do not divide
else:
    reward   = elapsed * rewardPerSec
    acc     += floor(reward * SCALE / totalWeight)
pending = floor(weight * acc / SCALE) - debt    (or 0 if debt is ahead)
```

Time must be a bigint and must not go backwards (`time went backwards`). Reward above `MAX_AMOUNT` (`2^62 - 1`) throws `reward exceeds max`. Accumulator above `2^128 - 1` throws `acc overflow`.

### Dust and the scale

Alice deposits weight `SCALE + 1` with `rewardPerSec` 1. One second later:

```text
floor(1 * SCALE / (SCALE + 1)) = 0
```

Pending is 0. The scale moves the threshold. It does not delete it. `px-token-dust-truncation-visualizer` is the same floor with no scale. Do not tell stakers a positive weight always earns a positive integer.

### Bigint vs Number

`2^53 + 1` and `2^53` are the same `Number`. They are not the same bigint. The test deposits rate `2^53 + 1` at weight 1 for one second and asserts pending equals that odd value. A `number` accumulator would have paid the even one.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Accrue before anyone stakes | Divide by zero | skip the division, move time | `an empty pool moves time…` |
| Claim twice | Double harvest | debt catches the index | `claim pays once…` |
| Deposit without harvesting | Reward stuck on the old weight | harvest 20, then pending 0 | `a later deposit harvests…` |
| Clock skew backwards | Huge elapsed | `time went backwards` | that test |
| Weight larger than `reward * SCALE` | Silent zero, or a revert you didn't document | pending 0 | `dust truncates…` |
| JS number math | `2^53 + 1` becomes `2^53` | bigint pending stays odd | `bigint keeps a reward…` |

---

## Masterclass — weight is not an NFT in custody

`deposit` increases `totalWeight` by the bigint you passed. It does not transfer an AtomicAssets id, and it does not check the caller owns one. `claim` returns `harvested`. It does not send a token.

A production chef still has to:

- Take the NFT by a real transfer or `transfer` notify, and key the stake by asset id.
- Pay `harvested` with an inline transfer whose action name is a constant, in the same action that updates `debt`. Updating debt first and sending later double-pays if the send fails and you retry the old debt. Updating debt only after a successful send is the usual order. This file sets debt and returns the number together, which is only safe because nothing else can observe a half-update.
- Decide what an empty-pool time jump means. This lab moves `lastSec` and drops the emission that would have accrued while weight was 0. That is intentional (no division, and nobody was there to earn it). If you instead store that reward and pay it to the next depositor, you have changed the rule. The test would fail.
- Keep `accPerShare` in a wide integer. The lab refuses `2^128` overflow. A `uint64` acc will hit it sooner.

### Exercise

1. One staker, rate 5, weight 10, from time 0 to 4. Pending? (20. Tested.)
2. Why doesn't the empty-pool accrue from time 0 to 10 add `50 * SCALE / 0`? (It returns before the division. Tested.)
3. Is the dust pending a bug in the test? (No. It is the floor. The scale is not infinite precision.)

---

## What this course will not teach

- An NFT id in the stake row
- A reward-token transfer
- That every positive weight earns at least 1 unit per second
