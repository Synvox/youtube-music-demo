import { StyleSheet } from "infused";

const { styled } = StyleSheet("flex");

type Variant = "title" | "light";

export const Text = styled.div<{ variant?: Variant; nowrap?: boolean }>`
  &.nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 1fr;
  }
  &.variant-title {
    font-weight: bold;
  }
  &.variant-light {
    opacity: 0.8;
  }
`.classes({
  "variant-title": (p) => p.variant === "title",
  "variant-light": (p) => p.variant === "light",
  nowrap: (p) => p.nowrap,
});
