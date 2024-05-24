import { HistoryModel } from "./History"

test("can be created", () => {
  const instance = HistoryModel.create({})

  expect(instance).toBeTruthy()
})
