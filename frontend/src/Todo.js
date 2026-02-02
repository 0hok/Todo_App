import { useState, useEffect } from "react";

export default function Todo() {

    //add item states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    //edit item states
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiurl = "http://localhost:8000";

    //check inputs
    const handleSubmit = () => {
        if (title.trim() !== "" && description.trim() !== "") {
            //api call to add item
            fetch(apiurl + "/todos", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    //add item to list
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 2000)
                }
                else {
                    //error message
                    setError("Unable to add or create Item");

                }
            }).catch(() => {
                setError("Unable to add or create Item");
                setTimeout(() => {
                    setError("");
                }, 2000)
            })
        }

    }

    useEffect(() => {
        getItems();
    }, [])

    const getItems = () => {
        fetch(apiurl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res)
            })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            //api call to update item
            fetch(apiurl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    //update item to list
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000)

                    setEditId(-1);
                }
                else {
                    //error message
                    setError("Unable to add or create Item");

                }
            }).catch(() => {
                setError("Unable to add or create Item");
                setTimeout(() => {
                    setError("");
                }, 2000)
            })
        }
    }

    const handleEditCancle = () => {
        setEditId(-1);
    }

    const handleDelete = (id) => {
        setError("");
        if (window.confirm("Are you sure to delete thid item?")) {
            fetch(apiurl + "/todos/" + id, {
                method: "DELETE"
            }).then((res) => {
                if (res.ok) {
                    //delete item from list
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                    setMessage("Item deleted successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 2000)
                }
                else {
                    //error message
                    setError("Unable to delete Item");

                }
            }).catch(() => {
                setError("Unable to delete Item");
                setTimeout(() => {
                    setError("");
                }, 2000)
            })
        }
    }

    return (
        <>
            <div className="row p-3 bg-success text-light text-center border-b rounded">
                <h1>Todo Project using MERN</h1>
            </div>
            <div className="row mt-4">
                <h3 >Add Items</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        className="form-control"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        placeholder="title" />
                    <input
                        className="form-control"
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="description" />
                    <button className="btn btn-dark" onClick={handleSubmit}>Add</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row mt-4 p-2">
                <h3>Tasks</h3>
                <div className="col-md-7 bg-light p-2 border rounded">
                    <ul className="list-group">
                        {todos.map((item) =>

                            <li className="list-group-item d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {editId == -1 || editId !== item._id ?
                                        <>
                                            <span className="fw-semibold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </> :
                                        <>
                                            <div className="form-group d-flex gap-2">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    value={editTitle}
                                                    placeholder="title" />
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    value={editDescription}
                                                    placeholder="description" />
                                            </div>
                                        </>
                                    }

                                </div>
                                <div className="d-flex gap-2">
                                    {editId == -1 || editId !== item._id ?
                                        <button className="btn btn-info"
                                            onClick={() => handleEdit(item)}>Edit</button> :
                                        <button className="btn btn-info" onClick={handleUpdate}>Update</button>
                                    }
                                    {editId == -1 || editId !== item._id ?
                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                                        <button className="btn btn-secondary" onClick={handleEditCancle}>Cancel</button>
                                    }
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}