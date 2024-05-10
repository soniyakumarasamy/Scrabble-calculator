import React, { useState,useRef } from 'react';
import Tile from './Tile'; 
import axios from 'axios';

const ScrabblePointsCalculator = () => {
  // State to manage the letters in the tiles
  const [letters, setLetters] = useState(Array.from({ length: 10 }, () => ""));
  
  // State to store the total score
  const [totalScore, setTotalScore] = useState(0);
  const [tilesLetters, setTilesLetters] = useState(Array.from({ length: 10 }, () => ""));
  const [tilesWord, setTilesWord] = useState('');

  const tileRefs = useRef([]);

  const handleTilesWordChange = (event) => {
    const newValue = event.target.value;
    setTilesWord(newValue);
    console.log("%%%%%%%"+newValue); // Log the updated value of tilesWord
  };

  const [showTopScores, setShowTopScores] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  

  // Function to handle letter change in a tile
  const handleLetterChange = (index, newLetter) => {
    newLetter = newLetter.toUpperCase();
    if (newLetter.length > 1) {
      newLetter = newLetter.slice(0, 1);
    }
      const newLetters = [...letters];
    // Update the letter at the specified index
    newLetters[index] = newLetter;
    
  // Ensure that the letters array always contains exactly 10 letters
  if (newLetters.length > 10) {
    newLetters.splice(10);
  }
    // Update the letters state
    setLetters(newLetters);

    // Automatically focus on the next tile if it exists
  if (index < 9 && tileRefs.current[index + 1] && tileRefs.current[index + 1].current) {
    tileRefs.current[index + 1].current.focus();
  }

   /*Disply total score*/
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

   // Function to calculate the score for a given letter
  const calculateScore = (letter) => {
    // Define the letter scores
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
      // Return the score for the letter
      return letterScores[upperCaseLetter];
    } else {
      // Return 0 if the letter is not found in the mapping
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
        tiles: tilesWord, // Assuming tilesWord is the variable containing your tiles word
        score: totalScore
      };
      console.log(tilesWord);
      console.log("****"+dataToSend.tiles);
      console.log("****^^^"+dataToSend.score);
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
      console.error('Error saving score:', error);
      setErrorMessage('Error saving score');
      setSuccessMessage('');
    }
  };

  const viewTopScores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/top-scores');
      console.log('Top scoressssss:', response.data);
      setTopScores(response.data); // Update state with fetched top scores
      setShowTopScores(true); // Show top scores section
    } catch (error) {
      console.error('Error fetching top scores:', error);
    }
  };

   

  return (
    <div className="scrabble-board">
      <h1>Scrabble Points Calculator</h1>
      <div className="tiles-container">
        {/* Map over the letters state and pass onChange handler */}
        {letters.map((letter, index) => (
          <Tile key={index} letter={letter} onChange={(newLetter) => handleLetterChange(index, newLetter)} />
        ))}
      </div>
       {/* Button to reset tiles */}
       
       <div>Score: {totalScore}</div>
      
       <button onClick={resetTiles} style={{ marginRight: '30px' }} >Reset Tiles</button>
             
       
      {/* Display the total score */}
    
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
                {/*<th>ID</th>*/}
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topScores.map((scoreObject, index) => (
                <tr key={index}>
                  {/*<td>{scoreObject.id}</td>*/}
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

