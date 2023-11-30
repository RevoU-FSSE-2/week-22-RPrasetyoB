import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ApiUrl } from "./api";
import { useGetToken } from "../hook";

interface LoginValue {
  username: string;
  password: string;
}

interface RegisterValue {
  username: string,
  password: string,
  role: string
}

interface EditList {
  id: string;
  todo: string;
  due_date: string;
}

// const { todolist, setTodolist } = useContext(AppContext);

const useFetchApi = () => {
  const navigate = useNavigate();
  
  const loginUser = async (values : LoginValue) => {
    try {
      const Url = ApiUrl + '/auth/login';
      const response = await fetch(Url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      const data =  await response.json()
      const token = data.token
      localStorage.setItem("accessToken", token)
      return response
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred while processing your request. Please try again later.",
      });
    }
  } 
  
  const registerUser = async (values : RegisterValue) => {
    try {
      const Url = ApiUrl + '/auth/register';
      const response = await fetch(Url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      return response
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "registration Failed",
        text: "An error occurred while processing your request. Please try again later.",
      });
    }
  }

  const fetchList = async () => {
    const token = useGetToken()
    try {
      const Url = ApiUrl + '/todo';
      const response = await fetch(Url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    const token = useGetToken()
    try {
      const Url = ApiUrl + `/todo/${id}`;
      const response = await fetch(Url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      return response;
    } catch (error) {
      console.error("Error while deleting category:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate("/login");
    Swal.fire("Logged Out");
    return null
  };

  return {
    loginUser,
    registerUser,
    fetchList,
    deleteTask,
    handleLogout,
  };
};

export default useFetchApi;
