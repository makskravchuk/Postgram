import {Card, Dropdown} from "react-bootstrap";
import {getUser} from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";
import React, {useContext} from "react";
import {Image} from "react-bootstrap";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import {LikeFilled, LikeOutlined, MoreOutlined} from "@ant-design/icons";
import {Context} from "../Layout";
import UpdateComment from "./UpdateComment";


function Comment(props) {
    const {postId, refresh, comment} = props;
    const {setToaster} = useContext(Context);
    const user = getUser();

    const MoreToggleIcon =  React.forwardRef(({ onClick }, ref) => (
        <Link
            to="#"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}>
            <MoreOutlined />
        </Link>
    ));
    const handleDelete = (event) => {
        event.preventDefault();
        axiosService
            .delete(`/posts/${postId}/comments/${comment.id}/`)
            .then(res => {
                setToaster({
                    title: "Comment deleted",
                    show: true,
                    message: "Comment deleted successfully 🗑️ ",
                    type: "danger",
                });
                refresh();
            })
            .catch((e) => {
                setToaster({
                    title: "Error!",
                    show: true,
                    message: "An error occurred.",
                    type: "danger",
                });
            });
    };


    function handleLikeClick(action) {
        axiosService
            .post(`/posts/${postId}/comments/${comment.id}/${action}/`)
            .then(res => {
                refresh();
            })
            .catch(error => {console.log(error)});
    }

    return (
        <Card className="rounded-3 my-2" data-testid="comment-test">
            <Card.Body>
                <Card.Title className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                        <Image
                            src={comment.author.avatar}
                            roundedCircle
                            width={48}
                            height={48}
                            className="me-2 border border-primary border-2"
                        />
                        <div className="d-flex flex-column justify-content-start align-self-center mt-2">
                            <p className="fs-6 m-0">{comment.author.name}</p>
                            <p className="fs-6 fw-lighter">
                                <small>{format(comment.created)}</small>
                            </p>
                        </div>
                    </div>
                    {user.id === comment.author.id && (<div>
                        <Dropdown>
                            <Dropdown.Toggle as={MoreToggleIcon}></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <UpdateComment postId={postId} refresh={refresh} comment={comment}/>
                                <Dropdown.Item onClick={handleDelete} className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>)}
                </Card.Title>
                <Card.Text>{comment.body}</Card.Text>
                <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                        <LikeFilled
                            style={{
                                color: "#fff",
                                backgroundColor: "#0D6EFD",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                fontSize: "75%",
                                padding: "2px",
                                margin: "3px",
                            }}
                        />
                        <p className="ms-1 fs-6">
                            <small>{comment.likes_count} like</small>
                        </p>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between bg-white w-50 border-0">
                <div className="d-flex flex-row">
                    <LikeOutlined
                        style={{
                            width: "24px",
                            height: "24px",
                            padding: "2px",
                            fontSize: "20px",
                            color: comment.liked ? "#0D6EFD" : "#C4C4C4",
                        }}
                        onClick={() => {
                            if (comment.liked) {
                                handleLikeClick("remove_like");
                            } else {
                                handleLikeClick("like");
                            }
                        }}
                    />
                    <p className="ms-1"><small>Like</small></p>
                </div>
            </Card.Footer>
        </Card>
    );
}

export default Comment;