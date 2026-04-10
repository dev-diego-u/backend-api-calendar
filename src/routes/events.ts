//*raiz de ruta /api/events
import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT";
import {
  getEventsController,
  createEventController,
  updateEventController,
  deleteEventController,
} from "../controllers/eventsController";
import { eventValidate } from "../middlewares/validateFields";

const router = Router();

//validar todos los endpoints con JWT
router.use(validateJWT);
router.get("/", getEventsController);

router.post("/", [...eventValidate], createEventController);

router.put(
  "/:id",
  [
    /*...eventValidate */
  ],
  updateEventController,
);

router.delete("/:id", deleteEventController);

export default router;
