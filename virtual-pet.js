angular.module('iNepali.service-phaser', [])
	.factory('VirtualPet', function () {
		var game;

		GameState = {
			// load all game assets, before the game start
			init: function () {
				console.log('init called');
				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.scale.pageAlignHorizontally = true;
				this.scale.pageAlighVertically = true;
			},
			preload: function () {
				console.log('preload called');
				this.load.image('backyard', 'assets/images/backyard.png');
				this.load.image('apple', 'assets/images/apple.png');
				this.load.image('candy', 'assets/images/candy.png');
				this.load.image('rotate', 'assets/images/rotate.png');
				this.load.image('toy', 'assets/images/rubber_duck.png');
				this.load.image('arrow', 'assets/images/arrow.png');

				this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1)


			},
			create: function () {
				console.log('create called');

				this.background = this.game.add.sprite(0, 0, 'backyard');
				this.background.inputEnabled = true;
				this.background.events.onInputDown.add(this.placeItem, this);

				//pet
				this.pet = this.game.add.sprite(100, 400, 'pet');
				this.pet.anchor.setTo(0.5);

				// Animation
				this.pet.animations.add('funnyfaces', [1,2,3, 2, 1], 7, false);

				//custom properties 
				this.pet.params = { health: 100, fun: 100 };

				//draggable pet
				this.pet.inputEnabled = true;
				this.pet.input.enableDrag();

				//apple
				this.apple = this.game.add.sprite(50, 580, 'apple');
				this.apple.params = { health: 10 }
				this.apple.anchor.setTo(0.5);
				this.apple.inputEnabled = true;
				this.apple.events.onInputDown.add(this.pickItem, this);



				this.candy = this.game.add.sprite(140, 580, 'candy');
				this.candy.params = { health: -10, fun: 10 };
				this.candy.inputEnabled = true;
				this.candy.events.onInputDown.add(this.pickItem, this);
				this.candy.anchor.setTo(0.5);

				this.toy = this.game.add.sprite(230, 580, 'toy');
				this.toy.anchor.setTo(0.5);
				this.toy.params = { fun: 20 };
				this.toy.inputEnabled = true;
				this.toy.events.onInputDown.add(this.pickItem, this);

				this.rotate = this.game.add.sprite(320, 580, 'rotate');
				this.rotate.anchor.setTo(0.5);
				this.rotate.inputEnabled = true;
				this.rotate.events.onInputDown.add(this.rotatePet, this);

				this.buttons = [this.apple, this.candy, this.toy, this.rotate];

				this.selectedItem = null;
				this.uiBlocked = false;


			},
			update: function () {
				console.log('update calling');
				//this.apple.y += 0.25;
				//this.apple.angle += 0.25;

			},
			pickItem: function (sprite, event) {


				if (!this.uiBlocked) {
					console.log('pick item');
					this.clearSelection();

					sprite.alpha = 0.4;
					this.selectedItem = sprite;

				}



			},
			rotatePet: function (sprite, event) {
				console.log('rotate item');

				if (!this.uiBlocked) {
					this.uiBlocked = true;
					this.clearSelection();

					sprite.alpha = 0.4;

					var petRotation = this.game.add.tween(this.pet);
					petRotation.to({ angle: '+720' }, 1000);
					petRotation.onComplete.add(function () {
						this.uiBlocked = false;
						sprite.alpha = 1;

						this.pet.params.fun += 10;
						console.log(this.pet.params.fun);
					}, this)
					petRotation.start();


				}

			},
			clearSelection: function () {
				this.buttons.forEach(function (element, index) {
					element.alpha = 1;
				});

				this.selectedItem = null;
			},
			placeItem: function (sprite, event) {
				if (this.selectedItem && !this.uiBlocked) {
					var x = event.position.x;
					var y = event.position.y;

					var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
					newItem.anchor.set(0.5);
					newItem.params = this.selectedItem.params;

					this.uiBlocked = true;

					var petMovement = this.game.add.tween(this.pet);
					petMovement.to({x: x, y: y}, 700);
					petMovement.onComplete.add(function(){
						this.uiBlocked = false;
						newItem.destroy();
						this.pet.animations.play('funnyfaces');
					}, this);
					petMovement.start();
					
				}
			}


		}

		return {
			init: function () {
				game = new Phaser.Game(360, 640, Phaser.AUTO);
				game.state.add('GameState', GameState);
				game.state.start('GameState');
				console.log(game);
			},
		};
	})
