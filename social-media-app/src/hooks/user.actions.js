    import {useNavigate} from "react-router-dom";
    import axios from "../helpers/axios";


    function useUserActions() {
        const navigate = useNavigate();
        const baseURL = process.env.REACT_APP_API_URL;

        return {
            login,
            register,
            logout,
            edit,
        };

        function edit(data, userId){
            return axios
                .patch(`/users/${userId}/`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(res => {
                    localStorage.setItem("auth", JSON.stringify({
                        access: getAccessToken(),
                        refresh: getRefreshToken(),
                        user: res.data,
                    }));
                })
        }

        function login(data) {
            return axios.post(`${baseURL}/auth/login/`, data)
                .then(res => {
                    setUserData(res.data);
                    navigate("/");
                });
        }
        function register(data) {
            return axios.post(`${baseURL}/auth/register/`, data)
                .then(res => {
                    setUserData(res.data);
                    navigate("/");
                });
        }
        function logout() {
            return axios
                .post(`${baseURL}/auth/logout/`, {'refresh': getRefreshToken()})
                .then(res => {
                    localStorage.removeItem("auth");
                    navigate("/login/");
                });
        }
    }

    function getUser(){
        const auth = JSON.parse(localStorage.getItem("auth")) || null;
        if (auth) {
            return auth.user;
        }
        else{
            return null;
        }
    }

    function getAccessToken() {
        const auth = JSON.parse(localStorage.getItem("auth")) || null;
        if (auth) {
            return auth.access;
        }
        else{
            return null;
        }
    }
    function  getRefreshToken() {
        const auth = JSON.parse(localStorage.getItem("auth")) || null;
        if (auth) {
            return auth.refresh;
        }
        else{
            return null;
        }
    }

    function setUserData(data) {
        localStorage.setItem("auth", JSON.stringify({
            access: data.access,
            refresh: data.refresh,
            user: data.user,
        }));
    }

    export {useUserActions, getUser, getAccessToken, getRefreshToken, setUserData};