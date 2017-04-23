    function HTMLActuator() {
      this.tileContainer    = document.querySelector(".tile-container");
      this.scoreContainer   = document.querySelector(".score-container");
      this.bestContainer    = document.querySelector(".best-container");
      this.messageContainer = document.querySelector(".game-message");

      this.score = 0;
    }

    HTMLActuator.prototype.actuate = function (grid, metadata) {
      var self = this;

      window.requestAnimationFrame(function () {
        self.clearContainer(self.tileContainer);

        grid.cells.forEach(function (column) {
          column.forEach(function (cell) {
            if (cell) {
              self.addTile(cell);
            }
          });
        });

        self.updateScore(metadata.score);
        self.updateBestScore(metadata.bestScore);

        if (metadata.terminated) {
          if (metadata.over) {
            self.message(false); // You lose
          } else if (metadata.won) {
            self.message(true); // You win!
          }
        }

      });
    };

    // Continues the game (both restart and keep playing)
    HTMLActuator.prototype.continueGame = function () {
      this.clearMessage();
    };

    HTMLActuator.prototype.clearContainer = function (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };

    function generatePromotor(){

        var value = Math.floor((Math.random() * 10) + 1);

        var result = "Read paper"

        switch(value) {
        case 1:
            result= "See Nicky";
            break;
        case 2:
            result = "See Nicky";
            break;
        case 3:
            result = "See Nicky";
            break;
        case 4:
            result = "See Nicky";
            break;
        case 5:
            result = "See Sophie";
            break;
        case 6:
            result = "See Nicky";
            break;
        case 7:
            result = "See Sophie";
            break;
        case 8:
            result = "See Elise";
            break;
        case 9:
            result = "See Elise";
            break;
        case 10:
            result = "See Sophie";
            break;     
        default:
            break;
           }

            return result;

    }

    function generateSeePerson(){

        var value = Math.floor((Math.random() * 10) + 1);

        var result = "Read paper"

        switch(value) {
        case 1:
            result= "See Barbara";
            break;
        case 2:
            result = "See Barbara";
            break;
        case 3:
            result = "See Patricia";
            break;
        case 4:
            result = "See Patricia";
            break;
        case 5:
            result = "See Lydie";
            break;
        case 6:
            result = "See Lydie";
            break;
        case 7:
            result = "See Denise";
            break;
        case 8:
            result = "See Denise";
            break;
        case 9:
            result = "See Esther";
            break;
        case 10:
            result = "See Esther";
            break;     
        default:
            break;
           }

            return result;

    }

    HTMLActuator.prototype.addTile = function (tile) {
      var self = this;

      var wrapper   = document.createElement("div");
      var inner     = document.createElement("div");
      var position  = tile.previousPosition || { x: tile.x, y: tile.y };
      var positionClass = this.positionClass(position);

      // We can't use classlist because it somehow glitches when replacing classes
      var classes = ["tile", "tile-" + tile.value, positionClass];
      var value = tile.value;

      if (value > 2048) classes.push("tile-super");

      this.applyClasses(wrapper, classes);

      inner.classList.add("tile-inner");

      switch(value) {
        case 1:
            inner.textContent = "Great Tea";
            break;
        case 2:
            inner.textContent = "Read paper";
            break;                  
        case 4:
            inner.textContent = generateSeePerson();
            break;
        case 8:
            inner.textContent = "Drink tea";
            break;
        case 16:
            inner.textContent = "Eureka!!!";
            break;
        case 50:
            inner.textContent = "Conference";
            break;      
        case 32:
            inner.textContent = generatePromotor();
            break;
        case 64:
            inner.textContent = "Hypothese";
            break;
        case 128:
            inner.textContent = "Scenario";
            break;    
        case 256:
            inner.textContent = "Survey";
            break;          
        case 512:
            inner.textContent = "SPSS";
            break;  
        case 1024:
            inner.textContent = "Findings";
            break; 
        case 2048:
            inner.textContent = "Paper";
            break;       
        default:
            inner.textContent = "Read paper";
            break;
           }


      if (tile.previousPosition) {
        // Make sure that the tile gets rendered in the previous position first
        window.requestAnimationFrame(function () {
          classes[2] = self.positionClass({ x: tile.x, y: tile.y });
          self.applyClasses(wrapper, classes); // Update the position
        });
      } else if (tile.mergedFrom) {
        classes.push("tile-merged");
        this.applyClasses(wrapper, classes);

        // Render the tiles that merged
        tile.mergedFrom.forEach(function (merged) {
          self.addTile(merged);
        });
      } else {
        classes.push("tile-new");
        this.applyClasses(wrapper, classes);
      }

      // Add the inner part of the tile to the wrapper
      wrapper.appendChild(inner);

      // Put the tile on the board
      this.tileContainer.appendChild(wrapper);
    };

    HTMLActuator.prototype.applyClasses = function (element, classes) {
      element.setAttribute("class", classes.join(" "));
    };

    HTMLActuator.prototype.normalizePosition = function (position) {
      return { x: position.x + 1, y: position.y + 1 };
    };

    HTMLActuator.prototype.positionClass = function (position) {
      position = this.normalizePosition(position);
      return "tile-position-" + position.x + "-" + position.y;
    };

    HTMLActuator.prototype.updateScore = function (score) {
      this.clearContainer(this.scoreContainer);

      var difference = score - this.score;
      this.score = score;

      this.scoreContainer.textContent = this.score;

      if (difference > 0) {
        var addition = document.createElement("div");
        addition.classList.add("score-addition");
        addition.textContent = "+" + difference;

        this.scoreContainer.appendChild(addition);
      }
    };

    HTMLActuator.prototype.updateBestScore = function (bestScore) {
      this.bestContainer.textContent = bestScore;
    };

    HTMLActuator.prototype.message = function (won) {
      var type    = won ? "game-won" : "game-over";
      var message = won ? "You finished the PHD!!!" : "Game over!";

      this.messageContainer.classList.add(type);
      this.messageContainer.getElementsByTagName("p")[0].textContent = message;
    };

    HTMLActuator.prototype.clearMessage = function () {
      // IE only takes one value to remove at a time.
      this.messageContainer.classList.remove("game-won");
      this.messageContainer.classList.remove("game-over");
    };
