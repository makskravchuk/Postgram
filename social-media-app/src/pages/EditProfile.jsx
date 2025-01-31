import Layout from "../components/Layout";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import React from "react";
import {fetcher} from "../helpers/axios";
import {Col, Row} from "react-bootstrap";
import UpdateProfileForm from "../components/profile/UpdateProfileForm";


const EditProfile = () => {
    const {profileId} = useParams();
    const profile = useSWR(`/users/${profileId}/`, fetcher);
    return (
        <Layout hasNavigationBack>
            {profile.data? (
            <Row className="justify-content-evenly">
                <Col sm={9}><UpdateProfileForm profile={profile.data}/>
                </Col>
            </Row>
            ) : (<div>Loading...</div>
            )}
        </Layout>
    );
}

export default EditProfile;