import { useId } from "react";
import { StyleSheet } from "infused";
import { Flex } from "./Flex";
import { Stack } from "./Stack";

const { styled } = StyleSheet();

type Variant = "large";

export function Textarea({
  label,
  error,
  ...attrs
}: JSX.IntrinsicElements["textarea"] & { label?: string; error?: string }) {
  const id = useId();
  let textarea = <TextareaRaw id={id} {...attrs}></TextareaRaw>;
  if (label) {
    return (
      <Flex alignItems="flex-start">
        <Stack space="xsmall">
          {label && <Label htmlFor={id}>{label}</Label>}
          {textarea}
        </Stack>
      </Flex>
    );
  } else {
    return textarea;
  }
}

export function Input({
  label,
  error,
  variant,
  ...attrs
}: JSX.IntrinsicElements["input"] & {
  label?: string;
  error?: string;
  variant?: Variant;
}) {
  const id = useId();
  let input = <InputRaw id={id} {...attrs} variant={variant}></InputRaw>;
  if (label) {
    return (
      <Flex alignItems="flex-start">
        <Stack space="xsmall">
          {label && <Label htmlFor={id}>{label}</Label>}
          {input}
        </Stack>
      </Flex>
    );
  } else {
    return input;
  }
}

export const TextareaRaw = styled.textarea`
  width: 100%;
  border: 0;
  background: var(--surface-2);
  resize: none;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 0.75rem;

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1px var(--theme-color);
  }
`.attrs({ rows: 6 });

export const InputRaw = styled.input<{ variant?: Variant }>`
  width: 100%;
  border: 1px;
  background: var(--surface-2);
  resize: none;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 0.75rem 1.5rem;
  min-height: 3rem;
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1px var(--theme-color);
  }
  &.variant-large {
    font-size: 20px;
  }
`.classes({ "variant-large": (p) => p.variant === "large" });

export const Label = styled.label`
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9rem;
`;
