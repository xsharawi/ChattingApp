import '../config.js';
import dataSource, { initDB } from '../dist/db/dataSource.js';
import { login } from "../dist/controllers/user.js";
import jwt from 'jsonwebtoken';

beforeAll(async () => {
  await initDB();
});

afterAll(async () => {
  await dataSource.destroy();
});

const tmpData = {
  "email": "mohammad123@gmail.com",
  "password": "1234567"
};

describe("Login process", () => {
  let token;
  beforeAll(async () => {
    opp = await login(tmpData.email, tmpData.password);
  })

  it("returns a token", async () => {
    expect(opp.token).toBeTruthy();
  });

  it("has a valid token", () => {
    const tokenIsValid = jwt.verify(opp.token, process.env.SECRET_KEY || '');
    expect(tokenIsValid).toBeTruthy();
  });

  it("has valid payload", () => {
    const payload = jwt.decode(opp.token, { json: true });
    expect(payload?.email).toEqual(tmpData.email);
  });
});

