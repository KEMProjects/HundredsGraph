
import { AnswerInput } from "../classes/AnswerInput";
import { ArrowKeyMovement } from "../classes/ArrowKeyMovement";
import BoardView from "./BoardView";
export default class Level extends Phaser.Scene {
	readonly GAMEPAD_COLOR=0xB1D4D8;
	readonly BORDER_COLOR=0x0;
	constructor() {
		super("Level");
	}

	create() {
		const boardX=200;
		const boardY=100;
		//replace w/ json
		const numX=10;
		const numY=10;
		const tileSize=64;
		const width=numX*tileSize;
		const height=numY*tileSize;
		const text=this.add.text(boardX-32,boardY-100,"Get to the", { 
				fontFamily: 'Kenney_Pixel, Tahoma, serif', 
				fontSize: '48px', 
				color: '#000' });

		this.add.image(text.x+text.width+50, text.y+32, "sokoban_spritesheet", "ground_02.png");
		const gameBoard = new BoardView(this, boardX, boardY);
		this.add.existing(gameBoard);	
		let graphics = this.add.graphics();
		const gamePadX=boardX+width-tileSize/2;
		const gamePadY=boardY-tileSize/2-1;
		const gamePadWidth=500;
		this.drawGamePad(gamePadX,gamePadY,gamePadWidth,height+2,graphics);
		this.drawBorder(boardY-tileSize/2,boardX-tileSize/2,gamePadX+gamePadWidth,gamePadY+height+2,graphics);
		const arrowKeys = new ArrowKeyMovement(this,boardX+330,boardY);
		arrowKeys.setPlayer(gameBoard.player);
		this.add.existing(arrowKeys);
		const gameAnswer = new AnswerInput(this,boardX+300,arrowKeys.y+150);
		this.add.existing(gameAnswer);

		let correctAnswer=0;
		let nextMoveIsEnd=false;
		this.events.on("move",(expected:number,atEnd:boolean=false)=>{
			correctAnswer=expected;
			nextMoveIsEnd=atEnd;
			gameAnswer.setVisible(true);
		});
		this.events.on("submit-answer",(answer:number)=>{
			if(answer==correctAnswer){
				gameBoard.rightAnswer(answer,nextMoveIsEnd);
				gameAnswer.setVisible(false);
			}
			else{
				gameBoard.wrongAnswer(answer);
				console.log(correctAnswer);
			}
		});
		this.events.on("last-move",()=>{
			this.scene.start("Complete");
		});
		this.events.emit("scene-awake");
	}
	drawGamePad(x: number,y: number,width: number,height: number,graphics:Phaser.GameObjects.Graphics){
		graphics.fillStyle(this.GAMEPAD_COLOR);
		graphics.fillRect(x,y,width,height);
		graphics.lineStyle(2, this.BORDER_COLOR, 1);
		let leftBoundary = new Phaser.Curves.Path(x,y);
        leftBoundary.lineTo(x,y+height);
        leftBoundary.draw(graphics);
	}
	drawBorder(top: number,left: number,right: number,bottom: number,graphics:Phaser.GameObjects.Graphics){
        graphics.lineStyle(2, this.BORDER_COLOR, 1);
        let topBoundary = new Phaser.Curves.Path(left,top);
        topBoundary.lineTo(right,top);
        topBoundary.draw(graphics);

        let bottomBoundary = new Phaser.Curves.Path(left,bottom);
        bottomBoundary.lineTo(right,bottom);
        bottomBoundary.draw(graphics);

        let rightBoundary = new Phaser.Curves.Path(right,top);
        rightBoundary.lineTo(right,bottom);
        rightBoundary.draw(graphics);

        let leftBoundary = new Phaser.Curves.Path(left,top);
        leftBoundary.lineTo(left,bottom);
        leftBoundary.draw(graphics);
	}
}