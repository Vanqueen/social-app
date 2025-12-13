// app-state.types.ts

import type { UIState } from "./theme.type";
import type { UserState } from "./user.type";

export interface AppState {
  ui: UIState
  user: UserState
}
