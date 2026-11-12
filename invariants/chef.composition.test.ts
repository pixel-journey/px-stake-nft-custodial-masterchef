/**
 * Composition: two stakers over time.
 * Sum of harvested + still-pending equals elapsed * rewardPerSec.
 * A second claim at the same timestamp pays 0. Full withdraw moves future emission
 * to whoever is still staked. No token is sent.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { claim, deposit, pending, withdraw, type Pool } from "./chef.ts";

function empty(rate: bigint): Pool {
  return { accPerShare: 0n, totalWeight: 0n, rewardPerSec: rate, lastSec: 0n };
}

describe("composition: sequential masterchef", () => {
  it("two equal stakes claim the whole emission once", () => {
    const a = deposit("alice", empty(5n), null, 10n, 0n);
    const b = deposit("bob", a.pool, null, 10n, 0n);
    const paidA = claim("alice", b.pool, a.stake, 4n);
    const paidB = claim("bob", paidA.pool, b.stake, 4n);
    assert.equal(paidA.harvested, 10n);
    assert.equal(paidB.harvested, 10n);
    assert.equal(paidA.harvested + paidB.harvested, 4n * 5n);
    const again = claim("alice", paidB.pool, paidA.stake, 4n);
    assert.equal(again.harvested, 0n);
  });

  it("a later claim pays only the new window", () => {
    const opened = deposit("alice", empty(5n), null, 10n, 0n);
    const first = claim("alice", opened.pool, opened.stake, 4n);
    assert.equal(first.harvested, 20n);
    const second = claim("alice", first.pool, first.stake, 4n);
    assert.equal(second.harvested, 0n);
    const third = claim("alice", second.pool, second.stake, 8n);
    assert.equal(third.harvested, 20n);
    assert.equal(first.harvested + second.harvested + third.harvested, 8n * 5n);
  });

  it("full withdraw hands the next window to the remaining staker", () => {
    const a = deposit("alice", empty(5n), null, 10n, 0n);
    const b = deposit("bob", a.pool, null, 10n, 0n);
    const out = withdraw("alice", b.pool, a.stake, 10n, 4n);
    assert.equal(out.harvested, 10n);
    assert.equal(out.pool.totalWeight, 10n);
    assert.equal(out.stake.weight, 0n);
    const bobDue = pending(out.pool, b.stake, 8n);
    // first window 20 split 10/10, second window 20 all to bob
    assert.equal(bobDue, 30n);
    assert.equal(out.harvested + bobDue, 8n * 5n);
  });

  it("mid-stream deposit harvests, then new weight earns only forward", () => {
    const opened = deposit("alice", empty(5n), null, 10n, 0n);
    const more = deposit("alice", opened.pool, opened.stake, 10n, 4n);
    assert.equal(more.harvested, 20n);
    assert.equal(pending(more.pool, more.stake, 4n), 0n);
    const later = pending(more.pool, more.stake, 8n);
    // weight 20, rate 5, 4 seconds → 20
    assert.equal(later, 20n);
    assert.equal(more.harvested + later, 8n * 5n);
  });
});
