import { Form, FormProps, useTransition } from "@remix-run/react";
import { StyleSheet } from "infused";
import { forwardRef } from "react";

const { styled, css } = StyleSheet("button");

export const Button = styled.button<{ primary?: boolean; size?: "small" }>`
  white-space: nowrap;
  padding: 0.75rem 2rem;
  border: 0;
  color: white;
  border-radius: 3px;
  font-size: 15px;
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  font-weight: 500;
  min-height: 3rem;
  &.primary {
    background: var(--theme-color);
  }
  &.size-small {
    font-size: 12px;
    padding: 4px 8px;
  }
  &:active {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.5;
  }
`
  .attrs({ type: "button" })
  .classes({
    primary: (p) => Boolean(p.primary),
    "size-small": (p) => p.size === "small",
  });

export const FormButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] &
    Pick<
      FormProps,
      | "action"
      | "method"
      | "encType"
      | "reloadDocument"
      | "replace"
      | "onSubmit"
    >
>(function FormButton(
  {
    className,
    action,
    method,
    encType,
    reloadDocument,
    replace,
    onSubmit,
    ...others
  },
  ref
) {
  const { state } = useTransition();
  return (
    <Form
      {...{
        className,
        action,
        method,
        encType,
        reloadDocument,
        replace,
        onSubmit,
      }}
    >
      <Button disabled={state !== "idle"} type="submit" ref={ref} {...others} />
    </Form>
  );
});

const iconButton = css`
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  width: 2.5rem;
  aspect-ratio: 1;
  border-radius: 1000px;
  transition-duration: 250ms;
  padding: 0;
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  &:hover {
    background: #fff1;
  }
  &:active {
    background: #0008;
    transition-duration: 0ms;
  }
  &.size-large {
    width: 3.5rem;
    svg {
      width: 2.75rem;
      height: 2.75rem;
    }
  }
`;

export const IconButton = styled.button<{ size?: "large" }>`
  ${iconButton}
`.classes({ "size-large": (p) => p.size == "large" });

export const FormIconButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] &
    Pick<
      FormProps,
      | "action"
      | "method"
      | "encType"
      | "reloadDocument"
      | "replace"
      | "onSubmit"
    >
>(function FormButton(
  {
    className,
    action,
    method,
    encType,
    reloadDocument,
    replace,
    onSubmit,
    ...others
  },
  ref
) {
  return (
    <Form
      {...{
        className,
        action,
        method,
        encType,
        reloadDocument,
        replace,
        onSubmit,
      }}
    >
      <IconButton ref={ref} {...others} />
    </Form>
  );
});
