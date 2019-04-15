import React, { Fragment, useState, useEffect } from "react"

import List from "@material-ui/core/List"
import AddIcon from "@material-ui/icons/Add"
import Fab from "@material-ui/core/Fab"
import Form from "./Form"
import Item from "./Item"

const firebase = window.firebase

export default () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [items, setItems] = useState([])

    useEffect(() => {
        const unsubscribeFirestore = firebase
            .firestore()
            .collection("items")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(({ doc, type }) => {
                    const id = doc.id

                    if (type === "removed") {
                        setItems(prevItems => {
                            let index = prevItems.findIndex(pi => pi.id === id)
                            prevItems.splice(index, 1)

                            return [...prevItems]
                        })
                    } else {
                        const item = { id, ...doc.data() }
                        setItems(prevItems => {
                            let index = prevItems.findIndex(pi => pi.id === id)
                            if (index > -1) {
                                prevItems[index] = item
                                return [...prevItems]
                            } else {
                                return [...prevItems, item]
                            }
                        })
                    }
                })
            })

        return () => {
            unsubscribeFirestore()
        }
    }, [])

    return (
        <Fragment>
            <List>
                {items.map(item => (
                    <Item
                        key={item.id}
                        selectedItem={selectedItem}
                        onItemSelected={id => {
                            setShowAddForm()
                            setSelectedItem(id)
                        }}
                    >
                        {item}
                    </Item>
                ))}
                {showAddForm && <Form done={() => setShowAddForm(false)} />}
            </List>
            {!showAddForm && (
                <Fab
                    color="primary"
                    style={{ float: "right" }}
                    onClick={() => {
                        setSelectedItem()
                        setShowAddForm(true)
                    }}
                >
                    <AddIcon />
                </Fab>
            )}
        </Fragment>
    )
}
