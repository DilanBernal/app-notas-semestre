import { useCallback, useEffect, useState } from 'react';
import './App.css'
import Semestre from './componens/Semestre'

function App() {
  const [isReady, setIsReady] = useState(false);
  const [semestreCount, setSemestreCount] = useState<number>(0);
  const [promedios, setPromedios] = useState<Record<number, number>>({});
  const [promedioGlobal, setPromedioGlobal] = useState(0);

  const handleInitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('semestre', semestreCount.toString());
    setIsReady(true);
  }, [semestreCount]);

  const handleBack = useCallback(() => {
    setIsReady(false);
    localStorage.removeItem('semestre');
    setPromedios({});
    setPromedioGlobal(0);
  }, []);

  const handlePromedioChange = useCallback((semestre: number, promedio: number) => {
    setPromedios(prev => {
      const newPromedios = { ...prev, [semestre]: promedio };
      return newPromedios;
    });
  }, []);

  useEffect(() => {
    const values = Object.values(promedios);
    if (values.length === 0) {
      setPromedioGlobal(0);
      return;
    }
    const sum = values.reduce((a, b) => a + b, 0);
    // We divide by the total number of semesters configured, or the number of active semesters?
    // Usually global average is based on the semesters that have data. 
    // But if we want to project, maybe we just average the non-zero ones?
    // Let's average all the ones that have reported a value (even 0 if initialized).
    // Actually, let's just average the values we have.
    setPromedioGlobal(sum / values.length);
  }, [promedios]);

  useEffect(() => {
    const storedSemestre = localStorage.getItem('semestre');
    if (storedSemestre) {
      setSemestreCount(Number(storedSemestre));
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="container">
        <h1>Calculadora de Promedio</h1>
        <form className="init-form" onSubmit={handleInitForm}>
          <label htmlFor="semestre-cant">¿Cuántos semestres quieres calcular?</label>
          <input
            id="semestre-cant"
            type="number"
            min="1"
            max="12"
            onChange={(e) => setSemestreCount(Number(e.target.value))}
            placeholder="Ej: 8"
          />
          <button type="submit">Comenzar</button>
        </form>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <button onClick={handleBack} className="back-btn">← Volver</button>
        <div className="global-avg-card">
          <h2>Promedio Global</h2>
          <div className={`global-score ${promedioGlobal >= 3 ? 'pass' : 'fail'}`}>
            {promedioGlobal.toFixed(2)}
          </div>
        </div>
      </header>

      <div className="semestres-grid">
        {Array.from({ length: semestreCount }, (_, index) => index + 1).map((semestre) => (
          <Semestre
            key={semestre}
            numero={semestre}
            onPromedioChange={handlePromedioChange}
          />
        ))}
      </div>
    </div>
  )
}

export default App;
