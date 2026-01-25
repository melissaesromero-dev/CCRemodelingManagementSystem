import { createContext } from "react";
import LoadingStore from "./loadingStore";

interface Store {
  loadingStore: LoadingStore;
}

export const store: Store = {
  loadingStore: new LoadingStore(),
};

export const StoreContext = createContext(store);
