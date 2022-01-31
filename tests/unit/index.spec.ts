import * as index from "../../src/index"
import { TYPE, POSITION } from "../../src/ts/constants"
import {
  createToastInstance,
  provideToast,
  useToast,
} from "../../src/ts/composables/useToast"
import { EventBus } from "../../src/ts/eventBus"
import { VueToastificationPlugin } from "../../src/ts/plugin"

describe("index", () => {
  describe("exports", () => {
    it("exports constants", () => {
      expect(index.TYPE).toBe(TYPE)
      expect(index.POSITION).toBe(POSITION)
    })
    it("exports classes", () => {
      expect(index.EventBus).toBe(EventBus)
    })
    it("exports functions", () => {
      expect(index.createToastInstance).toBe(createToastInstance)
      expect(index.provideToast).toBe(provideToast)
      expect(index.useToast).toBe(useToast)
    })
    it("exports default", () => {
      expect(index.default).toBe(VueToastificationPlugin)
    })
  })
})
