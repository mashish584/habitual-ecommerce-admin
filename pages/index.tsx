import { NextPageContext } from "next";

const Index = () => null;

export async function getServerSideProps(context: NextPageContext) {
  if (context.res) {
    // avoid HTML caching
    context.res.setHeader("Cache-Control", "no-store");
    context.res.writeHead(301, {
      Location: "/admin/",
    });
    context.res.end();
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Index;
