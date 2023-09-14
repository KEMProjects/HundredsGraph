import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  transparent:true,
  scale: {
    width: 1440,
    height: 750,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // 👈 change to 0
    }
  }
};
