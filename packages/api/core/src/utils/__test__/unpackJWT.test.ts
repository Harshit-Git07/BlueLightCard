import jwtDecode from "jwt-decode";
import { unpackJWT, JWT, Auth0Jwt } from "../unpackJWT";

jest.mock("jwt-decode");

const mockAuth0Token: Auth0Jwt = {
  sub: "auth0|123456",
  exp: 9999999999,
  iss: "https://example.com/",
  iat: 999999999,
  email: "user@example.com",
  memberUuid: "auth0-member-uuid",
  legacyUserId: 1234,
};

const mockStandardToken: JWT = {
  sub: "123456",
  exp: 9999999999,
  iss: "https://example.com/",
  iat: 999999999,
  email: "user@example.com",
  'custom:blc_old_uuid': "legacy-uuid",
  'custom:blc_old_id': "1234",
};

describe("unpackJWT", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly decode and transform an Auth0 token", () => {
    (jwtDecode as jest.Mock).mockReturnValue(mockAuth0Token);

    const result = unpackJWT("auth0TokenString");

    expect(result).toEqual({
      ...mockAuth0Token,
      'custom:blc_old_uuid': mockAuth0Token.memberUuid,
      'custom:blc_old_id': String(mockAuth0Token.legacyUserId),
    });
  });

  it("should correctly decode a standard JWT token", () => {
    (jwtDecode as jest.Mock).mockReturnValue(mockStandardToken);

    const result = unpackJWT("standardTokenString");

    expect(result).toEqual(mockStandardToken);
  });

  it("should throw an error if jwt_decode throws an error", () => {
    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => unpackJWT("invalidTokenString")).toThrow("Invalid token");
  });
});
