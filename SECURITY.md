# Security

- Only the stake owner may deposit more weight or claim.
- Weight must be a positive integer. Zero is refused.
- `now` must not move backwards, or a caller could rewind the accumulator.
- An empty pool does not divide by zero. It only moves `lastSec`.
- Reward added in one step must fit in `2^62 - 1`. The accumulator itself must fit in 128 bits.
- A claim writes `debt` up to the accrued amount before returning. A second claim in the same timestamp pays 0.
- The client file builds an action object. It has no signature and it does not submit a transaction.
