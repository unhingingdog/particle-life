use std::vec;
use vecmath::Vector2;
use wasm_bindgen::prelude::*;

const VECTOR_LENGTH: usize = 2;

#[wasm_bindgen]
impl ExampleStruct {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Self {
        Self {
            // points: vec![[x, y]],
            points: vec![[500.0, 500.0]],
        }
    }

    pub fn double_points(&mut self) {
        for point in self.points.iter_mut() {
            point[0] = point[0] * 2_f64;
            point[1] = point[1] * 2_f64;
        }
    }

    pub fn getState(&self) -> *const Vector2<f64> {
        self.points.as_ptr()
    }

    pub fn getPointsMemoryLength(&self) -> f64 {
        (self.points.len() * VECTOR_LENGTH) as f64
    }
}

#[wasm_bindgen]
pub struct ExampleStruct {
    points: Vec<Vector2<f64>>,
}
