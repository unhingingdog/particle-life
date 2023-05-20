use std::vec;
use vecmath::Vector2;
use wasm_bindgen::prelude::*;
use js_sys::Math;

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32, radius: f32, color: u32, id: u32) -> Self {
        Self {
            position: [x, y],
            velocity: [0.0, 0.0],
            acceleration: [0.0, 0.0],
            radius,
            color,
            id,
        }
    }

    fn generate_color(m: usize, input_value: f32) -> u32 {
        let mut constrained = input_value.max(0.0).min(1.0);
        constrained = constrained * (m as f32);
        constrained.floor() as u32
    }

    pub fn from_random(id: u32, m: usize) -> Self {
        let x = Math::random() as f32;
        let y = Math::random() as f32;
        let color = Self::generate_color(m, Math::random() as f32);
        let radius = 3.0_f32;

        Self::new(x, y, radius, color, id)
    }
}

#[wasm_bindgen]
pub struct Particle {
    position: Vector2<f32>,
    velocity: Vector2<f32>,
    acceleration: Vector2<f32>,
    radius: f32,
    color: u32,
    id: u32,
}
