import React, {useContext} from 'react';
import {Image, Card, Dropdown } from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {CommentOutlined, LikeFilled, LikeOutlined, MoreOutlined} from "@ant-design/icons";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import {getUser} from "../../hooks/user.actions";
import UpdatePost from "./UpdatePost";
import {Context} from "../Layout";

function Post(props) {
    const {setToaster} = useContext(Context);
    const {post, refresh, isSinglePost} = props;
    const user = getUser();
    const handleLikeClick = (action) => {
        axiosService
            .post(`/posts/${post.id}/${action}/`)
            .then(res => {
                refresh();
            })
            .catch(err => {console.error(err)});
    };

    const handleDelete  = () => {
        axiosService
            .delete(`/posts/${post.id}/`)
            .then(res => {
                setToaster({
                    title: "Post deleted",
                    show: true,
                    message: "Post deleted 🗑️ ",
                    type: "danger",
                });
                refresh();
            })
            .catch(err => {
                setToaster({
                    title: "Post error",
                    show: true,
                    message: "An error occurred.",
                    type: "danger",
                });
            });
    };

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

    return (
        <>
        <Card className="rounded-3 my-4" data-testid="post-test">
            <Card.Body>
                <Card.Title className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                    <Image
                        src={post.author.avatar}
                        roundedCircle
                        width={48}
                        height={48}
                        className="me-2 border border-primary border-2"
                    />
                    <div className="d-flex flex-column justify-content-start align-self-center mt-2">
                        <p className="fs-6 m-0">{post.author.name}</p>
                        <p className="fs-6 fw-lighter">
                            <small>{format(post.created)}</small>
                        </p>
                    </div>
                    </div>
                    { user.id === post.author.id && (<div>
                        <Dropdown>
                            <Dropdown.Toggle as={MoreToggleIcon}></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <UpdatePost post={post} refresh={refresh} />
                                <Dropdown.Item onClick={handleDelete} className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>)}
                </Card.Title>
                <Card.Text>{post.body}</Card.Text>
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
                            <small>{post.likes_count} like</small>
                        </p>
                    </div>
                    {!isSinglePost && (
                        <p className="ms-1 fs-6">
                            <small>
                                <Link to={`/posts/${post.id}/`}>
                                    {post.comments_count} comments
                                </Link>
                            </small>
                        </p>
                    )}
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
                        color: post.liked ? "#0D6EFD" : "#C4C4C4",
                        }}
                        onClick={() => {
                            if (post.liked) {
                                handleLikeClick("remove_like");
                            }
                            else{
                                handleLikeClick("like");
                            }
                        }}
                    />
                    <p className="ms-1"><small>Like</small></p>
                </div>
                { !isSinglePost && (<div className="d-flex flex-row">
                    <CommentOutlined
                        style={{
                            width: "24px",
                            height: "24px",
                            padding: "2px",
                            fontSize: "20px",
                            color: "#C4C4C4",
                        }}/>
                    <p className="ms-1 mb-0">
                        <small>Comment</small>
                    </p>
                </div>)}
            </Card.Footer>
        </Card>
        </>
    );
}

export default Post;