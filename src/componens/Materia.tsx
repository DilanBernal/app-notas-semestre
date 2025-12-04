export interface MateriaData {
  id: string;
  nombre: string;
  nota1: number;
  nota2: number;
  nota3: number;
  promedio: number;
}

interface MateriaProps {
  data: MateriaData;
  onUpdate: (id: string, field: keyof MateriaData, value: number) => void;
  onDelete: (id: string) => void;
}

const Materia = ({ data, onUpdate, onDelete }: MateriaProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MateriaData) => {
    const val = parseFloat(e.target.value);
    onUpdate(data.id, field, isNaN(val) ? 0 : val);
  };

  return (
    <tr>
      <td>{data.nombre}</td>
      <td>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={data.nota1 || ''}
          onChange={(e) => handleChange(e, 'nota1')}
          className="grade-input"
          placeholder="0.0"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={data.nota2 || ''}
          onChange={(e) => handleChange(e, 'nota2')}
          className="grade-input"
          placeholder="0.0"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={data.nota3 || ''}
          onChange={(e) => handleChange(e, 'nota3')}
          className="grade-input"
          placeholder="0.0"
        />
      </td>
      <td className="font-bold">
        {data.promedio.toFixed(1)}
      </td>
      <td>
        <button onClick={() => onDelete(data.id)} className="delete-btn" title="Eliminar materia">
          <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="1em" viewBox="0 0 24 24"><title xmlns="">trash</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /></svg>
        </button>
      </td>
    </tr>
  )
}

export default Materia;