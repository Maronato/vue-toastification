import PROPS from "../../../src/ts/propValidators"

describe("CONTAINER props", () => {
  it("default CONTAINER.container is document.body", () => {
    expect(
      (PROPS.CONTAINER.container as { default: () => void }).default()
    ).toBe(document.body)
  })
})
