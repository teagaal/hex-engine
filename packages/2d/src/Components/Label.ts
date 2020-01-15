import { useType } from "@hex-engine/core";
import { useUpdate } from "../Canvas";
import { FontImplementation } from "./Font";
import { Point } from "../Models";
import { useInspectorHoverOutline } from "../Hooks";

export default function Label({
  text = "",
  font,
}: {
  text?: string;
  font: FontImplementation;
}) {
  useType(Label);

  const state = {
    text,
  };

  const size = new Point(0, 0);
  useInspectorHoverOutline(size);

  function updateSize() {
    const metrics = font.measureText(state.text);
    size.x = metrics.width;
    size.y = metrics.height + metrics.descender;
  }

  updateSize();
  useUpdate(updateSize);

  return {
    size,
    draw(
      context: CanvasRenderingContext2D,
      {
        x = 0,
        y = 0,
      }: {
        x?: number | undefined;
        y?: number | undefined;
      } = {}
    ) {
      if (!font.readyToDraw()) return;
      font.drawText(context, state.text, { x, y });
    },
    get text() {
      return state.text;
    },
    set text(nextValue) {
      state.text = nextValue;
      updateSize();
    },
  };
}
