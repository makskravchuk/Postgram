import React, {createContext, useMemo, useState} from "react";
import Navbar from "../components/Navbar";
import Toaster from "./Toaster";
import {useNavigate} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

export const Context = createContext("unknown");

function Layout(props) {

    const {hasNavigationBack} = props;

    const navigate = useNavigate();

    const [toaster, setToaster] = useState({
        title: "",
        show: false,
        message: "",
        type: "",
    });

    const value = useMemo(() => ({toaster, setToaster}),[toaster]);
    return (
        <Context.Provider value={value}>
        <div>
            <Navbar/>
            {hasNavigationBack && (
                <ArrowLeftOutlined
                    style={{
                        color: "#0D6EFD",
                        fontSize: "27px",
                        position: "fixed",
                        marginLeft: "3%",
                        marginTop: "2%",
                    }}
                    onClick={() => navigate(-1)}
                />
            )}
            <div className="container my-5">{props.children}</div>
        </div>
        <Toaster
            title={toaster.title}
            type={toaster.type}
            message={toaster.message}
            onClose={() => setToaster({...toaster, show: false})}
            showToast={toaster.show}
        />
        </Context.Provider>
    );
}

export default Layout;