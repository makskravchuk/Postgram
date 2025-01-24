import React from 'react';
import '@testing-library/jest-dom';
import TestRenderer from "react-test-renderer";
import ProfileCard from "../ProfileCard";
import { BrowserRouter } from "react-router-dom";


const userData = {
    id: "0590cd67-eacd-4299-8413-605bd547ea17",
    first_name: "FirstName",
    last_name: "LastName",
    name: "FirstName LastName",
    post_count: 3,
    email: "example@gmail.com",
    bio: "Example Bio",
    username: "username_1",
    avatar: null,
    created: "2025-01-19T17:31:03.310Z",
    updated: "2025-01-20T07:38:47.631Z",
};


test("Test ProfileCard snapshot", () => {
    const ProfileCardDomTree = TestRenderer.create(
        <BrowserRouter>
            <ProfileCard user={userData}/>
        </BrowserRouter>
    ).toJSON();

    expect(ProfileCardDomTree).toMatchSnapshot();
});