mod utils;
pub mod objects;

use objects::system::System;

use wasm_bindgen::prelude::*;

// use std::vec;
// use vecmath::Vector2;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, particles-wasm!");
}

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}

// const VECTOR_LENGTH: usize = 4;

// pub struct Particle {
//     position: Vector2<f32>,
//     radius: u32,
//     color: u32,
// }

// impl Particle {
//     fn new(x: f32, y: f32, radius: u32, color: u32) -> Self {
//         Self {
//             position: [x, y],
//             radius,
//             color
//         }
//     }
// }

// #[wasm_bindgen]
// impl ExampleStruct {
//     #[wasm_bindgen(constructor)]
//     pub fn new(x: f64, y: f64) -> Self {
//         Self {
//             // points: vec![[x, y]],
//             particles: vec![Particle::new(100.0, 100.0, 10, 180)],
//         }
//     }

//     pub fn getState(&self) -> *const Particle {
//         self.particles.as_ptr()
//     }

//     pub fn getPointsMemoryLength(&self) -> f64 {
//         (self.particles.len() * VECTOR_LENGTH) as f64
//     }
// }

// #[wasm_bindgen]
// pub struct ExampleStruct {
//     particles: Vec<Particle>,
// }
