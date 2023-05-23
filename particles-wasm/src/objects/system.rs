use std::{vec, mem};
// use vecmath::{ Vector2, vec2_add, vec2_scale };
use wasm_bindgen::prelude::*;
use js_sys::Math;
use web_sys::console;

use na::{Vector2, Point2};

use super::particle::{Particle, self};

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
            r_max,
            friction_factor: Self::get_friction_factor(dt, friction_half_life),
            m,
            rule_matrix: RulesMatrix::new(m),
            force_factor,
            particles,
            running: false
        }
    }

    pub fn start(&mut self) {
        self.running = true;
        self.step();
    }

    pub fn pause(&mut self) {
        self.running = false;
    }

    pub fn apply_forces(&mut self) {
        let particles_length = self.particles.len();

        for i in 0..particles_length {
            let mut total_force: Vector2<f32> = Vector2::new(0.0, 0.0);

            if let Some(particle) = self.particles.get(i) {
				for j in 0..particles_length {
						if let Some(neighbor) = self.particles.get(j) {
							if particle.get_id() != neighbor.get_id() {
								let p_position = particle.get_position();
								let n_position = neighbor.get_position();
								let rx = n_position.x - p_position.x;
								let ry = n_position.y - p_position.y;
								
								let distance = particle.get_distance_to_neighbor(neighbor);

								if distance > 0.0 && distance < self.r_max {
									let normalized_distance: f32 = distance / self.r_max;
									let rule_value = self.rule_matrix.get_value(particle.get_color(), neighbor.get_color());

									let force = System::get_rule_force(normalized_distance, rule_value);

									let x_force = (rx / distance) * force;
									let y_force = (ry / distance) * force;
									total_force.x += x_force;
									total_force.y += y_force;
								}
						}
					}
				}
            }

			if let Some(particle) = self.particles.get_mut(i) {
				total_force *= self.force_factor * self.r_max;
				total_force += total_force * self.dt;
				particle.apply_drag(self.friction_factor);
				particle.apply_force(total_force);
			}
			
        }
    }

	fn get_rule_force(normalized_distance: f32, rule_value: &f32) -> f32 {
		let beta: f32 = 0.3;
		if normalized_distance < beta {
			return normalized_distance / beta - 1.0;
		} else if beta < normalized_distance && normalized_distance < 1.0 {
			return rule_value * (1.0 - ((2.0 * normalized_distance - 1.0 - beta) / (1.0 - beta)).abs());
		} else {
			return 0.0;
		}
	}
	

    pub fn step(&mut self) {
        if self.running {
            self.apply_forces();

            for particle in &mut self.particles {
                particle.move_particle(self.dt);
            }
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
    r_max: f32,

    friction_factor: f32,
    rule_matrix: RulesMatrix,
    m: usize,
    force_factor: f32,

    particles: Vec<Particle>,

    running: bool
}

struct RulesMatrix {
    matrix: Vec<Vec<f32>>
}

impl RulesMatrix {
    fn new(m: usize) -> Self {
        let mut matrix: Vec<Vec<f32>> =  Vec::with_capacity(m);
		for _ in 0..m {
			let mut row: Vec<f32> = Vec::with_capacity(m);
            for _ in 0..m {
                row.push((Math::random() * 2.0 - 1.0) as f32);
				// row.push(0.5);
            }
			matrix.push(row);
		}


        Self {
            matrix
        }
    }

    pub fn get_value(&self, i_color: u32, j_color: u32) -> &f32 {
        let val = self.matrix.get(i_color as usize).unwrap().get(j_color as usize).unwrap();
		return val;
    }
}

fn console_log(value: String) {
	console::log_1(&value.into());
}
