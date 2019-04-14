import React from "react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"

import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import { Typography } from "@material-ui/core"

const PasswordValidator = ({ password }) => {
    if (!password) return null

    let list = []
    list.push({ text: "At least 6 characters", status: password.length >= 6 })
    list.push({
        text: "Contains a number",
        status: password.split("").some(c => c >= "0" && c <= "9"),
    })

    if (list.some(i => !i.status))
        return (
            <List>
                {list.map((i, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            {i.status ? (
                                <CheckIcon color="primary" />
                            ) : (
                                <CloseIcon color="secondary" />
                            )}
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    color={i.status ? "primary" : "secondary"}
                                >
                                    {i.text}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        )

    return null
}

export default PasswordValidator
