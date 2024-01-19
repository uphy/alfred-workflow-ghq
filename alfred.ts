type AlfredItem = {
  title: string;
  subtitle?: string;
  arg?: string;
};

export function exit(status: number, items: AlfredItem[]) {
  console.log(JSON.stringify({ items }));
  Deno.exit(status);
}
