# Worked examples — acc-per-share MasterChef

`SCALE = 10^12`. `rewardPerSec` is integer. No NFT custody move in these tests — weight is the stake unit.

## Empty pool

`accrue(empty(5), t=10)` → `accPerShare` stays 0, `lastSec` 10. No division by zero.

## Single staker

Deposit alice weight 10, rate 5, at t=0. `pending` at t=4 → **20** (`4 * 5`).

Claim → harvested 20. Second claim at same t → 0.

## Two equal stakes

Alice then bob, weight 10 each, rate 5, t=4:

| Staker | pending |
| --- | --- |
| alice | 10 |
| bob | 10 |
| sum | 20 = 4 * 5 |

Second claim at t=4 still 0 for alice.

## Later claim window

Alice alone: claim at 4 → 20; claim at 4 again → 0; claim at 8 → 20. Total 40 = 8 * 5.

## Deposit mid-stream

Alice weight 10, rate 5. Deposit +10 more at t=4 → harvested **20** on old weight; pending at t=4 is 0. Pending at t=8 with weight 20 → 20. Total harvested + later = 40 = 8 * 5.

## Withdraw

Alice weight 10, withdraw 4 at t=4 → harvested 20, remaining weight 6, pool totalWeight 6, pending 0 at same t.

Full withdraw weight 10 at t=4 → harvested 20, weights 0.

## Remaining staker after full exit

Alice and bob weight 10 each. Alice full withdraw at t=4 → harvested 10. Bob `pending` at t=8 → **30** (10 from first window share + 20 alone in second). Alice harvest + bob pending = 40 = 8 * 5.

## Refusals

| Case | Error |
| --- | --- |
| weight 0 deposit/withdraw | non-positive |
| bob deposits onto alice stake | owner |
| bob claims/withdraws alice | owner |
| time 4 after lastSec 5 | backwards |
| weight SCALE+1, rate 1, 1 sec | pending 0 (dust) |
| pending would exceed MAX_AMOUNT | reward exceeds max |
| acc near 2^128 | acc overflow |
| withdraw 11 of 10 | exceeds stake weight |

Unsigned claim body in `client/` does not broadcast.
