
let currentMode = '1p';
let p1Name = 'Player 1';
let p2Name = 'Computer';
let p1Score = 0;
let p2Score = 0;
let p1MatchWins = 0;
let p2MatchWins = 0;
const targetWins = 2;

let p1Choice = null;
let p2Choice = null;

let isP1Turn = true;
let isResolving = false;

const screens = {
    mode: document.getElementById('mode-screen'),
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    matchOver: document.getElementById('match-over-screen')
};

const setupNames = {
    p1: document.getElementById('player1-name'),
    p2Group: document.getElementById('player2-input-group'),
    p2: document.getElementById('player2-name')
};

const displayNames = {
    p1: document.getElementById('p1-display-name'),
    p2: document.getElementById('p2-display-name')
};

const displayScores = {
    p1: document.getElementById('p1-score'),
    p2: document.getElementById('p2-score')
};

const displayWins = {
    p1: document.getElementById('p1-matches'),
    p2: document.getElementById('p2-matches'),
    p1Total: document.getElementById('p1-total-wins'),
    p2Total: document.getElementById('p2-total-wins')
};

const statusIndicators = {
    p1: document.getElementById('p1-side').querySelector('.status-indicator'),
    p2: document.getElementById('p2-status')
};

const cardContainers = {
    p1: document.querySelector('.p1-cards'),
    p2: document.querySelector('.p2-cards')
};

const battleAreas = {
    p1: document.getElementById('p1-selected'),
    p2: document.getElementById('p2-selected'),
    announcement: document.getElementById('battle-announcement'),
    resultText: document.getElementById('result-text')
};

const EMOJIS = {
    'rock': '✊',
    'paper': '✋',
    'scissors': '✌️'
};


function switchScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

function selectMode(mode) {
    currentMode = mode;
    setupNames.p1.value = '';
    setupNames.p2.value = '';

    if (mode === '1p') {
        setupNames.p2Group.classList.add('hidden');
    } else {
        setupNames.p2Group.classList.remove('hidden');
    }

    switchScreen('setup');
}

function goBack(screenId) {
    switchScreen(screenId);
}

function startGame() {

    p1Name = setupNames.p1.value.trim().toUpperCase() || 'PLAYER 1';

    if (currentMode === '1p') {
        p2Name = 'CPU';
    } else {
        p2Name = setupNames.p2.value.trim().toUpperCase() || 'PLAYER 2';
    }


    displayNames.p1.innerText = p1Name;
    displayNames.p2.innerText = p2Name;

    p1Score = 0;
    p2Score = 0;
    p1MatchWins = 0;
    p2MatchWins = 0;
    updateScoreUI();
    updateWinsUI();

    resetRoundUI();


    if (currentMode === '2p') {
        startTurn(1);
    } else {

        statusIndicators.p1.innerText = "YOUR TURN";
        statusIndicators.p1.classList.remove('ready');
        statusIndicators.p2.innerText = "CPU THINKING...";
        setCardsEnabled(2, false);
        setCardsEnabled(1, true);
    }

    switchScreen('game');
}

function resetGame() {
    p1Choice = null;
    p2Choice = null;
    p1Score = 0;
    p2Score = 0;
    isP1Turn = true;
    isResolving = false;
    p1MatchWins = 0;
    p2MatchWins = 0;
    updateScoreUI();
    updateWinsUI();
    resetRoundUI();
    switchScreen('mode');
}


function makeChoice(playerNum, choice) {
    if (isResolving) return;

    if (currentMode === '1p') {
        if (playerNum !== 1) return;
        p1Choice = choice;


        animateCardSelection(1, choice);


        p2Choice = getCpuChoice();


        setTimeout(() => resolveRound(), 1000);

    } else {

        if (playerNum === 1 && isP1Turn) {
            p1Choice = choice;
            animateCardSelection(1, choice, true);
            statusIndicators.p1.innerText = "READY!";
            statusIndicators.p1.classList.add('ready');
            startTurn(2);
        }
        else if (playerNum === 2 && !isP1Turn) {
            p2Choice = choice;
            animateCardSelection(2, choice, true);
            statusIndicators.p2.innerText = "READY!";
            statusIndicators.p2.classList.add('ready');
            setTimeout(() => resolveRound(), 1000);
        }
    }
}

function getCpuChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function startTurn(playerNum) {
    isP1Turn = (playerNum === 1);

    if (isP1Turn) {
        setCardsEnabled(1, true);
        setCardsEnabled(2, false);
        statusIndicators.p1.innerText = "YOUR TURN";
        statusIndicators.p2.innerText = "WAITING...";
        statusIndicators.p2.classList.remove('ready');
    } else {
        setCardsEnabled(1, false);
        setCardsEnabled(2, true);
        statusIndicators.p1.innerText = "WAITING...";
        statusIndicators.p1.classList.remove('ready');
        statusIndicators.p2.innerText = "YOUR TURN";
    }
}

function setCardsEnabled(playerNum, isEnabled) {
    const cards = document.querySelectorAll(`.p${playerNum}-cards .rps-card`);
    cards.forEach(card => {
        if (isEnabled) {
            card.classList.remove('disabled');
        } else {
            card.classList.add('disabled');
        }
    });
}

function animateCardSelection(playerNum, choice, hidden = false) {
    cardContainers[playerNum === 1 ? 'p1' : 'p2'].classList.add('hidden-anim');

    const battleArea = playerNum === 1 ? battleAreas.p1 : battleAreas.p2;
    const battleCard = battleArea.querySelector('.battle-card');

    if (hidden) {
        battleCard.innerText = '❓';
        battleCard.style.background = 'linear-gradient(135deg, rgba(50,50,50,0.8), rgba(10,10,10,0.9))';
    } else {
        battleCard.innerText = EMOJIS[choice];
        battleCard.style.background = getBackgroundForChoice(choice);
    }


    battleCard.classList.remove('winner', 'loser');

    battleArea.classList.add('show');
}

