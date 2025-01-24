import {render, screen} from "../../../helpers/test-utils";
import React from "react";
import '@testing-library/jest-dom';
import userFixtures from "../../../helpers/fixtures/user";
import commentFixtures from "../../../helpers/fixtures/comment";
import {setUserData} from "../../../hooks/user.actions";
import Comment from "../Comment";


const useData = userFixtures();
const commentData = commentFixtures(true, false, useData);

beforeEach(()=>{
    localStorage.clear();
    jest.clearAllMocks();

    setUserData({
        user: useData,
        access: null,
        refresh: null,
    });
});

test("testing Comment component", () => {
    render(<Comment comment={commentData}/>);
    const commentElement = screen.getByTestId("comment-test");
    expect(commentElement).toBeInTheDocument();
});