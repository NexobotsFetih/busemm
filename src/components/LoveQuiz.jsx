import React, { useState } from 'react';

const questions = [
  {
    question: "Yapmayı en çok sevdiğim şey",
    options: ["Seninle Bir Günümü Geçirmek", "Mal Mal Oyun Oynamak", "Kotu Bisey Yapmak", "Sen"],
    correct: 3, // User specified this
    text: "1.de olabilirdi bilmiom"
  },
  {
    question: "Beni Ne kadar seviyon lan",
    options: ["Azıcık", "Eh İşte", "Herşeyimsin Sevgilim", "Poyno Kadar"],
    correct: 2,
    text: "DIIIT HİÇBİRİ HERŞEYİMDEN DAHA FAZLASISIN"
  },
  {
    question: "En sevdiğim yemek",
    options: ["Pizza", "Burger", "Mantı", "Sen"],
    correct: 3,
    text: "baskacevabi olamazztn"
  },
  {
    question: "Sana ne kadar aşığım?",
    options: ["Çok", "Aşırı", "Sonsuz", "Tarif Edilemez"],
    correct: 3,
    text: "tarifedilebilirmimk."
  },
  {
    question: "Bizim şarkımız ne?",
    options: ["Tipping Point", "Mavi", "Islak Islak", "Bilmiyorum"],
    correct: 1,
    text: "çalmayi senin için öğrendim."
  }
];

const LoveQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedOption(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setIsAnswering(false);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  return (
    <div className="glass-panel quiz-container">
      <h2 className="game-title">Biricik Maymusunu Ne Kadar Taniyon </h2>

      {showScore ? (
        <div className="score-section fade-in">
          <div className="score-circle">
            {score}/{questions.length}
          </div>
          <h3>Test Bitti Aşkımmmm</h3>
          <div className="feedback">
            {score === questions.length ?
              "koca götlümmmm bilmişmi hepsiniii" :
              "mal bebe sikik git bidaha coz 5/5 yap"}
          </div>
          <button className="cta-button primary" onClick={() => { setCurrentQuestion(0); setScore(0); setShowScore(false); setIsAnswering(false); setSelectedOption(null); }}>
            Tekrar Dene Mal
          </button>
        </div>
      ) : (
        <div className="question-section fade-in" key={currentQuestion}>
          <div className="question-count">
            <span>SORU {currentQuestion + 1}</span> / {questions.length}
          </div>
          <div className="question-text">{questions[currentQuestion].question}</div>
          <div className="answer-section">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`quiz-button ${selectedOption && index === questions[currentQuestion].correct ? 'correct' : ''} ${selectedOption && selectedOption === 'wrong' && index !== questions[currentQuestion].correct ? 'dim' : ''}`}
                onClick={() => handleAnswerOptionClick(index === questions[currentQuestion].correct)}
                disabled={isAnswering}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`
        .quiz-container {
          width: 100%;
          text-align: center;
          padding: 4rem;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .game-title {
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            color: var(--accent);
            margin-bottom: 3rem;
            text-transform: uppercase;
        }
        .question-count {
            color: var(--primary-light);
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 1rem;
        }
        .question-text {
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: white;
          font-family: 'Playfair Display', serif;
        }
        .answer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 800px;
        }
        .quiz-button {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 1.3rem;
          font-family: 'Outfit', sans-serif;
        }
        .quiz-button:hover:not(:disabled) {
          background: var(--primary);
          border-color: var(--accent);
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(185, 29, 29, 0.3);
        }
        .quiz-button.correct {
            background: #22c55e !important;
            border-color: #22c55e !important;
            color: black !important;
        }
        .dim {
            opacity: 0.5;
        }
        .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: var(--accent);
            margin: 0 auto 2rem;
            background: rgba(0,0,0,0.3);
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
        }
        .feedback {
          font-size: 1.5rem;
          margin: 2rem 0;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
            .answer-section {
                grid-template-columns: 1fr;
            }
            .question-text {
                font-size: 1.8rem;
            }
        }
      `}</style>
    </div>
  );
};

export default LoveQuiz;
