# Habitual E-commerce Portal

Web platform to manage mobile application data. Currently application include CRUD operations for all sort of sections & features like order tracking, notifications & product color variants,etc. in. loop ([Platform Video](https://www.linkedin.com/posts/mehraas_react-next-prisma-activity-6967148201787174912-tLr3?utm_source=share&utm_medium=member_desktop)):

#### Figma Designs: [View](https://www.figma.com/file/QNX7J2J2gX7yDn40i0Wboa/Habitual-Ecommerce?node-id=579%3A7978)

## How to run application?

#### Node version used application is 16.13.1

#### Steps:

- Install all the dependencides, Run `yarn`.
- Create `.env` file

```
DATABASE_URL=""
JWT_SECRET=""
IMAGEKIT_PUBLIC=""
IMAGEKIT_PRIVATE=""
STRIPE_PUB_KEY=""
STRIPE_SECRET_KEY=""

- `DATABASE_URL` database native connection string format. [Supported Prisma DB's list](https://www.prisma.io/docs/reference/database-reference/supported-databases))
- `JWT_SECRET` add randome string
-  Add`IMAGEKIT_PUBLIC` & `IMAGEKIT_PUBLIC` api key. Using [imagekit](https://imagekit.io/?utm_source=google&utm_medium=cpc&utm_campaign=Brandnameads-india&utm_term=imagekit&utm_campaign=Brand+Name+Ads&utm_source=adwords&utm_medium=ppc&hsa_acc=2507416747&hsa_cam=1407280992&hsa_grp=60918468128&hsa_ad=269886892782&hsa_src=g&hsa_tgt=kwd-640296395432&hsa_kw=imagekit&hsa_mt=e&hsa_net=adwords&hsa_ver=3) for delivering optimized images.
-  Add `STRIPE_PUB_KEY` & `STRIPE_SECRET_KEY` api key.

```

- Run `npx prisma db push` to setup prisma environment.
- Run `yarn dev` to run project.
