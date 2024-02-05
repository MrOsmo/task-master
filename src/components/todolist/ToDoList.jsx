import axios from 'axios';
import React, { useState, useEffect } from 'react';
import scss from "./ToDoList.module.scss"

const ToDoList = () => {
  const url = "https://elchocrud.pro/api/v1/dc2065f17e7e48e31c6803bcd955e599/todo";
  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [updatedTitles, setUpdatedTitles] = useState({});
  const [updatedImage, setUpdatedImage] = useState({});
  const [updatedDescription, setUpdatedDescription] = useState({});

  const handleTasks = async () => {
    const newData = {
      title: title,
      image: image,
      description: description
    };
    const response = await axios.post(url, newData);
    setTodo(response.data);
    setTitle("");
    setImage("");
    setDescription("");
  };

  const getTasks = async () => {
    const response = await axios.get(url);
    setTodo(response.data);
  };

  const deleteTasks = async (id) => {
    const response = await axios.delete(`${url}/${id}`);
    setTodo(response.data);
    setUpdatedTitles((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updateTasks = async (id) => {
    const updatedData = {
      title: updatedTitles[id] || "",
      image: updatedImage[id] || "",
      description: updatedDescription[id] || ""
    };
    const response = await axios.put(`${url}/${id}`, updatedData);
    setTodo(response.data);
    setUpdatedTitles((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setUpdatedImage((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setUpdatedDescription((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const deleteAllTasks = async () => {
    const response = await axios.delete(url)
    getTasks(response)
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className={scss.layout}>
      <div className={scss.heading}>
        <h1>TASK MASTER</h1>
      </div>
      <div className={scss.inputs}>
        <input
          type="text"
          placeholder='Add title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder='Add image...'
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder='Add description...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleTasks}>Add</button>
      </div>

      <div>
        {todo.map((item) => (
          <div key={item._id}>
            {updatedTitles[item._id] || updatedImage[item._id] || updatedDescription[item._id] !== undefined ? (
              <div>
                <input
                  type="text"
                  placeholder='New title...'
                  value={updatedTitles[item._id] }
                  onChange={(e) => setUpdatedTitles((prev) => ({ ...prev, [item._id]: e.target.value }))}
                />

                <input
                  type="text"
                  placeholder='New image...'
                  value={updatedImage[item._id]}
                  onChange={(e) => setUpdatedImage((prev) => ({ ...prev, [item._id]: e.target.value }))}
                />

                <input
                  type="text"
                  placeholder='New description...'
                  value={updatedDescription[item._id]}
                  onChange={(e) => setUpdatedDescription((prev) => ({ ...prev, [item._id]: e.target.value }))}
                />
                <button onClick={() => updateTasks(item._id)}>Save</button>
              </div>
            ) : (
              <div>
                <h1>{item.title}</h1>
                <img width="150px" height="145px" src={item.image} alt={item.title} />
                <p>{item.description}</p>
                <button onClick={() => setUpdatedTitles((prev) => ({ ...prev, [item._id]: item.title }))}>Update</button>
              </div>
            )}
            <button onClick={() => deleteTasks(item._id)}>Delete</button>
          </div>
        ))}
      </div>
        <button onClick={deleteAllTasks}>Delete All</button>
    </div>
  );
};

export default ToDoList;
