export const tokensStub = () => ({
   accessToken: "accessToken",
   refreshToken: "refreshToken"
});

export const accessTokenStub = () => ({
   accessToken: "accessToken"
});

export const createUserStub = () => ({
   email: "email",
   password: "password",
   username: "username",
   firstName: "firstName",
   lastName: "lastName"
});

export const signInUserStub = () => ({
   email: "email",
   password: "password"
});

export const userPayloadStub = () => ({
   sub: "sub",
   username: "username",
   first_name: "first_name",
   last_name: "last_name",
   email: "email",
   email_verified: false
});

export const refreshPayloadSetNewStub = () => ({
   ...userPayloadStub(),
   refresh_token: "refresh_token",
   exp: (new Date().getTime() / 1000) | 0
});

export const refreshPayloadStub = () => ({
   ...userPayloadStub(),
   refresh_token: "refresh_token",
   exp: ((new Date().getTime() / 1000) | 0) + 60 * 60 * 24 * 8
});