function getBackgroundForChoice(choice) {
    if (choice === 'rock') return 'linear-gradient(135deg, rgba(255,0,127,0.4), rgba(0,0,0,0.8))';
    if (choice === 'paper') return 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(0,0,0,0.8))';
    if (choice === 'scissors') return 'linear-gradient(135deg, rgba(112,0,255,0.4), rgba(0,0,0,0.8))';
    return '';
}

function resolveRound() {
    isResolving = true;


    if (currentMode === '2p' || currentMode === '1p') {
        const bc1 = battleAreas.p1.querySelector('.battle-card');
        bc1.innerText = EMOJIS[p1Choice];
        bc1.style.background = getBackgroundForChoice(p1Choice);

        const bc2 = battleAreas.p2.querySelector('.battle-card');
        bc2.innerText = EMOJIS[p2Choice];
        bc2.style.background = getBackgroundForChoice(p2Choice);


        if (currentMode === '1p') {
            cardContainers.p2.classList.add('hidden-anim');
            battleAreas.p2.classList.add('show');
        }
    }


    let result = '';

    if (p1Choice === p2Choice) {
        result = 'draw';
    } else if (
        (p1Choice === 'rock' && p2Choice === 'scissors') ||
        (p1Choice === 'paper' && p2Choice === 'rock') ||
        (p1Choice === 'scissors' && p2Choice === 'paper')
    ) {
        result = 'p1';
    } else {
        result = 'p2';
    }

    setTimeout(() => showResult(result), 800);
}

function showResult(result) {
    const bc1 = battleAreas.p1.querySelector('.battle-card');
    const bc2 = battleAreas.p2.querySelector('.battle-card');

    if (result === 'draw') {
        battleAreas.resultText.innerText = 'DRAW!';
    } else if (result === 'p1') {
        battleAreas.resultText.innerText = `${p1Name} WINS!`;
        bc1.classList.add('winner');
        bc2.classList.add('loser');
        p1Score++;
    } else {
        battleAreas.resultText.innerText = `${p2Name} WINS!`;
        bc2.classList.add('winner');
        bc1.classList.add('loser');
        p2Score++;
    }

    updateScoreUI();


    if (p1Score >= targetWins || p2Score >= targetWins) {
        setTimeout(() => showMatchOver(), 1500);
    }

    battleAreas.announcement.classList.remove('hidden');

    setTimeout(() => {
        battleAreas.announcement.classList.add('show');

        if (result !== 'draw') {
            screens.game.classList.add('win-shadow');
        }
    }, 50);

    const nextBtn = battleAreas.announcement.querySelector('.btn-action');


    if (p1Score >= targetWins || p2Score >= targetWins) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        nextBtn.innerText = "NEXT ROUND";
        nextBtn.onclick = () => { nextRound() };
    }
}

function showMatchOver() {
    if (p1Score >= targetWins) {
        p1MatchWins++;
    } else if (p2Score >= targetWins) {
        p2MatchWins++;
    }
    updateWinsUI();

    const matchWinner = p1Score >= targetWins ? p1Name : p2Name;
    document.getElementById('match-winner-text').innerText = `${matchWinner} CHAMPION!`;
    document.getElementById('match-stats-text').innerText = `Round Score: ${p1Score} - ${p2Score}`;
    switchScreen('matchOver');
}

function resetMatch() {
    p1Score = 0;
    p2Score = 0;
    updateScoreUI();


    battleAreas.announcement.querySelector('.btn-action').style.display = 'block';

    nextRound();
    switchScreen('game');
}

function updateScoreUI() {
    displayScores.p1.innerText = p1Score;
    displayScores.p2.innerText = p2Score;
}

function updateWinsUI() {
    displayWins.p1.innerText = `WINS: ${p1MatchWins}`;
    displayWins.p2.innerText = `WINS: ${p2MatchWins}`;
    displayWins.p1Total.innerText = `${p1Name} WINS: ${p1MatchWins}`;
    displayWins.p2Total.innerText = `${p2Name} WINS: ${p2MatchWins}`;
}

function nextRound() {
    p1Choice = null;
    p2Choice = null;
    isResolving = false;

    resetRoundUI();

    if (currentMode === '2p') {
        startTurn(1);
    } else {
        statusIndicators.p1.innerText = "YOUR TURN";
        statusIndicators.p1.classList.remove('ready');
        statusIndicators.p2.innerText = "CPU THINKING...";
        setCardsEnabled(1, true);
    }
}

function resetRoundUI() {
    screens.game.classList.remove('win-shadow');


    battleAreas.announcement.classList.remove('show');
    setTimeout(() => {
        battleAreas.announcement.classList.add('hidden');
    }, 500);


    battleAreas.p1.classList.remove('show');
    battleAreas.p2.classList.remove('show');


    battleAreas.p1.querySelector('.battle-card').className = 'battle-card';
    battleAreas.p2.querySelector('.battle-card').className = 'battle-card';


    cardContainers.p1.classList.remove('hidden-anim');
    cardContainers.p2.classList.remove('hidden-anim');


    battleAreas.p1.querySelector('.battle-card').classList.remove('winner', 'loser');
    battleAreas.p2.querySelector('.battle-card').classList.remove('winner', 'loser');
    battleAreas.p1.querySelector('.battle-card').style.background = '';
    battleAreas.p2.querySelector('.battle-card').style.background = '';

    if (currentMode === '1p') {

        setCardsEnabled(2, false);
    }
}
