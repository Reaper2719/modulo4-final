
const DB_NAME = "modulo4DB";
const DB_VERSION = 1;
const STORE_NAME = "registros";

function resetDatabase() {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    deleteRequest.onsuccess = () => {
      console.log("🧹 DB eliminada correctamente");
      resolve();
    };
    deleteRequest.onerror = () => {
      console.error("❌ Error al eliminar la DB");
      reject(deleteRequest.error);
    };
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.warn("⚠ Store no existe, reseteando DB...");
        resetDatabase().then(() => openDB().then(resolve));
      } else {
        resolve(db);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

async function guardarRegistro(data) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add(data);
  return tx.complete;
}

window.guardarRegistro = guardarRegistro;
