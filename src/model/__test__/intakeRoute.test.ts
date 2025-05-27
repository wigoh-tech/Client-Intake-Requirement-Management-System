// __tests__/api/intakeRoute.test.ts

import { POST, GET } from "@/app/api/intake/route";
import { prisma } from "@/lib/db";
import logger from "@/app/api/utils/logger";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  prisma: {
    intakeAnswer: {
      createMany: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    requirement: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    requirementVersion: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    client: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/app/api/utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
jest.mock("@clerk/nextjs/server");

describe("API Route: /api/intake", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST method", () => {
    // Test if clientId is missing
    it("should return 400 if clientId is missing", async () => {
      const mockReq = {
        headers: new Headers(),
        json: async () => ({ answers: [] }),
      } as unknown as NextRequest;

      const res = await POST(mockReq);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe("Client ID is required");
    });

    // Test if question 14 is missing
    it("should return 400 if question 14 is missing", async () => {
      const mockReq = {
        headers: new Headers(),
        json: async () => ({
          clientId: "123QAZ",
          answers: [{ questionId: 1, answer: "X" }],
        }),
      } as unknown as NextRequest;

      (getAuth as jest.Mock).mockReturnValue({ userId: "clerk123" });
      (currentUser as jest.Mock).mockResolvedValue({
        username: "testuser",
        id: "clerk123",
      });

      const res = await POST(mockReq);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe("Answer for question 14 is required");
    });

    it("should create answers and requirement if all valid", async () => {
      const mockAnswers = [
        { questionId: 1, answer: "A1" },
        { questionId: 14, answer: "Special answer" },
      ];

      const mockReq = {
        method: "POST",
        headers: new Headers(),
        json: async () => ({
          answers: mockAnswers,
          clientId: "123QAZ",
        }),
      } as unknown as NextRequest;

      (getAuth as jest.Mock).mockReturnValue({ userId: "user123" });
      (currentUser as jest.Mock).mockResolvedValue({
        username: "devUser",
        id: "user123",
      });

      (prisma.requirement.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.requirementVersion.findMany as jest.Mock).mockResolvedValue([]);

      const res = await POST(mockReq);
      const body = await res.json();

      expect(prisma.intakeAnswer.createMany).toHaveBeenCalledWith({
        data: expect.any(Array),
      });
      expect(prisma.requirement.create).toHaveBeenCalled();
      expect(prisma.requirementVersion.create).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(body.message).toBe(
        "Answers submitted and version created successfully"
      );
    });
  });

  describe("GET method", () => {
    // Missing clientId
    it("should return 400 if clientId is missing", async () => {
      const mockUrl = new URL("http://localhost/api/intake");

      const mockReq = {
        nextUrl: mockUrl,
      } as unknown as NextRequest;

      const res = await GET(mockReq);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe("Missing clientId");
    });
    // Client not found
    it("should return 404 if client not found", async () => {
      const mockUrl = new URL("http://localhost/api/intake?clientId=123");

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      const mockReq = {
        nextUrl: mockUrl,
      } as unknown as NextRequest;

      const res = await GET(mockReq);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.message).toBe("Client not found for provided clientId");
    });
    // Valid GET response
    it("should return answers if found", async () => {
      const mockUrl = new URL("http://localhost/api/intake?clientId=123QAZ");

      (prisma.client.findUnique as jest.Mock).mockResolvedValue({
        id: "123QAZ",
      });
      (prisma.intakeAnswer.findFirst as jest.Mock).mockResolvedValue({
        timestamp: "2024-05-01T00:00:00.000Z",
      });
      (prisma.intakeAnswer.findMany as jest.Mock).mockResolvedValue([
        { questionId: 1, answer: "Answer 1" },
        { questionId: 14, answer: "Answer 14" },
      ]);

      const mockReq = {
        nextUrl: mockUrl,
      } as unknown as NextRequest;

      const res = await GET(mockReq);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.clientId).toBe("123QAZ");
      expect(body.answers.length).toBeGreaterThan(0);
    });
  });
});
