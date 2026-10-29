const NAME = /^[a-z1-5.]{1,12}$/;

export type Action = {
  account: string;
  name: "claim";
  authorization: { actor: string; permission: "active" }[];
  data: { user: string };
};

function assertName(value: string): void {
  if (!NAME.test(value) || value.startsWith(".") || value.endsWith(".")) throw new Error("bad name");
}

/** Unsigned claim body. It does not import a wallet and it does not broadcast. */
export function claimAction(args: { contract: string; user: string }): Action {
  assertName(args.contract);
  assertName(args.user);
  return {
    account: args.contract,
    name: "claim",
    authorization: [{ actor: args.user, permission: "active" }],
    data: { user: args.user },
  };
}
