import React from 'react';
import brand from '../images/brand.svg';

function Header(props) {

    return (
        <header style={{transform: props.hidden ? 'translateY(-100%)' : 'translateY(0%)'}}>
            <div className="container">
                <img src={ brand } alt="Logo"/>
            </div>
        </header>
    )
}

export default Header;