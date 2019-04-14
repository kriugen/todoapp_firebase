import React, { useState, useContext } from "react"
import { withRouter } from "react-router-dom"

import { withStyles } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"

import Button from "@material-ui/core/Button"
import Log from "../Log"
import Context from "./Context"

import FormValidator, { required, email } from "./FormValidator"
import PasswordValidator from "./PasswordValidator"

const firebase = window.firebase

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
    },
}

const Empty = { name: "", email: "", password: "" }

const Signup = ({ history, classes, signup, onProfileUpdate }) => {
    let validator = new FormValidator([
        { name: "name", validate: required },
        { name: "email", validate: [required, email] },
        { name: "password", validate: required },
    ])

    const [form, setValues] = useState({ ...Empty })
    const { setErrors } = useContext(Context)
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
            .createUserWithEmailAndPassword(form.email, form.password)
            .then(({ user }) =>
                user.updateProfile({
                    displayName: form.name,
                })
            )
            .then(() => onProfileUpdate())
            .then(() => history.push("/"))
            .catch(error => {
                Log.error(error, "Signup")
                setErrors([error.message])
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
                id="name"
                margin="normal"
                placeholder="Name"
                value={form.name}
                error={validation.name.error}
                helperText={validation.name.message}
                onChange={e => onChange(e)}
                onKeyPress={e => {
                    if (e.key === "Enter") {
                        onSubmit()
                    }
                }}
            />

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
            {submitted && <PasswordValidator password={form.password} />}
            <Button
                onClick={() => onSubmit()}
                variant="contained"
                color="primary"
            >
                Signup
            </Button>
            <Button color="primary" onClick={() => history.push("/")}>
                Login
            </Button>
        </form>
    )
}

export default withRouter(withStyles(styles)(Signup))
