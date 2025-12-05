import React, { useEffect, useState, useCallback } from "react";
import { useModal } from "../context/ModalContext";
import debounce from "lodash.debounce";

import { getCombos, createCombo, updateCombo } from "../services/Combos";
import CombosTable from "./datatables/CombosTable";
import FormCombos from "./forms/FormCombos";

export default function ADMCombos() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showModal, closeModal } = useModal();

  const fetchCombos = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const list = await getCombos();
        setCombos(list);
      } finally {
        setLoading(false);
      }
    }, 200),
    []
  );

  useEffect(() => {
    fetchCombos();
    return () => fetchCombos.cancel();
  }, [fetchCombos]);

  const saveCombo = async (formData, editingId) => {
    alert("Asd");
            console.log(formData);

    try {
      if (editingId) {
        await updateCombo(editingId, formData);
      } else {
        await createCombo(formData);
      }

      fetchCombos();
      closeModal();
    } catch (e) {
      console.error("Error guardando combo:", e);
    }
  };

  const openForm = (combo) => {
    showModal(
      <FormCombos
        combo={combo}
        onSave={saveCombo}
        onCancel={closeModal}
      />
    );
  };

  return (
    <div>
      <h1>Administración de Combos</h1>

      <button onClick={() => openForm(null)}>
        Crear Combo
      </button>

      <CombosTable
        combos={combos}
        loading={loading}
        onEdit={openForm}
      />
    </div>
  );
}
