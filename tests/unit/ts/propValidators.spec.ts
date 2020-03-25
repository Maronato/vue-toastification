import PROPS from "../../../src/ts/propValidators";
import { PropOptions } from "vue/types/options";

describe("CONTAINER props", () => {
  it("default CONTAINER.container is document.body", () => {
    expect((PROPS.CONTAINER.container as PropOptions).default()).toBe(
      document.body
    );
  });
});
