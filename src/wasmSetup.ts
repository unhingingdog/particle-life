import init, { greet, ExampleStruct, wasm_memory } from "particles-wasm";
// import { memory } from "./particles-wasm/pkg/index_bg.wasm";

export const initWasm = async () => {
  await init();

  const es = new ExampleStruct(100, 100);

  let structPointer = es.getState();
  let memoryLength = es.getPointsMemoryLength();

  const particlesFloat = new Float32Array(
    wasm_memory().buffer,
    structPointer,
    memoryLength
  );

  const particlesInt = new Int32Array(
    wasm_memory().buffer,
    structPointer,
    memoryLength
  );

  return [particlesFloat, particlesInt];
};

// let structPointer = exampleStruct.getState();
// let memoryLength = exampleStruct.getPointsMemoryLength();

// export const cells = new Float64Array(
//   memory.buffer,
//   structPointer,
//   memoryLength
// );
