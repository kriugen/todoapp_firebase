import React, { useState, useEffect } from "react"

import TextField from "@material-ui/core/TextField"

import IconButton from "@material-ui/core/IconButton"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"

import Log from "../../Log"

import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"

import FormValidator, { required } from "../FormValidator"

const firebase = window.firebase

const Empty = { name: "" }

export default ({ item, done = () => {} }) => {
    let validator = new FormValidator([
        {
            name: "name",
            validate: required,
        },
    ])

    let type = item ? "Update" : "Add"

    const [form, setValues] = useState({ ...Empty })
    let validation = validator.valid(form)

    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (!item) return
        setValues({
            name: item.name || "",
        })
    }, [item])

    if (submitted) {
        validation = validator.validate(form)
    }

    const onSubmit = () => {
        setSubmitted(true)
        validation = validator.validate(form)
        if (!validator.isValid) return

        const input = {
            name: form.name || undefined,
        }

        if (item) input.id = item.id

        Log.info(input, "Todo " + type)

        let collection = firebase.firestore().collection("items")
        const change = {
            ...form,
            uid: firebase.auth().currentUser.uid,
        }
        if (item) {
            collection = collection.doc(item.id).set(change)
        } else {
            collection = collection.add(change)
        }

        collection
            .then(() => done())
            .catch(error => {
                Log.error(error, "Todo " + type)
            })

        // mutation({ input })
        //     .then(() => {
        //         setValues({ ...Empty })
        //         setSubmitted(false)
        //         done()
        //     })
        //     .catch(error => {
        //         Log.error(error, "Todo " + type)
        //         onError(error)
        //     })
    }

    const onChange = e => {
        setValues({ ...form, [e.target.id]: e.target.value })
    }
    return (
        <ListItem>
            <TextField
                autoFocus
                style={{ width: "75%" }}
                id="name"
                margin="normal"
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
            <ListItemSecondaryAction>
                <IconButton onClick={onSubmit}>
                    <CheckIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => done()}>
                    <CloseIcon color="secondary" />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}
