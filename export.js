
async function exportarDatos() {
  console.log("🔁 Ejecutando exportarDatos");
  const request = indexedDB.open("modulo4PWA", 1);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("registros")) {
      db.createObjectStore("registros", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("registros")) {
      alert("❌ Base de datos sin registros disponibles.");
      return;
    }

    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      const datos = getAll.result;
      if (!datos || datos.length === 0) {
        alert("⚠ No hay registros para exportar.");
        return;
      }

      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modulo4_registros.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    getAll.onerror = () => alert("❌ Error al leer los registros");
  };

  request.onerror = () => alert("❌ No se pudo abrir la base de datos");
}

window.exportarDatos = exportarDatos;
