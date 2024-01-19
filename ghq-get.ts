#!/usr/bin/env -S deno run -A --ext=ts

import "npm:zx@7.2.3/globals";

$.verbose = false;

/**
 * `ghq get` and return the local repository path.
 */
async function ghqGet(url: string): Promise<string | undefined> {
  const result = await $`ghq get ${url} 2>&1| sed "s,\x1B\[[0-9;]*[a-zA-Z],,g"`;
  return result.stdout
    .trim()
    .split("\n")
    .map((line) => {
      line = line.trim();
      {
        const match = line.match(/clone .+ -> (.+)/);
        if (match) {
          return match[1];
        }
      }
      {
        const match = line.match(/.*exists (.+)/);
        if (match) {
          return match[1];
        }
      }
    })
    .find((line): line is NonNullable<typeof line> => line != null);
}

if (Deno.args.length !== 1) {
  Deno.exit(1);
}

const result = await ghqGet(Deno.args[0]);
if (result) {
  echo(result);
}
