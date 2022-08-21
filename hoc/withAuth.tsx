import React from "react";
import { NContext } from "../utils/types";

/**
 * This sort of HOC comonent (returning the passed component as it is) can be used to redirect user
 * to desire route based on authentication
 */

function withAuth(WrappedComponent: React.ComponentType) {
  return WrappedComponent;
}

withAuth.getInitialProps = (ctx: NContext) => {
  /**
   * If cookie not available redirect back to login
   */
  const cookies = ctx.req.cookies;
  if (!cookies?.token && ctx.res) {
    // avoid HTML caching
    ctx.res.setHeader("Cache-Control", "no-store");
    ctx.res.writeHead(301, {
      Location: "/admin/login/",
    });
    ctx.res.end();
  }

  return {};
};

export default withAuth;
