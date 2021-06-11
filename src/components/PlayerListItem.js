import React, { useState } from 'react';
import useLongPress from '../hooks/useLongPress';

import tick from '../images/tick.svg';

function PlayerListItem(props) {

    const [isLongPressed, setIsLongPressed] = useState(false);
    const deleteLongPress = useLongPress(handleLongPress, 500);

    function handleLongPress() {
        if (!isLongPressed) setIsLongPressed(!isLongPressed);
    }

    const [isSelected, setIsSelected] = useState(false);

    function handlePlayerClick() {
        setIsSelected(!isSelected);
        props.selectPlayer(props.playerId);
    }

    const styles = {
        purpleLight: '#7262F6',
        purple: '#4433D4',
        greyLight: '#707070',
        grey: '#4A4A4A',
    }

    const deleteInterfaceStyles = {
        hidden: {
            opacity: 0,
            pointerEvents: 'none'
        },
        visible: {
            opacity: 1,
            pointerEvents: 'all'
        }
    }

    return (
        <div className='player-option' 
            key={props.playerId}
            onClick={handlePlayerClick}
            style={isSelected 
                ? { borderColor: styles.purpleLight }
                : { borderColor: styles.greyLight }
            }
            {...deleteLongPress}
        >
            <div className='player-name'
                style={isSelected 
                    ? { color: styles.purple }
                    : { color: styles.grey }
                }
            >{props.name}</div>
            <div className='selected-indicator'
                style={isSelected 
                    ? { borderColor: styles.purpleLight, backgroundColor: styles.purpleLight }
                    : { borderColor: styles.greyLight, backgroundColor: '#fff' }
                }
            >
                <img className='tick' src={tick} alt='tick icon'/>
            </div>

            <div className='delete-interface'
                style={isLongPressed ? deleteInterfaceStyles.visible : deleteInterfaceStyles.hidden}
            >
                <div className='delete'
                    onClick={(() => { props.deletePlayer(props.playerId) })}
                >Delete</div>
                <div className='cancel'
                    onClick={((e) => { e.stopPropagation(); setIsLongPressed(false) })}
                >Cancel</div>
            </div>
        </div>
    )
}

export default PlayerListItem;