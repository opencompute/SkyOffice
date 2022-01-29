import Phaser from 'phaser'
import { PlayerBehavior } from '../../../types/PlayerBehavior'
/**
 * shifting distance for sitting animation
 * format: direction: [xShift, yShift, depthShift]
 */
export const sittingShiftData = {
  up: [0, 3, -10],
  down: [0, 3, 1],
  left: [0, -8, 10],
  right: [0, -8, 10],
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  playerId: string
  webRTCId: string
  playerTexture: string
  playerBehavior = PlayerBehavior.IDLE
  readyToConnect = false
  videoConnected = false
  playerName: Phaser.GameObjects.Text
  playerContainer: Phaser.GameObjects.Container
  playerContainerBody: Phaser.Physics.Arcade.Body
  playerContainerOffsetY = -30
  private playerDialogBubble: Phaser.GameObjects.Container
  private timeoutID?: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    webRTCId: string,
    name: string,
    readyToConnect: boolean,
    videoConnected: boolean,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.playerTexture = texture
    this.playerId = id
    this.webRTCId = webRTCId
    this.readyToConnect = readyToConnect
    this.videoConnected = videoConnected

    this.setDepth(this.y)
    this.play(`${this.playerTexture}_idle_down`, true)

    this.playerContainer = this.scene.add
      .container(this.x, this.y + this.playerContainerOffsetY)
      .setDepth(10000)

    // add dialogBubble to playerContainer
    this.playerDialogBubble = this.scene.add.container(0, 0)
    this.playerContainer.add(this.playerDialogBubble)

    // add playerName to playerContainer
    this.playerName = this.scene.add
      .text(0, 0, '')
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')
      .setOrigin(0.5)
    if (name) this.playerName.setText(name)
    this.playerContainer.add(this.playerName)

    this.scene.physics.world.enable(this.playerContainer)
    this.playerContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
    const collisionScale = [0.5, 0.2]
    this.playerContainerBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(-8, this.height * (1 - collisionScale[1]) + 6)
  }

  updateDialogBubble(content: string) {
    content = this.playerName.text + ': ' + content
    this.clearDialogBubble()

    // preprocessing for dialog bubble text (maximum 70 characters)
    const dialogBubbleText = content.length <= 70 ? content : content.substring(0, 70).concat('...')

    const innerText = this.scene.add
      .text(0, 0, dialogBubbleText, { wordWrap: { width: 160, useAdvancedWrap: true } })
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')
      .setOrigin(0, 0.5)

    // set dialogBox slightly larger than the text in it
    const innerTextHeight = innerText.height
    const innerTextWidth = innerText.width

    innerText.setY(-innerTextHeight / 2 - 6)
    const dialogBoxWidth = innerTextWidth + 8
    const dialogBoxHeight = innerTextHeight + 4
    const dialogBoxX = innerText.x - 3
    const dialogBoxY = innerText.y - innerTextHeight / 2 - 2

    this.playerDialogBubble.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 8)
    )
    this.playerDialogBubble.add(
      this.scene.add.graphics().fillStyle(0xffffff, 1).fillCircle(5, 0, 3)
    )
    this.playerDialogBubble.add(
      this.scene.add.graphics().fillStyle(0xffffff, 1).fillCircle(0, 5, 2)
    )
    this.playerDialogBubble.add(innerText)
    this.playerName.setAlpha(0)

    // After 6 seconds, clear the dialog bubble
    this.timeoutID = window.setTimeout(() => {
      this.clearDialogBubble()
      this.playerName.setAlpha(1)
    }, 6000)
  }

  private clearDialogBubble() {
    clearTimeout(this.timeoutID)
    this.playerDialogBubble.removeAll(true)
  }
}
