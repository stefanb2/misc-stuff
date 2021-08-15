import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Main} from './components/Main';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/:date/:providerId/:selectorId" component={Main} />
          <Route path="/:date/:providerId" component={Main} />
          <Route path="/:date" component={Main} />
          <Route exact path="/" component={Main} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
