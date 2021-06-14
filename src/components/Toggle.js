import React from 'react';

function Toggle(props) {
    return (
        <div className='toggle'
            onClick={props.onToggle}
        >
            <div className='label'>{props.label}</div>
            <div className='switch' 
                style={{
                    backgroundColor: props.on ? '#7262F6' : '#F8F6FF'
                }}
            >
                <div className='pip'
                    style={{
                        transform: props.on ? 'translateX(0px)' : 'translateX(-30px)',
                        backgroundColor: props.on ? '#fff' : '#7262F6'
                    }}
                ></div>
            </div>
        </div>
    )
}

export default Toggle;