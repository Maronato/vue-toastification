import PROPS from "@/ts/propValidators";

describe("CONTAINER props", () => {
  it("default CONTAINER.container is document.body", () => {
    expect(PROPS.CONTAINER.container.default()).toBe(document.body);
  });
});
