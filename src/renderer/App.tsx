import { ThemeProvider } from '@mui/private-theming';
import Home from 'pages/Home';
import Tracker from 'pages/Tracker';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import muiTheme from 'utils/theme';
import './App.css';

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <Router>
        <Switch>
          {/* Tracker Screen */}
          <Route exact path="/tracker" component={Tracker} />
          {/* Login Screen */}
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
