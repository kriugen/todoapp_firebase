import React, { useState, useContext } from "react"
import { withRouter } from "react-router-dom"

import { withStyles } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"

import Button from "@material-ui/core/Button"

import FormValidator, { required, email } from "./FormValidator"
import Log from "../Log"
import Context from "./Context"

const firebase = window.firebase

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
    },
}

const Empty = { email: "", password: "" }

const Login = ({ history, classes }) => {
    const { setErrors } = useContext(Context)
    let validator = new FormValidator([
        {
            name: "email",
            validate: [required, email],
        },
        {
            name: "password",
            validate: required,
        },
    ])

    const [form, setValues] = useState({ ...Empty })
    let validation = validator.valid(form)

    const [submitted, setSubmitted] = useState(false)

    if (submitted) {
        validation = validator.validate(form)
    }

    const onSubmit = () => {
        setSubmitted(true)
        validation = validator.validate(form)
        if (!validator.isValid) return

        firebase
            .auth()
            .signInWithEmailAndPassword(form.email, form.password)
            .then(() => setErrors())
            .catch(error => {
                setErrors([error.message])
                Log.error(error)
            })
    }

    const onChange = e => {
        setValues({ ...form, [e.target.id]: e.target.value })
    }

    return (
        <form className={classes.form}>
            <TextField
                className={classes.textField}
                autoFocus
                id="email"
                margin="normal"
                placeholder="Email"
                value={form.email}
                error={validation.email.error}
                helperText={validation.email.message}
                onChange={e => onChange(e)}
                onKeyPress={e => {
                    if (e.key === "Enter") {
                        onSubmit()
                    }
                }}
            />
            <TextField
                className={classes.textField}
                type="password"
                id="password"
                margin="normal"
                placeholder="Password"
                value={form.password}
                error={validation.password.error}
                helperText={validation.password.message}
                onChange={e => onChange(e)}
                onKeyPress={e => {
                    if (e.key === "Enter") {
                        onSubmit()
                    }
                }}
            />
            <Button
                onClick={() => onSubmit()}
                variant="contained"
                color="primary"
            >
                Login
            </Button>
            <Button color="primary" onClick={() => history.push("/signup")}>
                Signup
            </Button>
        </form>
    )
}

export default withRouter(withStyles(styles)(Login))
