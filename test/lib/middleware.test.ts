import {
  cookieRedirect,
  setCookieSubmissionSession,
} from "../../src/lib/middleware";
import { formSubmissionCookieId } from "../../src/lib/types";

jest.mock("uuid", () => ({
  v4: () => "1",
}));

describe("Middleware Functions", () => {
  describe("cookeRedirect", () => {
    let context;
    let writeHeadFunction;
    let endFunction;

    beforeEach(() => {
      writeHeadFunction = jest.fn();
      endFunction = jest.fn();

      context = {
        res: {
          writeHead: writeHeadFunction,
        },
        req: { cookies: {} },
      };

      context.res.writeHead.mockReturnValueOnce({ end: endFunction });
    });

    const assertRedirected = () => {
      cookieRedirect(context);

      expect(writeHeadFunction).toHaveBeenCalledWith(307, {
        Location: "/",
      });
      expect(endFunction).toHaveBeenCalledTimes(1);
    };

    const assertNotRedirected = () => {
      cookieRedirect(context);

      expect(writeHeadFunction).not.toHaveBeenCalled();
      expect(endFunction).not.toHaveBeenCalled();
    };

    it("should redirect if there are no cookies", () => {
      assertRedirected();
    });

    it("should not redirect if the cookie id is set ", () => {
      context.req.cookies = { [formSubmissionCookieId]: "1" };

      assertNotRedirected();
    });

    it("should redirect if the cookie session id is not set", () => {
      context.req.cookies = { "beacons-session": "1" };

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to null", () => {
      context.req.cookies = { [formSubmissionCookieId]: null };

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to undefined", () => {
      context.req.cookies = { [formSubmissionCookieId]: void 0 };

      assertRedirected();
    });
  });

  describe("setCookieSession", () => {
    let context;

    beforeEach(() => {
      context = {
        res: {
          setHeader: jest.fn(),
        },
        req: { cookies: {} },
      };
    });

    const assertCookieSet = () => {
      setCookieSubmissionSession(context);

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        "submissionId=1; Path=/; HttpOnly; SameSite=Strict"
      );
    };

    it("should set the form submission cookie header if there are no cookies", () => {
      assertCookieSet();
    });

    it("should set the form submission cookie value if it is null", () => {
      context.req.cookies = { [formSubmissionCookieId]: null };
      assertCookieSet();
    });

    it("should set the form submission cookie value if it is undefined", () => {
      context.req.cookies = { [formSubmissionCookieId]: void 0 };
      assertCookieSet();
    });

    it("should not set the form submission cookie header if one is set", () => {
      context.req.cookies = { [formSubmissionCookieId]: "2" };

      expect(context.res.setHeader).not.toHaveBeenCalled();
    });
  });
});
