import axios from 'axios';
import {expect} from 'chai';
import {AUTH_TOKEN} from '../config.js';

const BASE_URL = 'https://gorest.co.in/public/v2/users';

let headers = {Authorization: AUTH_TOKEN}
let userId;

let data = {
  name: 'John Doe',
  email: 'johndoe@tantrum.com',
  gender: 'male',
  status: 'active'
}

let updateData = {
  name: 'Jane Doe',
  gender: "male"
}

describe('API_Automation_Testing', () => {
  // Creeate User
  before('Create_User', async () => {
    const response = await axios.post(BASE_URL, data, {headers});

    expect(response.status).equal(201);
    expect(response.data).to.property('id');
    userId = response.data.id;
  });

  // Get User Detail
  it('Get_User_Detail', async () => {
    const response = await axios.get(`${BASE_URL}/${userId}`, {headers});
    expect(response.status).equal(200);
    expect(response.data.name).equal(data.name);
  });

  // Update User
  it('Update_User', async () => {
    const response = await axios.put(`${BASE_URL}/${userId}`, updateData, {headers});

    expect(response.status).equal(200);
    expect(response.data.name).equal(updateData.name);
    expect(response.data.gender).equal(updateData.gender);
  });

  // Delete User
  it('Delete_User', async () => {
    const response = await axios.delete(`${BASE_URL}/${userId}`, {headers});
    expect(response.status).equal(204);
  });

  // Get User Negative
  it('Get_User_Negative', async () => {
    try {
      await axios.get(`${BASE_URL}/${userId}`, {headers});
    } catch (error) {
      expect(error.response.status).equal(404);
    }
  });
});

