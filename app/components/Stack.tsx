import { Children, Fragment, ReactNode } from "react";
import { StyleSheet } from "infused";

const { styled } = StyleSheet("stack");

const sizes = {
  none: 0,
  xsmall: 0.25,
  small: 0.5,
  medium: 1,
  large: 2,
  xlarge: 4,
};

type Size = keyof typeof sizes;

export function Stack({
  children,
  space = "medium",
}: {
  children: ReactNode;
  space?: Size;
}) {
  return (
    <>
      {Children.map(children, (child: ReactNode, index) => {
        if (index === 0) return child;
        return (
          <Fragment key={index}>
            <Spacer space={space} />
            {child}
          </Fragment>
        );
      })}
    </>
  );
}

const Spacer = styled.div<{ space: Size }>`
  flex-shrink: 0;
  width: ${(p) => sizes[p.space] + "rem"};
  height: ${(p) => sizes[p.space] + "rem"};
`;
