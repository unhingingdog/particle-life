use std::vec;
use vecmath::{Vector2, vec2_add, vec2_scale, vec2_sub, vec2_len};
use wasm_bindgen::prelude::*;
use js_sys::{ Math };

impl Particle {
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

    pub fn move_particle(&mut self, dt: f32) {
        self.velocity = vec2_add(self.velocity.clone(), self.acceleration);
        let scaled = vec2_scale(self.velocity.clone(), dt);
        self.position = vec2_add(self.position.clone(), scaled);
        self.acceleration = [0.0, 0.0];
    }

    pub fn apply_drag(&mut self, drag_factor: f32) {
        self.velocity = vec2_scale(self.velocity.clone(), drag_factor);
    }

    pub fn get_distance_to_neighbor(&self, neighbor: &Particle) -> f32 {
        let diff = vec2_sub(self.position.clone(), neighbor.position);
        vec2_len(diff)
    }
    

    pub fn apply_force(&mut self, force: Vector2<f32>) {
        self.acceleration = vec2_add(self.acceleration.clone(), force);
    }

    pub fn get_position(&self) -> Vector2<f32> {
        self.position
    }

    pub fn get_color(&self) -> u32 {
        self.color
    }

    pub fn get_id(&self) -> u32 {
        self.id
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

pub struct Particle {
    position: Vector2<f32>,
    velocity: Vector2<f32>,
    acceleration: Vector2<f32>,
    radius: f32,
    color: u32,
    id: u32,
}
