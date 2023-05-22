use na::{Point2, Vector2};
use js_sys::{ Math };
use web_sys::console;

impl Particle {
    pub fn new(x: f32, y: f32, radius: f32, color: u32, id: u32) -> Self {
        Self {
            position: Point2::new(x, y),
            velocity: Vector2::new(0.0, 0.0),
            acceleration: Vector2::new(0.0, 0.0),
            radius,
            color,
            id,
        }
    }

    pub fn move_particle(&mut self, dt: f32) {
        self.velocity += self.acceleration;
        self.position += self.velocity * dt;
        self.acceleration *= 0.0;
    }

    pub fn apply_drag(&mut self, drag_factor: f32) {
        self.velocity *= drag_factor;
    }

    pub fn get_distance_to_neighbor(&self, neighbor: &Particle) -> f32 {
        // (self.position - neighbor.position).norm()
        let dx = self.position.x - neighbor.position.x;
        let dy = self.position.y - neighbor.position.y;
        (dx*dx + dy*dy).sqrt()
    }
    

    pub fn apply_force(&mut self, force: Vector2<f32>) {
        // console_log(format!("applying force: {}", force));
        self.acceleration += force;
    }

    pub fn get_position(&self) -> Point2<f32> {
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
    position: Point2<f32>,
    velocity: Vector2<f32>,
    acceleration: Vector2<f32>,
    radius: f32,
    color: u32,
    id: u32,
}



fn console_log(value: String) {
	console::log_1(&value.into());
}
