import React, { Component } from "react";
import { NContext } from "../utils/types";

/**
 * HOC comonent can be used to redirect user
 * to desire route based on authentication
 */

function withAuth(WrappedComponent: any) {
  return class Authenticated extends Component {
    static getInitialProps = (ctx: NContext) => {
      /**
       * If cookie not available redirect back to login
       */
      const cookies = ctx?.req?.cookies;

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

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withAuth;
