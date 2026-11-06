export type InputSize = "sm" | "md" | "lg";

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}
