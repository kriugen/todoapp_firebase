import React from "react"

import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"

import Log from "../../../Log"

const firebase = window.firebase

export default ({ id, done = () => {} }) => {
    const onDelete = e => {
        Log.info(id, "Todo Delete")
        console.log("delete " + id)
        firebase
            .firestore()
            .collection("items")
            .doc(id)
            .delete()
            .then(() => done())
            .catch(error => Log.error(error))
    }

    return (
        <IconButton onClick={onDelete}>
            <DeleteIcon />
        </IconButton>
    )
}
