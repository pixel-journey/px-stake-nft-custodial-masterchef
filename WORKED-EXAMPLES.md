# Worked examples — acc-per-share

`SCALE = 10^12`. Rewards use integer `rewardPerSec`.

## Example A — single staker

```text
pool: totalWeight 0, rewardPerSec 10, lastSec 0
deposit alice weight 1 at t=0
// totalWeight 1, debt set to current index
claim at t=100 → harvested ≈ 100 * 10 = 1000 (exact under scale math)
claim again at t=100 → harvested 0
```

## Example B — equal weights split emission

Two stakers weight 1 each. Emission over Δt is split in half (floor effects possible).

## Example C — deposit harvests old weight first

Alice staked; time passes; she deposits more weight → pending on **old** weight is harvested, then debt resets for **new** total weight.

## Example D — full withdraw

Alice withdraws all weight → her weight 0; remaining staker receives subsequent emission alone.

## Example E — conservation composition

`chef.composition.test.ts`: harvested + still-pending equals `elapsed * rewardPerSec` across two stakers (within integer rules).

## Example F — unsigned client

`client/claim-action.ts` builds an **unsigned** action object. It does not broadcast.
