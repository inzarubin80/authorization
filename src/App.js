import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom'

import Login from './components/loginPage/LoginPage.js';
import PasswordChange from './components/PasswordChange/PasswordChange';
import Heder from './components/Heder/Heder.js';
import Start from './components/Start/Start';
import GetCode from './components/GetCode/GetCode';
import Projects from './components/Projects/Projects';

import { MaketCardState } from './context/MaketCard/MaketCardState';
import { ReportsState } from './context/Reports/ReportsState';
import { MaketProjectState } from './context/ProjectMaket/MaketProjectState';
//import { MaketsState } from './context/Makets/MaketsState';



import { useSelector } from 'react-redux';

//import  firebase from './firebase'

function App() {


    return (
        <div className="btb">

            <Router>

                <>

                    <Heder />

                    <Switch>



                        <Route path="/login">
                            <Login />
                        </Route>

                        <Route path="/password-change/:key">
                            <PasswordChange />
                        </Route>

                        <Route path="/get-code">
                            <GetCode />
                        </Route>

                        <PrivateRoute exact path="/">
                            <Start />
                        </PrivateRoute>

                        <PrivateRoute exact path="/projects">
                                <Projects/>
                        </PrivateRoute>
                        

                        <Route path="*">
                            <NoMatch />
                        </Route>

                        


                    </Switch>
                </>
            </Router>
        </div>
    )
}

function PrivateRoute({ children, ...rest }) {

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}


function NoMatch() {
    let location = useLocation();

    return (
        <div>
            <h3>
                ????????????????, ???????????? ???? ???????????????? ?????? ???????????????? ??????????????. ?????????????????? ???????????????????????? ????????????, ???? ?????????????? ???? ?????????????????? ??????????????.
            </h3>
        </div>
    );
}


export default App;