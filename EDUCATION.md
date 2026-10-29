# Education

Custodial MasterChef accounting, without a chain.

## The pitfall

A farm that does `user.weight * reward / totalWeight` on every claim both overflows and drifts. The usual repair is an accumulator:

```
accPerShare += reward * 1e12 / totalWeight
pending = user.weight * accPerShare / 1e12 - debt
```

`1e12` keeps the division from throwing away every reward when `totalWeight` is larger than one emission. It does not keep them all. If `totalWeight` is larger than `reward * 1e12`, the update is 0. That is the dust case, and the test keeps it.

The multiply has to happen in a wide integer. `2^53 + 1` is already not a JavaScript number. `Number` turns it into `2^53` before the scale is applied.

## What the test does not do

It does not transfer an NFT, pay a token, or write a table. A contract would still have to take custody on `atomicassets::transfer`, store the stake under the contract, and send the reward with `eosio.token`. None of that is here.
