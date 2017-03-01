angular.module('iNepali.service-phaser', [])
	.factory('Phaser', function () {
		var game;

		GameState = {
			// load all game assets, before the game start
			preload: function () {
				console.log("preload called");
				this.load.image('background', 'assets/images/background.png');
				this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
				this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
				this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297,200,3);
				this.load.image('arrow', 'assets/images/arrow.png');
				this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);
				//this.load.spritesheet('monkey', 'assets/images/monkey_spritesheet.png', 100, 100, 12);

				// loading audio
				this.load.audio('chickenSound', ['assets/audio/chicken.mp3', 'assets/audio/chicken.ogg']);
				this.load.audio('horseSound', ['assets/audio/horse.mp3', 'assets/audio/horse.ogg']);
				this.load.audio('pigSound', ['assets/audio/pig.mp3', 'assets/audio/pig.ogg']);
				this.load.audio('sheepSound', ['assets/audio/sheep.mp3', 'assets/audio/sheep.ogg']);

			},
			create: function () {
				console.log("create called")

				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				//this.scale.pageAlignHorizontally = true;
				//this.scale.pageAlignVertically = true;

				this.background = this.game.add.sprite(0, 0, 'background');

				var animalData = [
					{ key: 'chicken', text: 'CHICKEN', sound: 'chickenSound' },
					{ key: 'horse', text: 'HORSE', sound: 'horseSound' },
					{ key: 'pig', text: 'PIG', sound: 'pigSound'  },
					{ key: 'sheep', text: 'SHEEP', sound: 'sheepSound'  }//,
					//{ key: 'monkey', text: 'MONKEY' }

				];

				this.animals = this.game.add.group();

				var self = this;
				var animal;

				animalData.forEach(function (element) {
					animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);

					//animal.customParams = { text: element.text, sound: self.game.add.audio(element.sound)  };
					animal.customParams = { text: element.text, sound: element.sound  };
					animal.anchor.setTo(0.5); //center	

					// animation
					animal.animations.add('animate', [0,1,2,1,0,1, 2, 0, 1], 3, false);

					animal.inputEnabled = true;
					animal.input.pixelPerfectClick = true;
					animal.events.onInputUp.add(self.animateAnimal, self);
				});

				this.currentAnimal = this.animals.next();
				this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

				this.showText(this.currentAnimal);

				this.arrowLeft = this.game.add.sprite(30, this.game.world.centerY, 'arrow');
				this.arrowLeft.anchor.setTo(0.5);
				this.arrowLeft.scale.setTo(-0.5);
				this.arrowLeft.customParams = { direction: -1 };

				// arrow allow user input
				this.arrowLeft.inputEnabled = true;
				this.arrowLeft.input.pixelPerfectClick = true;
				this.arrowLeft.events.onInputUp.add(this.switchAnimal, this);



				this.arrowRight = this.game.add.sprite(this.game.world.width - 30, this.game.world.centerY, 'arrow');
				this.arrowRight.anchor.setTo(0.5);
				this.arrowRight.scale.setTo(0.5);
				this.arrowRight.customParams = { direction: 1 };


				this.arrowRight.inputEnabled = true;
				this.arrowRight.input.pixelPerfectClick = true;
				this.arrowRight.events.onInputUp.add(this.switchAnimal, this);

			},
			update: function () {

			},
			switchAnimal: function (sprite, event) {
				console.log("switch animal");
				var newAnimal, endX;
				if (this.isMoving){
					return false;
				}

				this.isMoving = true;
				this.animalText.visible = false;

				if (sprite.customParams.direction > 0){
					newAnimal = this.animals.next();
					newAnimal.x = -newAnimal.width/2;
					endX = this.game.width + this.currentAnimal.width/2;
				}
				else{
					newAnimal = this.animals.previous();
					newAnimal.x = this.game.width + newAnimal.width/2;
					endX = -this.currentAnimal.width/2;
				}

				var newAnimalMovement = this.game.add.tween(newAnimal);
				newAnimalMovement.to({x: this.game.world.centerX}, 1000);
				newAnimalMovement.onComplete.add(function(){
					this.isMoving = false;
					this.showText(newAnimal);
				}, this)
				newAnimalMovement.start();

				var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
				currentAnimalMovement.to({x: endX}, 1000);
				currentAnimalMovement.start();

				this.currentAnimal = newAnimal;

				//console.log(newAnimal);
			},
			showText : function(sprite)	{
				if (!this.animalText){
					var style = {
						fill: '#D01'
					}
					this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.90, '', style);
					this.animalText.anchor.setTo(0.5);
				}

			this.animalText.setText(sprite.customParams.text);
			this.animalText.visible = true;

			},
			animateAnimal: function (sprite, event) {
				console.log("animal animate");
				sprite.play('animate');

				this.game.add.audio(sprite.customParams.sound).play();


//				sprite.customParams.sound.play();
			}


		}

		return {
			init: function () {
				game = new Phaser.Game(640, 360, Phaser.AUTO);
				game.state.add('GameState', GameState);
				game.state.start('GameState');
				console.log(game);
			},
		};
	})
