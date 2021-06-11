import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.scss';

import Header from './components/Header';
import TablesMenu from './components/TablesMenu';
import Setup from './components/Setup';
import Game from './components/Game';

function App() {

  const [hidden, setHidden] = useState(false);

  function showHideHeader(value) {
    console.log(value);
    setHidden(value);
  }

  return (
    <Router>
      <div className="App">
        <Header hidden={hidden}/>
        <Switch>
          <Route path='/' exact component={TablesMenu}/>
          <Route path='/setup' component={Setup}/>
          <Route 
            path='/game' 
            render={(props) => (
              <Game {...props} showHideHeader={showHideHeader} />
            )}
          />
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
