import React, { useState, useEffect } from "react";
import axios from "axios";
import "antd/dist/antd.min.css";
import { config } from "../App";
import { Modal, Input } from "antd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Search } from "@mui/icons-material";
import { Button, Box, TextField, InputAdornment } from "@mui/material";
import "./Users.css";
import Pagination from "./Pagination";

const Users = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage] = useState(10);

  const lastIndex = currentPage * userPerPage;
  //1*10 = 10
  const firstIndex = lastIndex - userPerPage;
  const currentData = filteredData.slice(firstIndex, lastIndex);

  const performAPICall = async () => {
    try {
      const url = `${config.endpoint}`;
      const response = await axios.get(url);
      setData(response.data);
      setFilteredData(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleDelete = (id) => {
    const filteredOne = filteredData.filter((item) => item.id !== id);
    setFilteredData([...filteredOne]);
  };

  const editUserData = (record) => {
    setIsEdit(true);
    setEditedUser({ ...record });
  };

  const resetUserData = () => {
    setIsEdit(false);
    setEditedUser(null);
  };

  const performSearch = (text) => {
    if (text !== "") {
      const filteredOne = filteredData.filter((item) => {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(text.toLowerCase());
      });
      setFilteredData(filteredOne);
    } else {
      setFilteredData(data);
    }
    setCurrentPage(1)
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleMultiDelete = () => {
    const afterDeletion = filteredData.filter((item) => !item.isChecked);
    setFilteredData(afterDeletion);
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    if (name === "allSelect") {
      let newUser = filteredData.map((user,index) => {
        if(index >= firstIndex && index < lastIndex){
          return { ...user, isChecked: checked };
        }else{
          return { ...user, isChecked: !checked };
        }
        
      });
      setFilteredData(newUser);

    } else {
      let newUser = filteredData.map((user) =>
        user.name === name ? { ...user, isChecked: checked } : user
      );
      setFilteredData(newUser);
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);


  return (
    <div>
      <TextField
        className="search"
        size="small"
        InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="light" />
            </InputAdornment>
          ),
        }}
        placeholder="Search by name,email or role"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      <table id="users" className="container table table-responsive" style={{ margin: "3rem" }}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="form-check-input"
                name="allSelect"
                checked={!currentData.some((user) => user?.isChecked !== true)}
                onChange={handleChange}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ paddingLeft: "3rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length
            ? currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className={item.isChecked ? "check rowItems" : "rowItems"}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={item.name}
                      checked={item?.isChecked || false}
                      onChange={handleChange}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <Button onClick={() => editUserData(item)}>
                      <i
                        className="far fa-edit"
                        style={{
                          fontSize: "1.5rem",
                          color: "black",
                          paddingLeft: "2rem",
                        }}
                      ></i>
                    </Button>
                    <Button color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteOutlineIcon style={{ marginRight: "1rem" }} />
                    </Button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      {filteredData.length ? (
        <div style={{ margin: "1rem", padding: "2rem" }}>
          <Button variant="contained" color="error" onClick={handleMultiDelete}>
            Delete Selected
          </Button>
        </div>
      ) : (
        <Box textAlign="center">
          <Button variant="contained" color="error" style={{ width: "20rem" }}>
            User not found!
          </Button>
        </Box>
      )}
      <Pagination
        totalPosts={filteredData.length}
        userPerPage={userPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <Modal
        title="Edit User Details"
        open={isEdit}
        okText="Save"
        onCancel={() => {
          resetUserData();
        }}
       
        onOk={() => {
          setFilteredData((oldData) => {
            return oldData.map((user) => {
              if (user.id === editedUser.id) {
                return editedUser;
              } else {
                return user;
              }
            });
          });
          resetUserData();
        }}
      >
        <p style={{ margin: "1rem" }}>Name: </p>
        <Input
          value={editedUser?.name}
          onChange={(event) => {
            setEditedUser((oldData) => {
              return { ...oldData, name: event.target.value };
            });
          }}
        />
        <p style={{ margin: "1rem" }}>Email: </p>
        <Input
          value={editedUser?.email}
          onChange={(event) => {
            setEditedUser((oldData) => {
              return { ...oldData, email: event.target.value };
            });
          }}
        />
        <p style={{ margin: "1rem" }}>Role: </p>
        <Input
          value={editedUser?.role}
          onChange={(event) => {
            setEditedUser((oldData) => {
              return { ...oldData, role: event.target.value };
            });
          }}
        />
      </Modal>
    </div>
  );
};

export default Users;
