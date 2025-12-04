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
          🗑️
        </button>
      </td>
    </tr>
  )
}

export default Materia;