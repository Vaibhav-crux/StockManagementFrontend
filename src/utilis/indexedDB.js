import { openDB } from "idb";

// Initialize the database
const dbPromise = openDB("cartDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("cart")) {
      db.createObjectStore("cart", { keyPath: "id" });
    }
  },
});

// Add item to IndexedDB
export const addItemToDB = async (item) => {
  const db = await dbPromise;
  const tx = db.transaction("cart", "readwrite");
  await tx.store.put(item);
  await tx.done;
};

// Get all items from IndexedDB
export const getCartFromDB = async () => {
  const db = await dbPromise;
  return db.getAll("cart");
};

// Update item quantity in IndexedDB
export const updateItemQuantityInDB = async (id, quantity) => {
  const db = await dbPromise;
  const item = await db.get("cart", id);
  if (item) {
    item.quantity = quantity;
    await addItemToDB(item);
  }
};

// Remove item from IndexedDB
export const removeItemFromDB = async (id) => {
  const db = await dbPromise;
  const tx = db.transaction("cart", "readwrite");
  await tx.store.delete(id);
  await tx.done;
};

// Clear all items from IndexedDB
export const clearCartDB = async () => {
  const db = await dbPromise;
  const tx = db.transaction("cart", "readwrite");
  await tx.store.clear();
  await tx.done;
};
