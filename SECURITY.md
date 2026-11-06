# Security

- Only the stake owner may deposit more weight, withdraw weight, or claim.
- Weight must be a positive integer. Zero is refused on deposit and withdraw.
- Withdraw above the stake's weight is refused.
- `now` must not move backwards, or a caller could rewind the accumulator.
- An empty pool does not divide by zero. It only moves `lastSec`.
- Reward added in one step must fit in `2^62 - 1`. The accumulator itself must fit in 128 bits.
- A claim writes `debt` up to the accrued amount before returning. A second claim in the same timestamp pays 0.
- A withdraw harvests pending on the old weight, then shrinks weight and sets debt to the remaining weight's index. Pending after that withdraw at the same timestamp is 0.
- The client file builds an action object. It has no signature and it does not submit a transaction.
- Weight is a bigint, not an NFT in custody. No reward token is transferred.
