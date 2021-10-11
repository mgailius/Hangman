const gameData = {
	currentWord: '',
	difficulty: 20,
	progress: 0,
	lives: 5,
	guessed: 0,
	possibleWords: [
		'book',
		'salt',
		'water',
		'cable',
		'train',
		'metal',
		'sound',
		'browser',
		'mirror',
		'bottle',
	],
	usedWords: [],
	chooseRandomWord() {
		if (this.possibleWords.length > 0) {
			const randomIndex = Math.floor(Math.random() * this.possibleWords.length);
			this.currentWord = this.possibleWords[randomIndex];
		} else {
			return;
		}
	},
	loseLife() {
		this.lives--;
	},
	reset() {
		this.lives = 5;
		this.progress = 0;
		this.guessed = 0;
		for (let word of this.usedWords) {
			this.possibleWords.push(word);
		}
		this.usedWords = [];
	},
};

const banners = {
	outOfLives: document.querySelector('.outOfLives'),
	gameOver: document.querySelector('.gameOver'),
	exitLives: document.querySelector('.exitLives'),
	restartGame: document.querySelectorAll('.restartGame'),
	exitGame: document.querySelector('.exitGame'),
	finalWordCount: document.querySelector('.finalWordCount'),
};

const UI = {
	wordElement: document.querySelector('.word'),
	progressBar: document.querySelector('.bar'),
	lives: document.querySelector('.lives'),
	guessedWords: document.querySelector('.guessedWords'),
	levels: document.querySelector('.levels'),
	levelEasy: document.querySelector('.easy'),
	levelNormal: document.querySelector('.normal'),
	levelHard: document.querySelector('.hard'),
};

const sounds = {
	clickSound: new Audio('sounds/clickSound.wav'),
	correctLetter: new Audio('sounds/correctLetter.mp3'),
	wrongWord: new Audio('sounds/wrongWord.wav'),
	correctWord: new Audio('sounds/correctWord.wav'),
	gameOver: new Audio('sounds/gameOver.wav'),
	winSound: new Audio('sounds/winSound.wav'),
};

sounds.winSound.volume = 0.3;

function switchLevel(element) {
	for (let level of UI.levels.children) {
		level.classList.remove('active');
	}
	element.classList.add('active');
	if (element.classList.contains('easy')) {
		gameData.difficulty = 10;
	} else if (element.classList.contains('normal')) {
		gameData.difficulty = 20;
	} else {
		gameData.difficulty = 40;
	}
	gameData.reset();
	initGame();
}

function generateLetters() {
	UI.wordElement.innerHTML = '';

	for (let i = 0; i < gameData.currentWord.length; i++) {
		UI.wordElement.innerHTML += '<div></div>';
	}
}

function drawProgressBar() {
	UI.progressBar.style.width = `${gameData.progress}%`;
	if (gameData.progress <= 10) {
		UI.progressBar.style.backgroundColor = '#2be253';
	} else if (gameData.progress <= 20) {
		UI.progressBar.style.backgroundColor = '#62e22b';
	} else if (gameData.progress <= 30) {
		UI.progressBar.style.backgroundColor = '#bee22b';
	} else if (gameData.progress <= 40) {
		UI.progressBar.style.backgroundColor = '#e2e22b';
	} else if (gameData.progress <= 50) {
		UI.progressBar.style.backgroundColor = '#e2c72b';
	} else if (gameData.progress <= 60) {
		UI.progressBar.style.backgroundColor = '#e2a22b';
	} else if (gameData.progress <= 70) {
		UI.progressBar.style.backgroundColor = '#e27d2b';
	} else if (gameData.progress <= 80) {
		UI.progressBar.style.backgroundColor = '#e25c2b';
	} else if (gameData.progress <= 90) {
		UI.progressBar.style.backgroundColor = '#e23d2b';
	} else if (gameData.progress <= 100) {
		UI.progressBar.style.backgroundColor = '#e22b2b';
	}
}

function updatePlayerInfo() {
	UI.guessedWords.innerHTML = `${gameData.guessed} / ${
		gameData.possibleWords.length + gameData.usedWords.length
	}`;
	UI.lives.innerHTML = `${gameData.lives}`;
}

function initGame() {
	updatePlayerInfo();
	renderNewWord();
	drawProgressBar();
}

initGame();

// Kai žmogus paspaudžia klaviatūros mygtuką
document.addEventListener('keydown', e => {
	const letter = e.key;
	let letterFound = false;
	if (e.key >= 'a' && e.key <= 'z') {
		// Check if letter exists in a word
		for (let i = 0; i < gameData.currentWord.length; i++) {
			const wordLetter = gameData.currentWord[i];

			// If the letter was guessed
			if (letter === wordLetter) {
				sounds.correctLetter.play();
				console.log(`Žaidėjas atspėjo raidę ${i} pozicijoje`);
				UI.wordElement.childNodes[i].innerHTML = letter;
				letterFound = true;
			}
		}

		// Check for found letters
		if (letterFound === false) {
			sounds.clickSound.play();
			addProgress(gameData.difficulty);
		}

		checkLoseCondition();
		checkWinCondition();
	}
});

function removeWord() {
	const wordIndex = gameData.possibleWords.indexOf(gameData.currentWord);
	gameData.usedWords.push(gameData.currentWord);
	gameData.possibleWords.splice(wordIndex, 1);
	console.log(gameData.possibleWords);
	console.log(gameData.usedWords);
}

function checkLoseCondition() {
	if (gameData.progress >= 100) {
		sounds.wrongWord.play();
		gameData.progress = 0;
		gameData.lives--;
		if (gameData.lives == 0) {
			sounds.gameOver.play();
			showOutOfLives();
			gameData.reset();
			initGame();
		} else {
			removeWord();
			checkGameOver();
		}
	}
}

function checkWinCondition() {
	for (let letterElement of UI.wordElement.childNodes) {
		if (letterElement.innerHTML === '') {
			return;
		}
	}
	sounds.correctWord.play();
	gameData.progress = 0;
	gameData.guessed++;
	removeWord();
	checkGameOver();
}

function checkGameOver() {
	console.log(gameData.possibleWords.length);
	if (
		gameData.possibleWords.length == 0 ||
		gameData.guessed == gameData.possibleWords.length + gameData.usedWords.length
	) {
		showGameOver();
		gameData.reset();
		initGame();
	} else {
		updatePlayerInfo();
		renderNewWord();
		drawProgressBar();
	}
}

function addProgress(progressAmount) {
	gameData.progress += progressAmount;
	gameData.progress = Math.min(100, gameData.progress);
	drawProgressBar();
}

function renderNewWord() {
	gameData.chooseRandomWord();
	generateLetters();
}

banners.restartGame.forEach(restart => {
	restart.addEventListener('click', hideBanner);
});

function showOutOfLives() {
	banners.outOfLives.classList.add('outOfLivesActive');
}
function showGameOver() {
	sounds.winSound.play();
	banners.gameOver.classList.add('gameOverActive');
	banners.finalWordCount.innerHTML = `You guessed ${gameData.guessed} out of ${
		gameData.possibleWords.length + gameData.usedWords.length
	} words`;
}

function hideBanner() {
	banners.gameOver.classList.remove('gameOverActive');
	banners.outOfLives.classList.remove('outOfLivesActive');
}
