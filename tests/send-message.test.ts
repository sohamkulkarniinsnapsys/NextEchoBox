import { POST } from "@/app/api/send-message/route";
import { createMockRequest } from "@/tests/__mocks__/mockNextRequest";
import UserModel from "./__mocks__/mockUserModel";
import dbConnect from "./__mocks__/mockDbConnect";
jest.mock("@/lib/dbConnect");
jest.mock("@/model/User");

describe("POST /api/send-message", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // INVALID JSON BODY
  it("should return 400 if JSON is invalid", async () => {
    const req = createMockRequest("POST", "INVALID_JSON"); // invalid JSON body

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.message).toBe("Invalid JSON body");
  });

  // MISSING / INVALID USERNAME
  it("should return 400 if username is missing", async () => {
    const req = createMockRequest("POST", { content: "Hello!" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Missing or invalid username");
  });

  it("should return 400 if username is not a string", async () => {
    const req = createMockRequest("POST", { username: 123, content: "Hello!" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
  });

  // MISSING / INVALID CONTENT
  it("should return 400 if content is missing", async () => {
    const req = createMockRequest("POST", { username: "john" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Message content cannot be empty");
  });

  it("should return 400 if content is empty string", async () => {
    const req = createMockRequest("POST", { username: "john", content: "   " });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Message content cannot be empty");
  });

  // USER NOT FOUND
  it("should return 404 if user not found", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const req = createMockRequest("POST", {
      username: "unknown",
      content: "Hello",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(UserModel.findOne).toHaveBeenCalledWith({ username: "unknown" });
    expect(res.status).toBe(404);
    expect(json.message).toBe("User not found");
  });

  // USER NOT ACCEPTING MESSAGES
  it("should return 403 if user is not accepting messages", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        isAcceptingMessages: false,
      }),
    });

    const req = createMockRequest("POST", {
      username: "john",
      content: "Hello!",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.message).toBe("User is not accepting messages");
  });

  // SUCCESSFUL MESSAGE SEND
  it("should return 201 on successful message send", async () => {
    const mockUser = UserModel.__mockUser;
    mockUser.messages = [];
    mockUser.isAcceptingMessages = true;

    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const req = createMockRequest("POST", {
      username: "john",
      content: "Hello world!",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(mockUser.messages.length).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.message).toBe("Message sent successfully");
  });

  // INTERNAL SERVER ERROR
  it("should return 500 if an unexpected error occurs", async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const req = createMockRequest("POST", {
      username: "john",
      content: "Test",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
  });
});
