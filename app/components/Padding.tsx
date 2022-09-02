import { StyleSheet } from "infused";

const { styled } = StyleSheet("padding");

const sizes = {
  none: 0,
  xsmall: 0.25,
  small: 0.5,
  medium: 1,
  large: 2,
  xlarge: 4,
};

type Size = keyof typeof sizes;

export const Padding = styled.div<{
  size?: Size;
}>`
  padding: ${(p) => sizes[p.size ?? "medium"] + "em"};
`;
