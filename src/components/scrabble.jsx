import React, { useState,useRef } from 'react';
import Tile from './Tile'; 
import axios from 'axios';

const ScrabblePointsCalculator = () => {

  const [letters, setLetters] = useState(Array.from({ length: 10 }, () => ""));
  

  const [totalScore, setTotalScore] = useState(0);
  const [tilesLetters, setTilesLetters] = useState(Array.from({ length: 10 }, () => ""));
  const [tilesWord, setTilesWord] = useState('');

  const tileRefs = useRef([]);

  const handleTilesWordChange = (event) => {
    const newValue = event.target.value;
    setTilesWord(newValue);

  };

  const [showTopScores, setShowTopScores] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleLetterChange = (index, newLetter) => {
    newLetter = newLetter.toUpperCase();
    if (newLetter.length > 1) {
      newLetter = newLetter.slice(0, 1);
    }
      const newLetters = [...letters];

    newLetters[index] = newLetter;
    
  if (newLetters.length > 10) {
    newLetters.splice(10);
  }
    setLetters(newLetters);


  if (index < 9 && tileRefs.current[index + 1] && tileRefs.current[index + 1].current) {
    tileRefs.current[index + 1].current.focus();
  }

    let sum = 0;
  newLetters.forEach(letter => {
    sum += calculateScore(letter);
  });
  setTotalScore(sum);
  };


  const resetTiles = () => {
    setLetters(Array.from({ length: 10 }, () => ""));
    setTotalScore(0);
  };


  const calculateScore = (letter) => {
    const letterScores = {
      'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1,
      'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
      'D': 2, 'G': 2,
      'B': 3, 'C': 3, 'M': 3, 'P': 3,
      'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
      'K': 6,
      'J': 8, 'X': 8,
      'Q': 10, 'Z': 10
    };
    
    const upperCaseLetter = letter.toUpperCase();

    if (letterScores.hasOwnProperty(upperCaseLetter)) {
      return letterScores[upperCaseLetter];
    } else {
      return 0;
    }
  };

  const saveScore = async () => {
    if (!totalScore || totalScore === 0) {
      
      setSuccessMessage('');
      alert('No score to save');
      return;
    }
    try {
      const tilesWord = letters.join('');

      const dataToSend = {
        tiles: tilesWord, 
        score: totalScore
      };
      console.log(tilesWord);
      const response = await axios.post('http://localhost:8080/api/scores', dataToSend );
      console.log('Score saved successfully:', response.data);
      
      setErrorMessage('');
      if(response.data==="ok"){
        alert('Score saved successfully');
      }
      else {
        alert('Record already saved, please Reset Tiles and apply new tiles to calculate score');
    }
      

    } catch (error) {
      setErrorMessage('Error saving score');
      setSuccessMessage('');
    }
  };

  const viewTopScores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/top-scores');
      setTopScores(response.data); 
      setShowTopScores(true); 
    } catch (error) {
      console.error('Error fetching top scores:', error);
    }
  };

   

  return (
    <div className="scrabble-board">
      <h1>Scrabble Points Calculator</h1>
      <div className="tiles-container">
        {letters.map((letter, index) => (
          <Tile key={index} letter={letter} onChange={(newLetter) => handleLetterChange(index, newLetter)} />
        ))}
      </div>
    
       <div>Score: {totalScore}</div>
      
       <button onClick={resetTiles} style={{ marginRight: '30px' }} >Reset Tiles</button>
             
    
      <button onClick={saveScore}style={{ marginRight: '30px' }}>Save Score</button>
     
      <div style={{ margin: '10px 0' }}></div> 
      <button onClick={viewTopScores}>View Top Scores</button>
      <div style={{ margin: '10px 0' }}></div> 
      {showTopScores && (
        <div>  
        
          <div className="table-responsive">
          <table className="table table-striped top-scores-table ">
            <thead className="thead-dark">
              <tr>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topScores.map((scoreObject, index) => (
                <tr key={index}>
                  <td>{scoreObject.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        
        </div>
      )}
      
    </div>
   
  );
};

export default ScrabblePointsCalculator;

