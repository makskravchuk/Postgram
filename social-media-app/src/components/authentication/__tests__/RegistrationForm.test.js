import {render, screen} from "../../../helpers/test-utils"
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";
import '@testing-library/jest-dom';
import React from "react";
import { faker } from "@faker-js/faker";
import userFixtures from "../../../helpers/fixtures/user";
import RegistrationForm from "../RegistrationForm";

const userData = userFixtures();


test("testing RegistrationForm component", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const registrationForm = screen.getByTestId("registration-form");
    expect(registrationForm).toBeInTheDocument();

    const firstNameField = screen.getByTestId("first-name-field");
    expect(firstNameField).toBeInTheDocument();

    const lastNameField = screen.getByTestId("last-name-field");
    expect(lastNameField).toBeInTheDocument();

    const emailAddressField = screen.getByTestId("email-field");
    expect(emailAddressField).toBeInTheDocument();

    const usernameField = screen.getByTestId("username-field");
    expect(usernameField).toBeInTheDocument();

    const passwordField = screen.getByTestId("password-field");
    expect(passwordField).toBeInTheDocument();

    const bioField = screen.getByTestId("bio-field");
    expect(bioField).toBeInTheDocument();

    const password = faker.lorem.slug(2);
    await user.type(usernameField, userData.username);
    await user.type(firstNameField, userData.first_name);
    await user.type(lastNameField, userData.last_name);
    await user.type(emailAddressField, userData.email);
    await user.type(bioField, userData.bio);
    await user.type(passwordField, password);

    expect(usernameField.value).toBe(userData.username);
    expect(passwordField.value).toBe(password);
    expect(firstNameField.value).toBe(userData.first_name);
    expect(lastNameField.value).toBe(userData.last_name);
    expect(emailAddressField.value).toBe(userData.email);
    expect(bioField.value).toBe(userData.bio);
}, 10000);