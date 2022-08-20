import { NextPageContext } from "next";
import React, { Component } from "react";

/**
 * This HOC can be used to redirect user
 * to desire route based on authentication or any
 * special case
 */

const withAuth = (WrappedComponent: Component) => class extends Component {
  static getInitialProps = (ctx: NextPageContext) => {
    /**
       * If cookie not available redirect back to login
       */
    if (!ctx.req?.cookies?.token && ctx.res) {
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

export default withAuth;
