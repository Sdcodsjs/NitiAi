import { Router, type IRouter } from "express";
import healthRouter from "./health";
import policyRouter from "./policy/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/policy", policyRouter);

export default router;
