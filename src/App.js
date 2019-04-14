import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import { withStyles } from "@material-ui/core/styles"

import About from "./components/About"
import Header from "./components/Header"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Todo from "./components/Todo"
import Errors from "./components/Errors"
import Context from "./components/Context"

const firebase = window.firebase

const styles = {
    padded: {
        padding: 8,
    },
}

const App = ({ classes }) => {
    const [user, setUser] = useState()
    const [errors, setErrors] = useState()

    useEffect(() => {
        const unsubscribeAuth = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })

        return () => {
            unsubscribeAuth()
        }
    }, [])

    return (
        <Context.Provider value={{ setErrors }}>
            <div className={classes.padded}>
                <Router>
                    <Header
                        user={user}
                        signOut={() => firebase.auth().signOut()}
                    />
                    <div className={classes.padded}>
                        <Route exact path="/" component={user ? Todo : Login} />
                        <Route path="/about" component={About} />
                        <Route
                            path="/signup"
                            render={props => (
                                <Signup
                                    {...props}
                                    onProfileUpdate={() =>
                                        setUser(firebase.auth().currentUser)
                                    }
                                />
                            )}
                        />
                        <Errors errors={errors} />
                    </div>
                </Router>
            </div>
        </Context.Provider>
    )
}

export default withStyles(styles)(App)
