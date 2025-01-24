import userFixtures from "../../../helpers/fixtures/user";
import postFixtures from "../../../helpers/fixtures/post";
import {setUserData} from "../../../hooks/user.actions";
import Post from "../Post";
import {render, screen} from "../../../helpers/test-utils";
import React from "react";
import '@testing-library/jest-dom';

const userData = userFixtures();
const postData = postFixtures(true, false, userData);


beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    setUserData({
        user: userData,
        access: null,
        refresh: null,
    });
});

test("render Post component", () =>{
    render(<Post post={postData}/>);
    const postElement = screen.getByTestId("post-test");
    expect(postElement).toBeInTheDocument();
});