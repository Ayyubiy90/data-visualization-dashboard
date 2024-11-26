/// <reference types="vite/client" />

declare module 'regression' {
  interface RegressionResult {
    equation: number[];
    r2: number;
    predict: (x: number) => number[];
  }

  function linear(data: number[][]): RegressionResult;

  export { linear };
  export default { linear };
}