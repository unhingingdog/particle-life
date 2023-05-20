use std::{vec, mem};
use vecmath::Vector2;
use wasm_bindgen::prelude::*;
use js_sys::Math;

use super::particle::Particle;

#[wasm_bindgen]
impl System {
    #[wasm_bindgen(constructor)]
    pub fn new(
        count: usize, 
        dt: f32, 
        friction_half_life: f32, 
        r_max: f32, 
        m: usize, 
        force_factor: f32
    ) -> Self {
        let mut particles: Vec<Particle> = vec![];
        for id in 0..count {
            particles.push(Particle::from_random(id as u32, m))
        }

        Self {
            count,
            dt,
            friction_half_life,
            r_max,
            friction_factor: Self::get_friction_factor(dt, friction_half_life),
            m,
            rule_matrix: RulesMatrix::new(m),
            force_factor,
            particles,
        }
    }

    pub fn get_m(&self) -> usize {
        self.m
    }

    pub fn get_particles_state(&self) -> *const Particle {
        self.particles.as_ptr()
    }

    pub fn get_particles_memory_length(&self) -> usize {
        self.particles.len() * System::get_particle_size()
    }

    pub fn get_particle_size() -> usize {
        let particle_size_in_bytes = mem::size_of::<Particle>();
        particle_size_in_bytes / mem::size_of::<f32>()
    }

    fn get_friction_factor(dt: f32, friction_half_life: f32) -> f32 {
       0.5_f32.powf(dt / friction_half_life) 
    }
}

#[wasm_bindgen]
pub struct System {
    count: usize,
    dt: f32,
    friction_half_life: f32,
    r_max: f32,

    friction_factor: f32,
    rule_matrix: RulesMatrix,
    m: usize,
    force_factor: f32,

    particles: Vec<Particle>,
}

struct RulesMatrix {
    matrix: Vec<Vec<f32>>
}

impl RulesMatrix {
    fn new(m: usize) -> Self {
        let mut matrix: Vec<Vec<f32>> =  Vec::with_capacity(m);
        for row in &mut matrix {
            *row = Vec::with_capacity(m);
            for _ in 0..m {
                row.push((Math::random() * 2.0 - 1.0) as f32);
            }
        }

        Self {
            matrix
        }
    }

    pub fn get_value(&self, i: usize, j: usize) -> &f32 {
        self.matrix.get(i).unwrap().get(j).unwrap()
    }
}
