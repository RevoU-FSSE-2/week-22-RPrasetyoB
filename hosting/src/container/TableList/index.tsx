import React, {  useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Pagination, Select, StepIconClassKey, TextField } from "@mui/material";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useGetToken, useAuthChecker } from "../../hook";
import { mainDivStyle, subDivStyle, mainDivStyleMobile } from "../../component/TableStyle";
import { AppContext } from "../../provider/AppProvider";
import useFetchApi from "../../utils/FetchApi";
import Swal from "sweetalert2";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import  EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format } from 'date-fns';
import Backdrop from '@mui/material/Backdrop';
import { EditModal } from "../../component";
import { ApiUrl } from "../../utils/api";

interface Todo {
  id: string;
  todo: string;
  status: string;
  due_date: string;
  priority: string;
  maker: string;
}

const validationSchema = Yup.object().shape({
  todo: Yup.string().required("Todo name is required"),
  priority: Yup.string().required("Todo priority is required")
});

interface AddCategory{
  todo: string;
  priority: string;
}

const initialValues = {
  todo: '',
  priority: '',
}

const TableList: React.FC = () => {
  const token = useGetToken();
  useAuthChecker(token);
  const navigate = useNavigate();
  const { fetchList, deleteTask, handleLogout } = useFetchApi();
  const { todolist, setTodolist, setUser } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const initialCheckedState = todolist.map((todo) => todo.status);
  const [checked, setChecked] = useState(initialCheckedState);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState({ id: "", todo: "", status: "", due_date: "", priority: "", maker: "" });
  const openEditModal = () => {
    setEditModalOpen(true);
  };
  
  const getList = async () => {
    const response = await fetchList();
    if (response?.ok) {
      const data = await response.json();
      console.log('data',data)
      setTodolist(data.result.data);
      setUser({username: data.user, role: data.role})
      const newData = data.result.data;
      const newCheckedState = newData.map((todo: any) => todo.status === 'done');
      setChecked(newCheckedState);
    } else {
      console.error("Failed to fetch categories");
    }
  };
  
  const deleteList = async (id: string) => {
    // Use SweetAlert2 for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // User confirmed, proceed with the deletion
      const response = await deleteTask(id);

      if (response?.ok) {
        setTodolist((categories) =>
          categories.filter((category) => category.id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Todo Deleted",
          text: "Successfully deleted task",
        });
      } else if (response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "You don't have authorization to delete the current todo",
        });
      }
    } else {
      // User canceled, show a message
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Your todo is safe :)",
      });
    }
  };
  
  const handleSubmit = async (values: AddCategory, {resetForm}: any) => {
    const Url = ApiUrl + "/todo";
    const response = await fetch(Url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    });
    if(response.ok) {
      getList()
      Swal.fire({
        icon: "success",
        title: "Add todo Success",
        text: "Successfully added todo.",
      });
      resetForm()
    } else {
      Swal.fire({
        icon: "error",
        title: "Add Todo Failed",
        text: "An error occurred during add. Please try again.",
      });
    }
  };
  useEffect(() => {
    getList();
  }, []);
  
  const updateTodolist = (updatedTodo: any) => {
    setTodolist((prevTodolist) => {
      return prevTodolist.map((task) => {
        if (task.id === updatedTodo.id) {
          return updatedTodo;
        } else {
          return task;
        }
      });
    });
  };

  const formatDueDate = (due_date: string) => {
    const parsedDueDate = new Date(due_date);
    parsedDueDate.setDate(parsedDueDate.getDate());
    return format(parsedDueDate, 'MMM dd');
  };


  const handleEditInputChange = (event: any) => {
    const { name, value } = event.target;
    setEditTodo({
      ...editTodo,
      [name]: value,
    });
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const editClick = (todo: Todo) => {
    const todoDetail = {
      id: todo.id,
      todo: todo.todo,
      status:todo.status,
      due_date: todo.due_date,
      priority: todo.priority,
      maker: todo.maker
    }
    setEditTodo(todoDetail)
    handleOpenBackdrop()
    openEditModal()
  }

  const itemsPerPage = 7;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnCurrentPage = todolist.slice(startIndex, endIndex);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobileView = windowWidth < 450;

  return (
    <div style={isMobileView ? mainDivStyleMobile : mainDivStyle}>
      <div style={subDivStyle}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Box sx={{ minWidth: 120 }}>
            <Form onSubmit={handleSubmit} style={{ width:'100%', display: 'flex', flexDirection: 'row',gap: 10, alignItems:'center', justifyContent: 'space-between', paddingLeft: 8, paddingRight: 8}}>
              <TextField sx={{bgcolor: 'background.paper', height: 56, borderRadius: 1, width: '70%'}} label= "Add new todo" variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.todo && errors.todo)}
                helperText={touched.todo && errors.todo}
                name="todo"
                value={values.todo}
                required
                />
              <FormControl sx={{ bgcolor: 'background.paper', borderRadius: 1, width: '25%', maxHeight: 50, height:50, marginBottom:1}} variant="filled">
                <InputLabel htmlFor="priority">priority</InputLabel>
                <Select
                  sx={{bgcolor: 'background.paper'}}
                  labelId="priority"
                  name= "priority"
                  value={values.priority}
                  label="priority"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  >
                  <MenuItem value={'low'}>low</MenuItem>
                  <MenuItem value={'medium'}>medium</MenuItem>
                  <MenuItem value={'high'}>high</MenuItem>
                </Select>
              </FormControl>
              <Button type= "submit" color ="primary" variant="contained" style={{height: 45, width: 100}} disabled= {isSubmitting}>Add</Button>
            </Form>          
          </Box>
        )}
      </Formik>
        
        <List sx={{ width: '100%', minWidth: 450, bgcolor: 'background.paper', margin: 'auto', borderRadius: 2, marginTop: 1 }}>
          <table style={{ width: '97%', overflow: 'auto' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width:"30%", paddingLeft:50}}>Task</th>
                <th style={{ textAlign: 'center', width:"20%", paddingRight:10 }}>Priority</th>
                <th style={{ textAlign: 'center', width:"20%" }}>DueDate</th>
                <th style={{ textAlign: 'center', width:"20%" }}>Maker</th>
                <th style={{ textAlign: 'center', width:"20%" }}>&nbsp;Action</th>
              </tr>
            </thead>
            <tbody>
            {todolist.length === 0 ? (
                  <tr style={{width: "100%", textAlign: 'center', paddingTop: 20}}>
                    <td colSpan={5} style={{paddingLeft: 28, paddingTop: 20}}>
                      &nbsp;No data
                    </td>
                  </tr>
                ) : (
                  itemsOnCurrentPage.map((todo, index) => {
                    const labelId = `checkbox-list-label-${todo.id}`;
                    const priorityColorStyle = {
                      color: todo.priority === 'high' ? 'red' :
                        todo.priority === 'medium' ? 'orange' : 'black'
                    };
                    const priorityBGstyle = {
                      background: todo.priority === 'high' ? 'red' :
                        todo.priority === 'medium' ? 'orange' : 'black'
                    };
    
                    return (
                      <tr key={todo.id}>
                        <td>
                          <ListItem disablePadding>
                            <ListItemButton role={undefined}>
                              <ListItemText
                                style={{ ...priorityColorStyle, textDecoration: todo.status == "done" ? 'line-through' : '', width:"30%" }}
                                id={labelId}
                                primary={todo.todo}
                              />
                            </ListItemButton>
                          </ListItem>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ ...priorityBGstyle, color: 'white', padding: 5, paddingTop: 2, borderRadius: 10, textDecoration: todo.status == "done" ? 'line-through' : '', marginRight: 20 }}>{todo.priority}</span>
                        </td>
                        <td style={{ textDecoration: todo.status == "done" ? 'line-through' : '', paddingLeft: 5}}>{formatDueDate(todo.due_date)}</td>
                        <td style={{ textDecoration: todo.status == "done"  ? 'line-through' : '', paddingLeft: 5}}>{todo.maker}</td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton edge="end" onClick={() => editClick(todo)}>
                              <EditTwoToneIcon />
                            </IconButton>
                            <EditModal
                              open={editModalOpen}
                              onClose={() => {setEditModalOpen(false); setOpenBackdrop(false)}}
                              editTodo={editTodo}
                              handleEditInputChange={handleEditInputChange}
                              handleCloseBackDrop={handleCloseBackdrop}/>
                            <IconButton edge="end" onClick={() => deleteList(todo.id)}>
                              <DeleteTwoToneIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}              
            </tbody>
          </table>
        </List>
      <div style={{ textAlign: "center", display: 'flex', alignItems: 'right', justifyContent: 'center'}}>
        <Pagination
          count={Math.ceil(todolist.length / itemsPerPage)}
          page={page}
          onChange={(event, newPage) => handlePageChange(newPage)}
          color="primary"
          style={{background:'white', borderRadius: 30, padding: 0}}
        />
      </div>
      </div>
      <Backdrop
        sx={{ color: "black", zIndex: (theme:any) => theme.zIndex.drawer + 0.5 }}
        open={editModalOpen}
        onClick={handleCloseBackdrop}
      ></Backdrop>
    </div>
  );
};

export default TableList
