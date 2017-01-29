//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
	this.load.image('arrow', 'assets/images/arrow.png');
    //this.load.image('chicken', 'assets/images/chicken.png');
    //this.load.image('horse', 'assets/images/horse.png');
    //this.load.image('pig', 'assets/images/pig.png');
    //this.load.image('sheep', 'assets/images/sheep3.png');
    this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png',131,200,3);
    this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png',212,200,3);
    this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png',297,200,3);
    this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png',244,200,3);
	
	this.load.audio('chicken_sound', ['assets/audio/chicken.ogg','assets/audio/chicken.mp3']);
   this.load.audio('horse_sound', ['assets/audio/horse.ogg','assets/audio/horse.mp3']);
   this.load.audio('pig_sound', ['assets/audio/pig.ogg','assets/audio/pig.mp3']);
   this.load.audio('sheep_sound', ['assets/audio/sheep.ogg','assets/audio/sheep.mp3']);
  },
  //executed after everything is loaded
  create: function() {

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	
	this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
	
    //create a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background');
	
	//group for animal
	var animalData =[
	{key: 'chicken', text: 'CHICKEN', audio: 'chicken_sound'},
	{key: 'horse', text: 'HORSE', audio: 'horse_sound'},
	{key: 'pig', text: 'PIG', audio: 'pig_sound'},
	{key: 'sheep', text: 'SHEEP', audio: 'sheep_sound'}
	];
	
	this.animals = this.game.add.group();
	
	var self = this;
	var animal;
	animalData.forEach(function(element){
		animal = self.animals.create(-1000, self.game.world.centerY,element.key, 0);
		
	animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
	animal.anchor.setTo(0.5);
	
	//create animation
	animal.animations.add('animate', [0,1,2,1,0,1,0], 3, false);
	
	animal.inputEnabled = true;
	animal.input.pixelPerfectClick = true;
	animal.events.onInputDown.add(self.animateAnimal, this);
	});
	
	//place animal in the middle
	this.currentAnimal = this.animals.next();
	this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
	
	//show text
	this.showText(this.currentAnimal);
	
	//left arrow
	this.leftArrow = this.game.add.sprite(60,this.game.world.centerY, 'arrow');
	this.leftArrow.anchor.setTo(0.5);
	this.leftArrow.scale.x = -1;
	this.leftArrow.customParams = {direction: -1};
	
	//left arrow allow user input
	this.leftArrow.inputEnabled = true;
	this.leftArrow.input.pixelPerfectClick = true;
	this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
	
	
	//right arrow
	this.rightArrow = this.game.add.sprite(580,this.game.world.centerY, 'arrow');
	this.rightArrow.anchor.setTo(0.5);
	this.rightArrow.customParams = {direction: 1};
	
	//left arrow allow user input
	this.rightArrow.inputEnabled = true;
	this.rightArrow.input.pixelPerfectClick = true;
	this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
  },
  //this is executed multiple times per second
  update: function() {
	  
    
  },
  switchAnimal: function(sprite, event){
	  
	if(this.isMoving){
		return false;
	}
	this.isMoving = true;
	
	//hide text 
	this.animalText.visible = false;
	

	 var newAnimal, endX;
	 
	 if(sprite.customParams.direction > 0){
		 newAnimal = this.animals.next();
		 newAnimal.x = -newAnimal.width/2;
		 endX = 640 + this.currentAnimal.width/2;
	 }
	 else{
		 newAnimal = this.animals.previous();
		 newAnimal.x = 640 + newAnimal.width/2;
		 endX = -this.currentAnimal.width/2;
	 }
	var newAnimalMove = this.game.add.tween(newAnimal);
	newAnimalMove.to({x: this.game.world.centerX}, 1000);
	newAnimalMove.onComplete.add(function(){
		this.isMoving = false;
		this.showText(newAnimal);
	},this);
	newAnimalMove.start();
	
	var currentAnimalMove = this.game.add.tween(this.currentAnimal);
	currentAnimalMove.to({x: endX}, 1000);
	currentAnimalMove.start();
	
	this.currentAnimal = newAnimal;
  },
  animateAnimal: function(sprite, event){
	  sprite.play('animate');
	  sprite.customParams.sound.play();
  },
  showText: function(animal){
	  if(!this.animalText){
		  var style = {
			  font: 'bold 30pt Arial',
			  fill: '#D0171B',
			  align: 'center'
		  }
		  this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
		  this.animalText.anchor.setTo(0.5);
	  }
	  this.animalText.setText(animal.customParams.text);
	  this.animalText.visible = true;
  }

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');