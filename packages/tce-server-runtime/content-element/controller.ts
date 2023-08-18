import { getTceConfig } from "../common/config";
import initHooks from "./hooks";
import ContentElement from "./model";

export default ({ type, initState, hookMap }) => {
  const { applyFetchHooks } = initHooks(hookMap);

  async function get(_req, res) {
    const defaults = { type, data: initState() };
    const [element] = await ContentElement.findOrCreate({
      where: { type: defaults.type },
      defaults
    });
    res.json(await applyFetchHooks(element, getTceConfig(process.env)));
  }

  async function create(req, res) {
    const element = await ContentElement.create(req.body);
    res.json(element);
  }

  async function patch(req, res) {
    const element = await req.element.update({ data: req.body.data });
    res.json(element);
  }

  return { get, create, patch }
};
