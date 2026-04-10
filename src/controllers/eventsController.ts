import { Request, Response } from "express";
import { Types } from "mongoose";
import { Event } from "../models/Event";
import { User } from "../models/User";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const { title, notes, start, end } = req.body;

    const event = new Event({
      title,
      notes,
      start,
      end,
      user: req.uid, // Asumiendo que el middleware de autenticación agrega el userId al objeto req
    });
    await event.save();
    return res.status(201).json({ event });
  } catch (error) {
    console.error("Error al crear el evento:", error);
    return res.status(500).json({ message: "Error al crear el evento" });
  }
};

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate("user", "name");
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    return res.status(500).json({ message: "Error al obtener los eventos" });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
    //*obtenemos la id y el uuid del usuario autenticado
    const { id } = req.params;
    const uid = req.uid;
    //*obtenemos los datos a actualizar del body*/
    const { title, notes, start, end } = req.body;

    //*validamos que la id sea válida y que el evento exista*/
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "ID es requerido y debe ser un string válido",
      });
    }
    //*validamos que el id sea un ObjectId válido*/
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de evento no válido" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (event.user.toString() !== uid) {
      return res
        .status(403)
        .json({ message: "No autorizado para actualizar este evento" });
    }
    //*actualizamos el evento con los nuevos datos*/

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, notes, start, end },
      { returnDocument: "after", runValidators: true }, //opción para retornar el documento actualizado
    ).populate("user", "name");
    return res.status(200).json({ event: updatedEvent });
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    return res.status(500).json({ message: "Error al actualizar el evento" });
  }
};

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uid = req.uid;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID inválido" });
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de evento no válido" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(400).json({
        message: "evento no encontrado ",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(403).json({
        message: "no autorizado para eliminar este evento",
      });
    }

    const eventDelete = await Event.findByIdAndDelete(id);
    return res.status(200).json({ event: eventDelete });
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    return res.status(500).json({ message: "Error al eliminar el evento" });
  }
};
