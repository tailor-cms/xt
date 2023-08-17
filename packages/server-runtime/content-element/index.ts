import express from "express";

import { emitter } from "../common/emitter";
import ContentElement from "./model";
import initController from "./controller";

function initRouter({ type, initState, hookMap }) {
  const { get, create, patch } = initController({ type, initState, hookMap });

  const router = express.Router();
  router.param("id", getContentElement);

  router.route("/")
    .get(get)
    .post(create)

  router.route("/:id")
    .patch(patch);

  return router;
}

async function getContentElement(req, _res, next, id) {
  try {
    const element = await ContentElement.findByPk(id);
    if (!element) {
      return next(new Error("Failed to find the element"));
    }
    req.element = element;
    return next();
  } catch (error) {
    next(error);
  }
}

function pushChanges(conn) {
  emitter.on("element:update", (el) => conn.send(JSON.stringify(el)));
}

export default {
  path: "/content-element",
  initRouter,
  pushChanges,
}
