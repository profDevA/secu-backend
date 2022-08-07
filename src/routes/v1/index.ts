import express, { Router } from "express";
import customerRoute from "./customer.routes";
import fundRoute from "./fund.routes";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: "/customers",
    route: customerRoute,
  },
  {
    path: "/funds",
    route: fundRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
