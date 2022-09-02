import { StyleSheet } from "infused";

const { styled, keyframes } = StyleSheet("spinner");

const spinnerKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Loader = styled.div`
  border-radius: 10000px;
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-left-color: currentColor;
  animation: 2s ${spinnerKeyframes} linear infinite;
`;
