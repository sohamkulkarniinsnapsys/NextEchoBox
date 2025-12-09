// tests/__mocks__/mockUserModel.ts

const mockUser = {
  username: "john",
  isAcceptingMessages: true,
  messages: [],
  save: jest.fn().mockResolvedValue(true),
};

const UserModel = {
  __mockUser: mockUser,

  findOne: jest.fn(() => ({
    exec: jest.fn().mockResolvedValue(mockUser),
  })),
};

export default UserModel;
