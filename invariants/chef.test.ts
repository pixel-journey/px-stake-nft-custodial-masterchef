import { test } from "node:test";
import assert from "node:assert/strict";
import {
  accrue,
  claim,
  deposit,
  withdraw,
  MAX_AMOUNT,
  pending,
  SCALE,
  type Pool,
} from "./chef.ts";

const empty = (rate: bigint): Pool => ({
  accPerShare: 0n,
  totalWeight: 0n,
  rewardPerSec: rate,
  lastSec: 0n,
});

test("an empty pool moves time and does not divide", () => {
  const next = accrue(empty(5n), 10n);
  assert.equal(next.accPerShare, 0n);
  assert.equal(next.lastSec, 10n);
  assert.equal(next.totalWeight, 0n);
});

test("one staker receives the whole emission", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  const due = pending(opened.pool, opened.stake, 4n);
  assert.equal(due, 20n);
});

test("two equal stakes split the emission", () => {
  const first = deposit("alice", empty(5n), null, 10n, 0n);
  const second = deposit("bob", first.pool, null, 10n, 0n);
  assert.equal(pending(second.pool, first.stake, 4n), 10n);
  assert.equal(pending(second.pool, second.stake, 4n), 10n);
});

test("claim pays once and the debt blocks a second claim", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  const paid = claim("alice", opened.pool, opened.stake, 4n);
  assert.equal(paid.harvested, 20n);
  const again = claim("alice", paid.pool, paid.stake, 4n);
  assert.equal(again.harvested, 0n);
});

test("a later deposit harvests and then pending is zero", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  const more = deposit("alice", opened.pool, opened.stake, 10n, 4n);
  assert.equal(more.harvested, 20n);
  assert.equal(pending(more.pool, more.stake, 4n), 0n);
});

test("zero weight is refused", () => {
  assert.throws(() => deposit("alice", empty(5n), null, 0n, 0n), /non-positive/);
});

test("another account cannot deposit onto the stake", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  assert.throws(() => deposit("bob", opened.pool, opened.stake, 1n, 1n), /owner/);
});

test("another account cannot claim", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  assert.throws(() => claim("bob", opened.pool, opened.stake, 1n), /owner/);
});

test("time going backwards is refused", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 5n);
  assert.throws(() => pending(opened.pool, opened.stake, 4n), /backwards/);
});

test("dust truncates when the weight is larger than reward times scale", () => {
  const opened = deposit("alice", empty(1n), null, SCALE + 1n, 0n);
  assert.equal(pending(opened.pool, opened.stake, 1n), 0n);
});

test("bigint keeps a reward that a JavaScript number rounds away", () => {
  const odd = 2n ** 53n + 1n;
  assert.equal(Number(odd), Number(2n ** 53n));
  const opened = deposit("alice", empty(odd), null, 1n, 0n);
  assert.equal(pending(opened.pool, opened.stake, 1n), odd);
});

test("a reward above the asset max is refused", () => {
  const opened = deposit("alice", empty(MAX_AMOUNT), null, 1n, 0n);
  assert.throws(() => pending(opened.pool, opened.stake, 2n), /reward exceeds max/);
});

test("accumulator overflow is refused", () => {
  const pool: Pool = {
    accPerShare: (1n << 128n) - 1n,
    totalWeight: 1n,
    rewardPerSec: 1n,
    lastSec: 0n,
  };
  assert.throws(() => accrue(pool, 1n), /acc overflow/);
});

test("withdraw harvests then reduces weight", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  const out = withdraw("alice", opened.pool, opened.stake, 4n, 4n);
  assert.equal(out.harvested, 20n);
  assert.equal(out.stake.weight, 6n);
  assert.equal(out.pool.totalWeight, 6n);
  assert.equal(pending(out.pool, out.stake, 4n), 0n);
});

test("full withdraw leaves zero weight and zero pool weight", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  const out = withdraw("alice", opened.pool, opened.stake, 10n, 4n);
  assert.equal(out.harvested, 20n);
  assert.equal(out.stake.weight, 0n);
  assert.equal(out.pool.totalWeight, 0n);
});

test("withdraw above stake weight is refused", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  assert.throws(
    () => withdraw("alice", opened.pool, opened.stake, 11n, 1n),
    /exceeds stake weight/,
  );
});

test("non-owner cannot withdraw", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  assert.throws(
    () => withdraw("bob", opened.pool, opened.stake, 1n, 1n),
    /owner/,
  );
});

test("zero withdraw weight is refused", () => {
  const opened = deposit("alice", empty(5n), null, 10n, 0n);
  assert.throws(
    () => withdraw("alice", opened.pool, opened.stake, 0n, 1n),
    /non-positive/,
  );
});
