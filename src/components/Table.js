import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import gradient from '../images/table-gradient.svg';

const url = 'https://node-bar-billiards.herokuapp.com';

function Table(props) {
    const history = useHistory();
    const [tableWidth, setTableWidth] = useState(0);
    const ref = useRef(null);

    const [password, setPassword] = useState('');

    function handleResize() {
        setTableWidth(ref.current.offsetWidth);
    }

    useEffect(() => {
        handleResize(); // on render
    }, []);

    window.addEventListener('resize', handleResize);

  
    async function handleConnect() {
        const result = await axios({
            method: 'post',
            url: url + '/api/auth',
            data: {
              tableId: props.tableId,
              password: password,
            }
        });

        console.log(result);
        if (result.status === 200 && result.data.jwt && !result.data.gameId) { // If jwt returned with no gameId
            history.push({
                pathname: '/setup', // Go to setup
                state: { jwt: result.data.jwt, tableName: props.name }
            });
        } else if (result.status === 200 && result.data.jwt && result.data.gameId) { // if jwt returned with gameId
            history.push({
                pathname: '/game', // Join game
                state: { jwt: result.data.jwt, gameId: result.data.gameId }
            });
        }
    }

    return (
        <div className='Table'
            ref={ref}
            style={{
                height: tableWidth / 3
            }}
        >
            <div className='table-text'>
                <div className='table-name'>{props.name}</div>
                <input 
                    type='password' 
                    className='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className='table-connect'
                onClick={handleConnect}
            >Connect &gt;</div>
            <img className='menu-background' src={url + '/api/images/' + props.imgName + '.jpg'} alt='Bar Billiards Table' />
            <img className='gradient' src={ gradient } alt='gradient'/>
        </div> 
    )
}

export default Table;