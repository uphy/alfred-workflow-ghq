#!/usr/bin/env -S deno run -A --ext=ts

import "npm:zx@7.2.3/globals";
import { exit } from "./alfred.ts";
import { basename } from "https://deno.land/std@0.209.0/path/mod.ts";

$.verbose = false;

async function listGhqRepositories() {
  const result = await $`ghq list -p`;
  return result.stdout.trim().split("\n");
}

exit(
  0,
  (await listGhqRepositories()).map((path) => {
    const filename = basename(path);
    return {
      title: filename,
      subtitle: path,
      arg: path,
    };
  })
);
