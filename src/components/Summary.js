import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import Chart from './Chart';

import crown from '../images/crown.svg';

function Summary() {
    const location = useLocation();
    const history = useHistory();
    const { gameId, jwt } = location.state;
    const [gameData, setGameData] = useState({ players: [] });
    const [newGameBody, setNewGameBody] = useState([]);

    const getGameData = useCallback(async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/games',
            data: { gameId: gameId },
            headers: {
                'x-auth-token': jwt
            }
        });

        console.log(result.data)
        
        setGameData(result.data);
        populateNewGameRequest(result.data.players);

    }, [gameId, jwt]);

    useEffect(() => {
        getGameData();
    }, [getGameData]);

    const styles = {
        winner: {
            backgroundColor: '#7262F6',
            color: '#fff'
        },
        notWinner: {}
    }

    function populateNewGameRequest(playersArr) {
        let body = [];
        playersArr.forEach(player => {
            body.push({ playerId: player._id })
        })

        setNewGameBody(body);
    }

    async function handleRematch() {
        console.log(newGameBody)
        try {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/games/newgame',
                data: newGameBody,
                headers: {
                    'x-auth-token': jwt
                }
            });

            if (result.status === 200) {
                history.push({
                    pathname: '/game',
                    state: { gameId: result.data, jwt: jwt }
                })
            }

        } catch (err) {
            console.log(err);
        }
    }

    function handleFinish() {
        history.push('/');
    }
    

    return (
        <div className='Summary container'>
            <h1>Summary</h1>
            <div className='scoreboard'>
                <table cellSpacing='0' cellPadding='0'>
                    <tbody>
                        <tr className='labels'>
                            <th style={{paddingLeft: '12px'}}>Player</th>
                            <th style={{ textAlign: 'right', paddingRight: '12px' }}>Score</th>
                        </tr>
                        {gameData.players.map((player, index) => (
                            <tr className='player'
                                key={player._id}
                                style={index === 0 ? styles.winner : styles.notWinner}
                            >
                                <th className='name'
                                    style={{fontWeight: index === 0 ? '400' : '300'}}
                                >{player.name} {index === 0 ? <img src={crown} alt='crown icon'/> : ''}
                                </th>
                                <th className='score'>{player.score}</th>
                            </tr>
                        ))}
                    </tbody>    
                </table>    
            </div> 

            <h2>Breakdown</h2>
            <div style={{marginBottom: 50}}>
                {gameData.players.map((player, index) => (
                    <div className='breakdown-card'
                        key={'breakdown-' + player._id}
                        style={index === 0 ? styles.winner : styles.notWinner}
                    >
                        <div className='name'
                            style={{fontWeight: index === 0 ? '400' : '300'}}
                        >
                            {player.name} {index === 0 ? <img src={crown} alt='crown icon'/> : ''}
                        </div>

                        <div className='stat'>Score: <span className='number'>{player.score}</span></div>
                        <div className='stat'>Potential Score: <span className='number'>{player.potentialScore}</span></div>
                        <div className='stat'>Foul Breaks: <span className='number'>{player.foulBreaks}</span></div>
                        <div className='stat'>Points Lost: <span className='number'>{player.potentialScore - player.score}</span></div>
                    </div>
                ))}
            </div>

            {gameData.chartData ? <Chart visible={true} chartData={gameData.chartData} /> : <div></div>}

            <div style={{marginBottom: 20, marginTop: 60}} className='call-to-action' onClick={handleRematch}>Rematch</div>
            <div style={{marginBottom: 80}} className='secondary-cta' onClick={handleFinish}>Finish</div>
        </div>
    )
}

export default Summary;