
	//Контруктор для игры
function Game(canvas, cfg) {
	this.canvas   = canvas;
	this.ctx      = canvas.getContext("2d");
	this.matrix   = undefined;
	this.time    = 0;

    var defaultsParam = {
        cellsX    : 34,
        cellsY    : 29,
        cellSize  : 25,
        rules     : "23/3",
        gridColor : "#d0d0d0",
        cellColor : "#888888"
    };
	this.cfg = $.extend({}, defaultsParam , cfg);
	
	// Инициализация ячеек и матрицы
	this.init();
}

	//Прототип игры
Game.prototype = {
	init: function() {
		this.canvas.width  = this.cfg.cellsX * this.cfg.cellSize;
		this.canvas.height = this.cfg.cellsY * this.cfg.cellSize;
		
		// матрица
		this.matrix = new Array(this.cfg.cellsX);
		for (var x = 0; x < this.matrix.length; x++) {
			this.matrix[x] = new Array(this.cfg.cellsY);
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = false;
			}
		}
		
		this.drawCell();
	},
	drawCell: function() {
    var x, y;
		this.canvas.width = this.canvas.width;
		this.ctx.strokeStyle = this.cfg.gridColor;
		this.ctx.fillStyle = this.cfg.cellColor;

		for (x = 0.5; x < this.cfg.cellsX * this.cfg.cellSize; x += this.cfg.cellSize) {
		  this.ctx.moveTo(x, 0);
		  this.ctx.lineTo(x, this.cfg.cellsY * this.cfg.cellSize);
		}

		for (y = 0.5; y < this.cfg.cellsY * this.cfg.cellSize; y += this.cfg.cellSize) {
		  this.ctx.moveTo(0, y);
		  this.ctx.lineTo(this.cfg.cellsX * this.cfg.cellSize, y);
		}
		this.ctx.stroke();
		
		// Рисуем матрицу
		for (x = 0; x < this.matrix.length; x++) {
			for (y = 0; y < this.matrix[x].length; y++) {
				if (this.matrix[x][y]) {
					this.ctx.fillRect(x * this.cfg.cellSize + 1, y * this.cfg.cellSize + 1, this.cfg.cellSize - 1, this.cfg.cellSize - 1);
				}
			}
		}
	},

	//Прописываем правила игры
	eachStep: function() {
    	var x, y;
		var buffer = new Array(this.matrix.length);
		for (x = 0; x < buffer.length; x++) {
			buffer[x] = new Array(this.matrix[x].length);
		}
		for (x = 0; x < this.matrix.length; x++) {
			for (y = 0; y < this.matrix[x].length; y++) {
				var cellsNeighbours = this.countNeighbours(x, y);// текущий сосед ячейки

                //правила зарождения или умирания клетки в зависимости от колличества соседей
				if (this.matrix[x][y]) {
					if (cellsNeighbours == 1 || cellsNeighbours == 2)
						buffer[x][y] = true;
					if (cellsNeighbours < 1 || cellsNeighbours > 2)
						buffer[x][y] = false;
				} else {
					if (cellsNeighbours == 2)
						buffer[x][y] = true;
				}
			}
		}
		this.matrix = buffer;
		this.time++;
		this.drawCell();
	},
	
	// Прописываем колличество соседей у клетки
	countNeighbours: function(cx, cy) {
		var count = 0;
		for (var x = cx-1; x <= cx+1; x++) {
			for (var y = cy-1; y <= cy+1; y++) {
				if (x == cx && y == cy)
					continue;
				if (x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[x].length)
					continue;
				if (this.matrix[x][y])
					count++;
			}
		}
		return count;
	},
	
	// Очищаем матрицу
	clear: function() {
		for (var x = 0; x < this.matrix.length; x++) {
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = false;
			}
		}
		this.drawCell();
	},
	
	// Рандомное заполнение матрицы
	random: function() {
		for (var x = 0; x < this.matrix.length; x++) {
			for (var y = 0; y < this.matrix[x].length; y++) {
				this.matrix[x][y] = Math.random() < 0.5;
			}
		}
		this.drawCell();
	},
};


var timer;

var startGame = document.getElementById("game");
var game = new Game(startGame);

	// Слушатели событий, отвечающие за старт, перезапуск игры или очищение матрицы
$("#start").click(function() {
  if (timer === undefined) {
    timer = setInterval(race, 100);
    $(this).text("Стоп");
  } else {
    clearInterval(timer);
    timer = undefined;
    $(this).text("Старт");
  }
});

$("#restart").click(function() {
    $("#start").text("Старт");
    game.clear();
    game.time = 0;
    game.random();
    if (timer === undefined) {
        timer = setInterval(race, 100);
    } else {
        clearInterval(timer);
        timer = undefined;
    }
});

$("#clear").click(function() {
  game.clear();
    clearInterval(timer);
    timer = undefined;
  	game.time = 0;
});

function race() {
	game.eachStep();
	$("#time span").text(game.time);
}
game.random();