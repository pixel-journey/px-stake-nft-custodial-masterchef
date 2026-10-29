import { test } from "node:test";
import assert from "node:assert/strict";
import { claimAction } from "./claim-action.ts";

test("claim is an unsigned body for the contract account", () => {
  const action = claimAction({ contract: "pxstake1111", user: "alice" });
  assert.equal(action.account, "pxstake1111");
  assert.equal(action.name, "claim");
  assert.deepEqual(action.authorization, [{ actor: "alice", permission: "active" }]);
  assert.equal("signature" in action, false);
});

test("a bad account name is refused", () => {
  assert.throws(() => claimAction({ contract: "UPPER", user: "alice" }), /bad name/);
});
