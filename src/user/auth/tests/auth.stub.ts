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
   lastName: "lastName",
   bio: null,
   photoUrl: null
});

export const signInUserStub = () => ({
   email: "email",
   password: "password"
});

export const userPayloadStub = () => ({
   sub: "sub",
   username: "username",
   firstName: "first_name",
   lastName: "last_name",
   email: "email",
   emailVerified: false,
   photoUrl: null
});

export const refreshPayloadSetNewStub = () => ({
   ...userPayloadStub(),
   refreshToken: "refresh_token",
   exp: (new Date().getTime() / 1000) | 0
});

export const refreshPayloadStub = () => ({
   ...userPayloadStub(),
   refreshToken: "refresh_token",
   exp: ((new Date().getTime() / 1000) | 0) + 60 * 60 * 24 * 8
});
