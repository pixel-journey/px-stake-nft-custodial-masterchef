export const SCALE = 10n ** 12n;
export const MAX_AMOUNT = 2n ** 62n - 1n;
const ACC_MAX = (1n << 128n) - 1n;

export type Pool = {
  accPerShare: bigint;
  totalWeight: bigint;
  rewardPerSec: bigint;
  lastSec: bigint;
};

export type Stake = {
  owner: string;
  weight: bigint;
  debt: bigint;
};

function name(value: string): void {
  if (!/^[a-z1-5.]{1,12}$/.test(value) || value.startsWith(".") || value.endsWith(".")) {
    throw new Error("bad name");
  }
}

export function accrue(pool: Pool, now: bigint): Pool {
  if (typeof now !== "bigint" || now < pool.lastSec) throw new Error("time went backwards");
  if (pool.totalWeight === 0n) return { ...pool, lastSec: now };
  if (pool.totalWeight < 0n || pool.rewardPerSec < 0n) throw new Error("bad pool");
  const elapsed = now - pool.lastSec;
  const reward = elapsed * pool.rewardPerSec;
  if (reward > MAX_AMOUNT) throw new Error("reward exceeds max");
  const accDelta = (reward * SCALE) / pool.totalWeight;
  const nextAcc = pool.accPerShare + accDelta;
  if (nextAcc > ACC_MAX) throw new Error("acc overflow");
  return { ...pool, accPerShare: nextAcc, lastSec: now };
}

export function pending(pool: Pool, stake: Stake, now: bigint): bigint {
  const next = accrue(pool, now);
  const accrued = (stake.weight * next.accPerShare) / SCALE;
  return accrued > stake.debt ? accrued - stake.debt : 0n;
}

export function claim(
  caller: string,
  pool: Pool,
  stake: Stake,
  now: bigint,
): { pool: Pool; stake: Stake; harvested: bigint } {
  name(caller);
  if (caller !== stake.owner) throw new Error("not the owner");
  const next = accrue(pool, now);
  const accrued = (stake.weight * next.accPerShare) / SCALE;
  const harvested = accrued > stake.debt ? accrued - stake.debt : 0n;
  if (harvested > MAX_AMOUNT) throw new Error("payout exceeds max");
  return { pool: next, stake: { ...stake, debt: accrued }, harvested };
}

export function deposit(
  caller: string,
  pool: Pool,
  stake: Stake | null,
  weight: bigint,
  now: bigint,
): { pool: Pool; stake: Stake; harvested: bigint } {
  name(caller);
  if (typeof weight !== "bigint" || weight <= 0n) throw new Error("non-positive weight");
  const next = accrue(pool, now);
  if (stake && stake.owner !== caller) throw new Error("not the owner");
  const previous = stake?.weight ?? 0n;
  const accrued = (previous * next.accPerShare) / SCALE;
  const harvested = stake && accrued > stake.debt ? accrued - stake.debt : 0n;
  const nextWeight = previous + weight;
  return {
    pool: { ...next, totalWeight: next.totalWeight + weight },
    stake: {
      owner: caller,
      weight: nextWeight,
      debt: (nextWeight * next.accPerShare) / SCALE,
    },
    harvested,
  };
}
