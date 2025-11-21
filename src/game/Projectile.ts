import * as Phaser from 'phaser'
import type { ProjectileData } from '@/types/game'

export default class Projectile extends Phaser.Physics.Matter.Sprite {
  public damage: number
  public isPlayerProjectile: boolean

  constructor(data: ProjectileData) {
    const { scene, x, y, velocityX, damage, isPlayerProjectile } = data
    super(scene.matter.world, x, y, 'projectile')
    this.scene = scene
    this.scene.add.existing(this)

    this.damage = damage
    this.isPlayerProjectile = isPlayerProjectile

    // Create simple circular body for projectile - smaller collision radius
    const { Bodies } = Phaser.Physics.Matter.Matter
    const body = Bodies.circle(x, y, 6, {
      isSensor: true,
      label: isPlayerProjectile ? 'playerProjectile' : 'npcProjectile',
      frictionAir: 0, // No air resistance
      friction: 0,
      restitution: 0,
      // Don't use collision filters - let all collisions through and filter in code
    })
    this.setExistingBody(body)
    this.setScale(1)
    this.setDisplaySize(16, 16)

    // Ensure body is not static
    if (this.body) {
      ;(this.body as any).isStatic = false
    }

    // Set velocity using both Phaser and Matter.js methods
    const Matter = Phaser.Physics.Matter.Matter
    if (this.body) {
      // Ensure body can move (not static)
      Matter.Body.setStatic(this.body, false)
      // Set density to prevent weird physics behavior
      Matter.Body.setDensity(this.body, 0.001)
      // Set velocity using Matter.js
      Matter.Body.setVelocity(this.body, { x: velocityX, y: 0 })
      // Also use Phaser's setVelocity for consistency
      this.setVelocityX(velocityX)
      this.setVelocityY(0)
    }

    // Store start position
    ;(this as any).startX = x
    ;(this as any).startY = y

    // Start bounds checking immediately - but with generous padding
    this.scene.events.on('update', this.checkBounds, this)
  }

  static preload(scene: Phaser.Scene): void {
    // Create a simple colored circle for the projectile - make it larger and more visible
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffff00, 1)
    graphics.fillCircle(8, 8, 8)
    graphics.lineStyle(2, 0xffffff, 1)
    graphics.strokeCircle(8, 8, 8)
    graphics.generateTexture('projectile', 16, 16)
    graphics.destroy()
  }

  private checkBounds(): void {
    if (!this.active || !this.body) return

    // Maintain velocity (sometimes Matter.js clears it)
    const Matter = Phaser.Physics.Matter.Matter
    const currentVelocity = Matter.Body.getVelocity(this.body)
    const targetVelocityX = this.isPlayerProjectile ? 8 : -8

    // Re-apply velocity if it's not moving - use both methods
    if (Math.abs(currentVelocity.x) < 0.1) {
      Matter.Body.setVelocity(this.body, { x: targetVelocityX, y: 0 })
      this.setVelocityX(targetVelocityX)
      this.setVelocityY(0)
    } else {
      // Sync Phaser velocity with Matter velocity
      this.setVelocityX(currentVelocity.x)
      this.setVelocityY(currentVelocity.y)
    }

    // Destroy if projectile has traveled beyond reasonable distance
    const startX = (this as any).startX
    if (startX) {
      const distanceTraveled = Math.abs(this.x - startX)

      // If projectile has traveled more than 500 pixels, destroy it
      if (distanceTraveled > 500) {
        this.destroy()
        return
      }
    }

    // Fallback: check if way off screen
    const camera = this.scene.cameras.main
    const scrollX = camera.scrollX
    const scrollY = camera.scrollY
    const cameraWidth = camera.width / camera.zoom
    const cameraHeight = camera.height / camera.zoom

    // Check if way outside camera view (with 1000px padding)
    if (
      this.x < scrollX - 1000 ||
      this.x > scrollX + cameraWidth + 1000 ||
      this.y < scrollY - 1000 ||
      this.y > scrollY + cameraHeight + 1000
    ) {
      this.destroy()
    }
  }

  destroy(): void {
    if (this.scene && this.scene.events) {
      this.scene.events.off('update', this.checkBounds, this)
    }
    super.destroy()
  }
}
