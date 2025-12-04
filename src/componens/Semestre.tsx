import { useState, useEffect, useRef } from "react";
import Materia, { type MateriaData } from "./Materia";

interface SemestreProps {
  numero: number;
  onPromedioChange: (semestre: number, promedio: number) => void;
}

const Semestre = ({ numero, onPromedioChange }: SemestreProps) => {
  const [materias, setMaterias] = useState<MateriaData[]>([]);
  const [newMateriaName, setNewMateriaName] = useState("");
  const [promedioSemestre, setPromedioSemestre] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Ref to store the latest state for the interval
  const materiasRef = useRef<MateriaData[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    materiasRef.current = materias;
  }, [materias]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`semestre_${numero}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setMaterias(parsedData);
      } catch (e) {
        console.error("Error parsing saved data", e);
      }
    }
  }, [numero]);

  // Auto-save every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (materiasRef.current.length > 0) {
        console.log(`Auto-saving semester ${numero}...`);
        localStorage.setItem(`semestre_${numero}`, JSON.stringify(materiasRef.current));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [numero]);

  const handleManualSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(`semestre_${numero}`, JSON.stringify(materias));
    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
  };

  const calculateMateriaPromedio = (m: MateriaData) => {
    return (m.nota1 * 0.3) + (m.nota2 * 0.3) + (m.nota3 * 0.4);
  };

  const addMateria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateriaName.trim()) return;

    const newMateria: MateriaData = {
      id: crypto.randomUUID(),
      nombre: newMateriaName,
      nota1: 0,
      nota2: 0,
      nota3: 0,
      promedio: 0
    };

    setMaterias([...materias, newMateria]);
    setNewMateriaName("");
  };

  const updateMateria = (id: string, field: keyof MateriaData, value: number) => {
    setMaterias(prevMaterias => {
      return prevMaterias.map(m => {
        if (m.id === id) {
          const updatedMateria = { ...m, [field]: value };
          // Recalculate average for this subject
          updatedMateria.promedio = calculateMateriaPromedio(updatedMateria);
          return updatedMateria;
        }
        return m;
      });
    });
  };

  const deleteMateria = (id: string) => {
    setMaterias(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => {
    if (materias.length === 0) {
      setPromedioSemestre(0);
      onPromedioChange(numero, 0);
      return;
    }

    const sum = materias.reduce((acc, curr) => acc + curr.promedio, 0);
    const avg = sum / materias.length;
    setPromedioSemestre(avg);
    onPromedioChange(numero, avg);
  }, [materias, numero, onPromedioChange]);

  return (
    <div className="semestre-card">
      <div className="semestre-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-left">
          <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
          <h2>Semestre {numero}</h2>
        </div>
        <div className="semestre-avg">
          Promedio: <span className={promedioSemestre >= 3 ? 'pass' : 'fail'}>{promedioSemestre.toFixed(2)}</span>
          <button
            onClick={handleManualSave}
            className={`save-icon-btn ${saveStatus === 'saved' ? 'saved' : ''}`}
            title={saveStatus === 'saved' ? 'Guardado' : 'Guardar cambios'}
            disabled={saveStatus === 'saved'}
          >
            {saveStatus === 'idle' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`collapsible-content ${isOpen ? '' : 'collapsed'}`}>
        <form onSubmit={addMateria} className="add-materia-form">
          <input
            type="text"
            value={newMateriaName}
            onChange={(e) => setNewMateriaName(e.target.value)}
            placeholder="Nombre de la materia..."
            className="materia-input"
          />
          <button type="submit" className="add-btn">Agregar Materia</button>
        </form>

        {materias.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Corte 1 (30%)</th>
                  <th>Corte 2 (30%)</th>
                  <th>Corte 3 (40%)</th>
                  <th>Promedio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materias.map((materia) => (
                  <div key={materia.id} style={{ display: 'contents' }} className="fade-in-row">
                    <Materia
                      data={materia}
                      onUpdate={updateMateria}
                      onDelete={deleteMateria}
                    />
                  </div>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Semestre;