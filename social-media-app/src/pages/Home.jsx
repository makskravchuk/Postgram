import React from "react";
import Layout from "../components/Layout";
import CreatePost from "../components/posts/CreatePost";
import {Col, Image, Row} from "react-bootstrap";
import useSWR from "swr";
import {fetcher} from "../helpers/axios";
import Post from "../components/posts/Post";
import ProfileCard from "../components/profile/ProfileCard";
import {getUser} from "../hooks/user.actions";

function Home(){
    const posts = useSWR("/posts/", fetcher, {refreshInterval: 10000})
    const profiles = useSWR("/users/?limit=5", fetcher)
    const user = getUser();

    return(
        <Layout>
            <Row  className="justify-content-evenly">
                <Col sm={7}>
                    <Row className="border rounded-4 align-items-center">
                        <Col className="flex-shrink-1">
                            <Image src={user.avatar} roundedCircle width={52} height={52} className="my-2"/>
                        </Col>
                        <Col sm={10} className="flex-grow-1">
                            <CreatePost refresh={posts.mutate}/>
                        </Col>
                    </Row>
                    <Row className="my-4">
                        {posts.data?.results.map((post, index) => (
                            <Post key={post.id} post={post} refresh={posts.mutate} isSinglePost={false}/>
                        ))}
                    </Row>
                </Col>
                <Col sm={3} className="border rounded py-4 h-50">
                    <h4 className="font-weight-bold text-center">Suggested people</h4>
                    <div className="d-flex flex-column">
                        {profiles.data?.results.map((profile, index) => (
                            <ProfileCard user={profile} key={profile.id}/>
                        ))}
                    </div>
                </Col>
            </Row>
        </Layout>
    );
}

export default Home;