import { useState, useEffect } from "react";
import './App.css';
import data from '/data.json';

function Header({ setDarkMode }) {
  function handleDarkMode() {
    setDarkMode(darkMode => !darkMode);
  }

  return (
    <div className="lightDarkMode">
      <img src="/images/light-mode-icon.svg" alt="Light Mode Icon" />
      <div onClick={handleDarkMode} className="lightDarkModeButton">
        <img src="/images/ellipse-10.svg" />
      </div>
      <img src="/images/dark-mode-icon.svg" alt="Dark Mode Icon" />
    </div>
  );
}

function FinishQuiz({ setDarkMode, score, currentQuiz, setCurrentQuiz, setCurrentQuestion }) {

  function handlePlayAgain() {
    setCurrentQuiz([]);
    setCurrentQuestion(0);
  }

  return (
    <div className="container">
      <div className="questionHeaderArea">
        <div className="questionTitle">
          <img src={currentQuiz.icon} alt={currentQuiz.title} />
          <p>{currentQuiz.title}</p>
        </div>
        <div className="#">
          <Header setDarkMode={setDarkMode} />
        </div>
      </div>
      <div className="finishQuizArea">
        <div className="complete">
          <h2 className="status">Test Tamamlandı</h2>
          <h2 className="scoreText"><b>Başarın...</b></h2>
        </div>
        <div className="scoreArea">
          <div className="quizScore">
            <div className="entrance">
              <img src={currentQuiz.icon} alt={currentQuiz.title} />
              <p className="theme">{currentQuiz.title}</p>
            </div>
            <span>{score}</span>
            <p>Doğrunuz var tebrikler 🎉</p>
          </div>
          <div className="playAgainBtn">
            <button onClick={handlePlayAgain}><p>Yeni Test Çöz</p></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionPage({ setDarkMode, currentQuiz, setCurrentQuiz, currentQuestion, setCurrentQuestion }) {

  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSelectAnswer, setIsSelectAnswer] = useState(true);

  const handleAnswer = (answer) => {
    if (!submitted) {
      setUserAnswer(answer);
    }
  };

  function handleAnswerSelected(e) {
    if (!submitted) {
      const allAnswers = document.querySelectorAll('.answer');
      allAnswers.forEach((answer) => answer.classList.remove('selected'));

      const selectedAnswer = e.currentTarget;
      selectedAnswer.classList.add('selected');
    }
  }

  const handleSubmit = () => {
    if (userAnswer === null) return setIsSelectAnswer(false);

    setSubmitted(true);

    const correctAnswer = currentQuiz.questions[currentQuestion].answer;
    const allAnswers = document.querySelectorAll('.answer');

    allAnswers.forEach((answer) => {
      const pText = answer.querySelector('p').innerText;
      if (pText === correctAnswer) {
        answer.classList.add('correct-answer');
      } else if (pText === userAnswer) {
        answer.classList.add('wrong-answer');
      }
    })

    if (userAnswer === currentQuiz.questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setIsSelectAnswer(true);
    setSubmitted(true);
  };

  const nextQuestion = () => {
    document.querySelectorAll('.answer').forEach((answer) => {
      answer.classList.remove('correct-answer');
      answer.classList.remove('wrong-answer');
    })

    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    setUserAnswer(null);
    setSubmitted(false);
  };

  return (
    <>
      {
        currentQuestion <= 9 ?
          (
            <div className="container">
              <div className="questionHeaderArea">
                <div className="questionTitle">
                  <img src={currentQuiz.icon} alt="Accessibility Icon" />
                  <p>{currentQuiz.title}</p>
                </div>
                <div className="#">
                  <Header setDarkMode={setDarkMode} />
                </div>
              </div>
              <div className="questionSection">
                <div className="questions">
                  <div className="questionsText">
                    <p>Soru {currentQuestion + 1} / 10</p>
                    <h2>{currentQuiz.questions[currentQuestion].question}</h2>
                  </div>
                  <div className="progressbarArea">
                    <div className="progressbar" style={{ width: `${(currentQuestion + 1) / (currentQuiz.questions.length - 1) * 100}%` }}></div>
                  </div>
                </div>
                <div className="answers">
                  {currentQuiz.questions[currentQuestion].options.map((answer, index) => (
                    <div key={index} className="answer" onClick={handleAnswerSelected}>
                      <button onClick={() => handleAnswer(answer)}>
                        {index === 0 && <h2>A</h2> || index === 1 && <h2>B</h2> || index === 2 && <h2>C</h2> || index === 3 && <h2>D</h2>}
                        {' '}
                        <p>{answer}</p>
                      </button>
                    </div>
                  ))}
                  {!submitted ?
                    (<button onClick={handleSubmit} className="submitAnswer"><p className="answerBtn">Cevabı Gör</p></button>)
                    :
                    (<button onClick={nextQuestion} className="submitAnswer"><p className="answerBtn">Sıradaki Soru</p></button>)
                  }
                  {!isSelectAnswer && <p className="error">İşaretleme Yapmadınız !</p>}
                </div>
              </div>
            </div>
          )
          :
          (
            <FinishQuiz setDarkMode={setDarkMode} setCurrentQuestion={setCurrentQuestion} setCurrentQuiz={setCurrentQuiz} currentQuiz={currentQuiz} score={score} />
          )
      }
    </>
  );
}

export default function App() {
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  function handleQuestionPage(quiz) {
    setCurrentQuiz(quiz);
  }

  return (
    <>
      {
        currentQuiz.length === 0
          ?
          <div className="container">
            <div className="welcome">
              <Header setDarkMode={setDarkMode} />
              <div className="hero">
                <div className="welcomeLetter">
                  <h1 className="welcomeText">Hafızanı Zorla</h1>
                  <h1 className="promotionText"><b>Frontend Testi</b></h1>
                  <p>Başlamak için bir konu seçin.</p>
                </div>
                <div className="selection">
                  {
                    data.quizzes.map((quiz, index) =>
                      <label key={index}><button onClick={() => handleQuestionPage(quiz)}><img src={quiz.icon} alt={quiz.title + 'img'} /><p>{quiz.title}</p></button></label>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          :
          <QuestionPage setDarkMode={setDarkMode} currentQuiz={currentQuiz} setCurrentQuiz={setCurrentQuiz} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
      }
    </>
  );
}
