document.querySelector('#drawCards').addEventListener('click', drawCards)
let deckId = ''
getFetch()

function getFetch(){
const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        deckId = data.deck_id
  
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

document.querySelector('#reshuffle').addEventListener('click', () => {
  localStorage.setItem("Player One Score",0)
  localStorage.setItem("Player Two Score",0)
  p1Score.innerText = 0
  p2Score.innerText = 0
  playerOneScore = 0
  playerTwoScore = 0
  outcome.innerText = ""  
  document.querySelector('#remaining').innerText = ""
  document.querySelector('#playerOne').src = "img/cardback.png"
  document.querySelector('#playerTwo').src = "img/cardback.png"
  getFetch()
  console.log(playerOneScore)
})

if (!localStorage.getItem("Player One Score")) {
  localStorage.setItem("Player One Score",0)
}
if (!localStorage.getItem("Player Two Score")) {
  localStorage.setItem("Player Two Score",0)
}

let playerOneScore = Number(localStorage.getItem("Player One Score"))
const p1Score = document.querySelector('#p1Score')
p1Score.innerText = playerOneScore
let playerTwoScore = Number(localStorage.getItem("Player Two Score"))
const p2Score = document.querySelector('#p2Score')
p2Score.innerText = playerTwoScore

function drawCards(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#playerOne').src = data.cards[0].image
        document.querySelector('#playerTwo').src = data.cards[1].image
        document.querySelector('#remaining').innerText = data.remaining
        let playerOneVal = convertToNum(data.cards[0].value)
        let playerTwoVal = convertToNum(data.cards[1].value)
        const outcome = document.querySelector('#outcome')
        if (playerOneVal > playerTwoVal) {
          outcome.innerText = `Player 1 won this round! ${data.cards[0].value} beats ${data.cards[1].value}`
          playerOneScore += 1
          localStorage.setItem("Player One Score",playerOneScore)
          p1Score.innerText = playerOneScore
        } else if (playerOneVal < playerTwoVal) {
          outcome.innerText = `Player 2 won this round! ${data.cards[1].value} beats ${data.cards[0].value}`
          playerTwoScore += 1
          localStorage.setItem("Player Two Score",playerTwoScore)
          p2Score.innerText = playerTwoScore
        } else  {
          outcome.innerText = `It's a tie! ${data.cards[0].value} matches ${data.cards[1].value}`
        }
        if ((data.remaining === 0) && (playerOneScore > playerTwoScore)) {
          outcome.innerText = `Congratulations Player 1, you won with a score of ${playerOneScore}`
        } else if ((data.remaining === 0) && (playerOneScore < playerTwoScore)) {
          outcome.innerText = `Congratulations Player 2, you won with a score of ${playerTwoScore}`
        } else if ((data.remaining === 0) && (playerOneScore === playerTwoScore)) {
          outcome.innerText = `It's a stalemate, you both tied with a score of ${playerTwoScore}!`
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function convertToNum(val) {
  if (val === "ACE") {
    return 14
  } else if (val === "KING") {
    return 13
  } else if (val === "QUEEN") {
    return 12
  } else if (val === "JACK") {
    return 11
  } else {
    return Number(val)
  }
}


