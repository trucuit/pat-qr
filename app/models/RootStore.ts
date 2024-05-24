import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { HistoryModel } from "./History"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  historyStore: types.optional(HistoryModel, {
    data: [],
  })
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
