import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

import PlayerListItem from './PlayerListItem';

function Setup() {
    const location = useLocation();
    const { jwt, tableName } = location.state;
    const history = useHistory();

    const [playerData, setPlayerData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [newPlayerInput, setNewPlayerInput] = useState('');

    function selectPlayer(playerId) {
        let tempSelectedPlayers = selectedPlayers;

        const foundInPlayerData = playerData.find(player => player.playerId === playerId);

        const index = tempSelectedPlayers.findIndex(player => player.playerId === foundInPlayerData.playerId);

        if (index === -1) {
            tempSelectedPlayers.push({ playerId: foundInPlayerData.playerId });
        } else {
            tempSelectedPlayers.splice(index, 1);
        }
        setSelectedPlayers(tempSelectedPlayers);
    }

    function handlePlayerInput(event) {
        setNewPlayerInput(event.target.value);
    }

    async function handleSubmitPlayer() {
        // Verify
        if (newPlayerInput.length < 1) return console.log('Name must to be at least 1 char in length');
        if (newPlayerInput.length > 18) return console.log('Name must be shorter than 18 chars')

        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/players',
            data: { name: newPlayerInput },
            headers: {
                'x-auth-token': jwt
            }
        });

        if (result.status === 200) {
            setNewPlayerInput('');
            return getPlayerList();
        }
    }

    const getPlayerList = useCallback(async () => {
        const result = await axios({
            method: 'GET',
            url: 'http://localhost:8080/api/players',
            headers: {
                'x-auth-token': jwt
            }
        });
        console.log(result)
        setPlayerData(result.data);
    }, [jwt]);

    useEffect(() => {
        getPlayerList();
    }, [getPlayerList])

    async function handleDeletePlayer(playerId) {
        console.log(playerId)
        const result = await axios({
            method: 'DELETE',
            url: 'http://localhost:8080/api/players',
            data: { playerId },
            headers: {
                'x-auth-token': jwt
            }
        });

        if (result.status === 200) return getPlayerList();
    }

    async function handleStartGame() {
        // Verify
        if (selectedPlayers.length < 2) return console.log('Need at least 2 players');
        
        try {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/games/newgame',
                data: selectedPlayers,
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

    return (
        <div className='Setup container'>
            <div className='table-info'>
                <h1 className='table-name'>{tableName}</h1>
                <div className='table-status'>Online<div className='status-indicator'></div></div>
            </div>
            <div className='setup-form'>
                <h2>Select Players</h2>
                <div className='player-list'>
                    {playerData.map(player => (
                        <PlayerListItem 
                            playerId={player.playerId}
                            name={player.name}
                            key={player.playerId}
                            selectPlayer={selectPlayer}
                            deletePlayer={handleDeletePlayer}
                        />
                    ))}
                </div>
                

                <div className='register-new-player'>
                    <h2>Register New Player</h2>
                    <div className='player-form'>
                        <input placeholder='Name' value={newPlayerInput} onChange={handlePlayerInput}/>
                        <div className='call-to-action' onClick={handleSubmitPlayer}>Submit</div>
                    </div>
                </div>
            </div>

            <div className='call-to-action start-game' onClick={handleStartGame}>Start Game</div>
        </div>
    )
}

export default Setup;