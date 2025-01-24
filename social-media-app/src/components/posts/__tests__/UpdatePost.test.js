import React from 'react';
import '@testing-library/jest-dom';
import {render, screen} from "../../../helpers/test-utils";
import userFixtures from "../../../helpers/fixtures/user";
import postFixtures from "../../../helpers/fixtures/post";
import UpdatePost from "../UpdatePost";
import userEvent from "@testing-library/user-event";
import {fireEvent} from "@testing-library/react";
import {faker} from "@faker-js/faker";


const userData = userFixtures();
const postData = postFixtures(true, false, userData);

test("Render PostUpdate component", async () => {
    const user = userEvent.setup();
    render(<UpdatePost post={postData}/>);

    const showModalForm = screen.getByTestId("show-modal-form");
    expect(showModalForm).toBeInTheDocument();

    fireEvent.click(showModalForm);

    const updateFormElement = screen.getByTestId("update-post-form");
    expect(updateFormElement).toBeInTheDocument();

    const postBodyField = screen.getByTestId("post-body-field");
    expect(postBodyField).toBeInTheDocument();

    const submitButton = screen.getByTestId("update-post-submit");
    expect(submitButton).toBeInTheDocument();

    const postBody = faker.lorem.sentence(20);
    await user.type(postBodyField, postBody);

    expect(postBodyField.value).toBe(postData.body + postBody);
    expect(submitButton.disabled).toBeFalsy();
});