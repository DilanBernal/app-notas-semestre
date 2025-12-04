
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

  // Ref to store the latest state for the interval
  const materiasRef = useRef<MateriaData[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    materiasRef.current = materias;
  }, [materias]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`semestre_${numero} `);
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
        console.log(`Auto - saving semester ${numero}...`);
        localStorage.setItem(`semestre_${numero} `, JSON.stringify(materiasRef.current));
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [numero]);

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
      <div className="semestre-header">
        <h2>Semestre {numero}</h2>
        <div className="semestre-avg">
          Promedio: <span className={promedioSemestre >= 3 ? 'pass' : 'fail'}>{promedioSemestre.toFixed(2)}</span>
        </div>
      </div>

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
                <Materia
                  key={materia.id}
                  data={materia}
                  onUpdate={updateMateria}
                  onDelete={deleteMateria}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Semestre;