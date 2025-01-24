import React from 'react';
import '@testing-library/jest-dom'
import userFixtures from "../../../helpers/fixtures/user";
import {setUserData} from "../../../hooks/user.actions";
import {render, screen} from "../../../helpers/test-utils";
import ProfileDetails from "../ProfileDetails";


const userData = userFixtures();

beforeEach(()=>{
    localStorage.clear();
    jest.clearAllMocks();

    setUserData({
        user: userData,
        access: null,
        refresh: undefined,
    });
});

test("Render ProfileDetail component", () => {
    render(<ProfileDetails user={userData}/>);

    const profileDetailsElement = screen.getByTestId("profile-details");
    expect(profileDetailsElement).toBeInTheDocument();

    const nameElement = screen.getByText(userData.name);
    expect(nameElement).toBeInTheDocument();

    const bioElement = screen.getByText(userData.bio);
    expect(bioElement).toBeInTheDocument();
});