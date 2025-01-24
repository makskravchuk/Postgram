import React from 'react';
import Layout from "../components/Layout";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import {fetcher} from "../helpers/axios";
import {Col, Row} from "react-bootstrap";
import Post from "../components/posts/Post";
import CreateComment from "../components/comments/CreatComment";
import Comment from "../components/comments/Comment";


function SinglePost(props) {
    const {postId} = useParams();
    const post = useSWR(`/posts/${postId}/`, fetcher);
    const comments = useSWR(`/posts/${postId}/comments/`, fetcher);
    return (<Layout hasNavigationBack>
        {post.data ? (
            <Row className="justify-content-center">
                <Col sm={8}>
                    <Post post={post.data} refresh={post.mutate} isSinglePost/>
                    <CreateComment postId={postId} refresh={comments.mutate} />
                    {comments.data?.results.map((comment) => (
                        <Comment key={comment.id} postId={postId} comment={comment}  refresh={comments.mutate}/>
                    ))}
                </Col>
            </Row>
        ) : (
            <div>Loading...</div>
        )}

    </Layout>);
}

export default SinglePost;