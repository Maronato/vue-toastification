import PROPS from "../../../src/ts/propValidators";

describe("CONTAINER props", () => {
  it.skip("default CONTAINER.container is document.body", () => {
    // TODO: fix typescript error
    // Property 'default' does not exist on type 'PropValidator<HTMLElement>'.
    // Property 'default' does not exist on type 'new (...args: string[]) => Function'.
    //
    // expect(PROPS.CONTAINER.container.default()).toBe(document.body);
  });
});
