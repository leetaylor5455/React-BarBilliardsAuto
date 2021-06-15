import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import Chart from './Chart';
import Toggle from './Toggle';

const url = 'https://node-bar-billiards.herokuapp.com';

function Game(props) {
    const history = useHistory();
    const location = useLocation();
    const { gameId, jwt } = location.state;

    const [gameData, setGameData] = useState({ players: [] });
    const [showControls, setShowControls] = useState(true);
    const [showChart, setShowChart] = useState(true);

    const goToSummary = useCallback(() => {
        history.push({
            pathname: '/summary',
            state: { gameId: gameId, jwt: jwt }
        });
    }, [history, gameId, jwt])

    useEffect(() => {
        const socket = socketIOClient(url + '?data=' + gameId);
        socket.on('GameData', data => {
            console.log(data);
            if (data.isComplete) return goToSummary();
            setGameData(data);
        });
    }, [goToSummary, setGameData, gameId]);

    const styles = {
        current: {
            backgroundColor: '#7262F6',
            color: '#fff'
        },
        notCurrent: {}
    }

    async function handleNextPlayer(code) {

        // 1: safe
        // 2: foul
        // 3: black

        const result = await axios({
            method: 'POST',
            url: url + '/api/games/nextplayer',
            data: {
                gameId: gameId,
                isSafeBreak: code === 1 ? true : false,
                isFoulBreak: code === 2 ? true : false,
                isBlackPin: code === 3 ? true : false,
            },
            headers: {
                'x-auth-token': jwt
            }
        });
        if (result.data.isComplete) return goToSummary();
        setGameData(result.data);
    }

    function handleControlToggle() {
        props.showHideHeader(showControls);
        setShowControls(!showControls);
    }

    function handleChartToggle() {
        setShowChart(!showChart);
    }

    async function handleEndGame() {
        const result = await axios({
            method: 'POST',
            url: url + '/api/games/endgame',
            data: { gameId: gameId },
            headers: {
                'x-auth-token': jwt
            }
        });

        console.log(result);
        if (result.status === 200) return goToSummary();
    }

    return (
        <div className='Game container'>
            <div className='scoreboard'>
                <table cellSpacing='0' cellPadding='0'>
                    <tbody>
                    <tr className='labels'>
                        <th style={{paddingLeft: '12px'}}>Name</th>
                        <th>Break</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Score</th>
                    </tr>
                    {gameData.players.map(player => (
                        <tr className='player' 
                            key={player.name}
                            style={player.isCurrent ? styles.current : styles.notCurrent}    
                        >
                            <th className='name'>{player.name}</th>
                            <th className='break'>{player.isCurrent ? player.breaks[0].score : ''}</th>
                            <th className='score'>
                                {player.isCurrent
                                    ? <span style={{fontWeight: '700'}}>
                                        {player.score}<span style={{fontWeight: '300', opacity: .7}}> &gt; {player.score + player.breaks[0].score}</span>
                                    </span>
                                    : player.score
                                }
                            </th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {gameData.chartData ? <Chart visible={showChart} chartData={gameData.chartData} /> : <div></div>}

            <div className='controls' 
                style={{ 
                    opacity: showControls ? 1 : 0, 
                    pointerEvents: showControls ? 'all' : 'none',
                    transform: showChart ? 'translateY(0px)' : 'translateY(-100px)'
                }}
            >
                <div className='button safe' onClick={(() => handleNextPlayer(1))}>Safe</div>
                <div className='button foul' onClick={(() => handleNextPlayer(2))}>Nope</div>
                <div className='button black' onClick={(() => handleNextPlayer(3))}>Black</div>
            </div>

            <div style={{display: 'flex'}}>
                <Toggle label={'Controls'} onToggle={handleControlToggle} on={showControls}/>
                <Toggle label={'Chart'} onToggle={handleChartToggle} on={showChart}/>
            </div>

            <div className='end-game secondary-cta'
                onClick={handleEndGame}
                style={{marginBottom: '10vh'}}
            >End Game</div>
        </div>
    )
}

export default Game;