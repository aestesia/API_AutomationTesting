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

let dataInvalidEmail = {
  name: 'John Doe',
  email: 'test',
  gender: 'male',
  status: 'active'
}

let dataInvalidGender = {
  name: 'John Doe',
  email: 'johndoe@tantrum.com',
  gender: 'test',
  status: 'active'
}

let updateData = {
  name: 'Jane Doe',
  email: 'janeDoe@tantrum.com',
  gender: "male"
}

let dataEmpty = {
  name: '',
  email: '',
  gender: '',
  status: ''
}

describe('API_Automation_Testing', () => {
  //Negative - Create User - Fields Empty
  it('Negative - Create User - Fields Empty', async () => {
    try{
      const response = await axios.post(BASE_URL, dataEmpty, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("email");
      expect(response.data[0].message).equal("can't be blank");
      expect(response.data[1].field).equal("name");
      expect(response.data[1].message).equal("can't be blank");
      expect(response.data[2].field).equal("gender");
      expect(response.data[2].message).equal("can't be blank, can be male of female");
      expect(response.data[3].field).equal("status");
      expect(response.data[3].message).equal("can't be blank");
    }
  });
  
  // Negative - Create User - invalid email
  it('Negative - Create User - invalid email', async () => {
    try{
      const response = await axios.post(BASE_URL, dataInvalidEmail, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("email");
      expect(response.data[0].message).equal("is invalid");
    }
  });

  // Negative - Create User - Gender
  it('Negative - Create User - Gender', async () => {
    try{
      const response = await axios.post(BASE_URL, dataInvalidGender, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("gender");
      expect(response.data[0].message).equal("can't be blank, can be male of female");
    }
  });
  
  // Positive - Create User
  it('Positive - Create User', async () => {
    const response = await axios.post(BASE_URL, data, {headers});

    expect(response.status).equal(201);
    expect(response.data).to.property('id');
    context.userId = response.data.id;
  });

  // Negative - Create User - Email already exist
  it('Negative - Create User - Email already exist', async () => {
    try{
      await axios.post(BASE_URL, data, {headers});
      throw new Error('Expected request to fail with 422');
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("email");
      expect(response.data[0].message).equal("has already been taken");}
  });

  // Positive - Get User Detail
  it('Positive - Get User Detail', async () => {
    const response = await axios.get(`${BASE_URL}/${context.userId}`, {headers});
    expect(response.status).equal(200);
    expect(response.data.name).equal(data.name);
  });

  // Positive - Update User
  it('Positive - Update User', async () => {
    const response = await axios.put(`${BASE_URL}/${context.userId}`, updateData, {headers});

    expect(response.status).equal(200);
    expect(response.data.name).equal(updateData.name);
    expect(response.data.email).equal(updateData.email);
    expect(response.data.gender).equal(updateData.gender);
  });

  // Negative - Update User - fields blank
  it('Negative - Update User - fields blank blank', async () => {
    try{
      const response = await axios.put(`${BASE_URL}/${context.userId}`, dataEmpty, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("email");
      expect(response.data[0].message).equal("can't be blank");
      expect(response.data[1].field).equal("name");
      expect(response.data[1].message).equal("can't be blank");
      expect(response.data[2].field).equal("gender");
      expect(response.data[2].message).equal("can't be blank, can be male of female");
      expect(response.data[3].field).equal("status");
      expect(response.data[3].message).equal("can't be blank");
    }
  });

  // Negative - Update User - invalid email
  it('Negative - Update User - invalid email', async () => {
    try{
      const response = await axios.put(`${BASE_URL}/${context.userId}`, {email: 'test'}, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("email");
      expect(response.data[0].message).equal("is invalid");
    }
  });

  // Negative - Update User - Gender
  it('Negative - Update User - Gender', async () => {
    try{
      const response = await axios.put(`${BASE_URL}/${context.userId}`, {gender: 'test'}, {headers});
    }catch (error){
      const {response} = error;
      expect(response.status).equal(422);
      expect(response.data[0].field).equal("gender");
      expect(response.data[0].message).equal("can't be blank, can be male of female");
    }
  });

  // Positive - Delete User
  it('Positive - Delete User', async () => {
    const response = await axios.delete(`${BASE_URL}/${context.userId}`, {headers});
    expect(response.status).equal(204);
  });

  // Negative - Get User Negative - empty
  it('Negative - Get User Negative - empty', async () => {
    try {
      await axios.get(`${BASE_URL}/${context.userId}`, {headers});
    } catch (error) {
      expect(error.response.status).equal(404);
    }
  });
});

