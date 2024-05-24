import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"


const HistoryItemModel = types.model("HistoryItem").props({
  data: types.string,
  timestamp: types.string,
  id: types.identifier,
})

/**
 * Model description here for TypeScript hints.
 */
export const HistoryModel = types
  .model("History")
  .props({
    data: types.optional(types.array(HistoryItemModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    restore() {
      self.data.replace([])
    },
    addHistory(data: string) {
      self.data.push({
        data,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substring(7),
      })
    },
    removeHistory(id: string) {
      if (!id) return
      self.data.replace(self.data.filter((item) => item.id !== id))
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface History extends Instance<typeof HistoryModel> { }
export interface HistoryItem extends Instance<typeof HistoryItemModel> { }
export interface HistorySnapshotOut extends SnapshotOut<typeof HistoryModel> { }
export interface HistorySnapshotIn extends SnapshotIn<typeof HistoryModel> { }
export const createHistoryDefaultModel = () => types.optional(HistoryModel, {})
