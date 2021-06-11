import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

function Game(props) {
    const location = useLocation();
    const { gameId, jwt } = location.state;

    const [gameData, setGameData] = useState({ players: [] });
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const socket = socketIOClient('http://localhost:8080?data=' + gameId);
        socket.on('GameData', data => {
            setGameData(data);
        });
    }, []);

    const styles = {
        current: {
            backgroundColor: '#7262F6',
            color: '#fff'
        },
        notCurrent: {

        }
    }

    async function handleNextPlayer(code) {

        // 1: safe
        // 2: foul
        // 3: black

        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/games/nextplayer',
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
        setGameData(result.data);
    }

    function handleControlToggle() {
        props.showHideHeader(showControls);
        setShowControls(!showControls);

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

            <div className='controls' 
                style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'all' : 'none'}}
            >
                <div className='button safe' onClick={(() => handleNextPlayer(1))}>Safe</div>
                <div className='button foul' onClick={(() => handleNextPlayer(2))}>Nope</div>
                <div className='button black' onClick={(() => handleNextPlayer(3))}>Black</div>
            </div>
            <div className='toggle' 
                onClick={handleControlToggle}
            >
                <div className='label'>Controls</div>
                <div className='switch' 
                    style={{
                        backgroundColor: showControls ? '#7262F6' : '#F8F6FF'
                    }}
                >
                    <div className='pip'
                        style={{
                            transform: showControls ? 'translateX(0px)' : 'translateX(-30px)',
                            backgroundColor: showControls ? '#fff' : '#7262F6'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default Game;