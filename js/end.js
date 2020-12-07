const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const Score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(Score);
    highScores.sort((a, b) => b.Score - a.Score);
    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    console.log(highScores);
    //window.location.assign("../html/index.html");
};