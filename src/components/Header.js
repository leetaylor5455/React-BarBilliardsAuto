import React from 'react';

function Header(props) {

    return (
        <header style={{transform: props.hidden ? 'translateY(-100%)' : 'translateY(0%)'}}>
            <div className="container">
            <svg xmlns="http://www.w3.org/2000/svg" width="91" height="47" viewBox="0 0 91 47">
                <g id="Brand" transform="translate(-20 -6)">
                    <text id="SB" transform="translate(20 43)" fill="#1f1f1f" font-size="38" font-family="Montserrat-Light, Montserrat" font-weight="300" letter-spacing="-0.075em"><tspan x="0" y="0">SB</tspan></text>
                    <text id="auto" transform="translate(69 21)" fill="#4433d4" font-size="16" font-family="Montserrat-Italic, Montserrat" font-style="italic" letter-spacing="0.075em"><tspan x="0" y="0">auto</tspan></text>
                </g>
            </svg>
            </div>
        </header>
    )
}

export default Header;