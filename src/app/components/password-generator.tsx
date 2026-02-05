import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Binary, Check, Copy, Info, Loader2, RefreshCw, ShieldCheck, Type } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

const WORD_LIST = [
  'alfa', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'theta', 'omega',
  'fuego', 'viento', 'tierra', 'agua', 'nube', 'bosque', 'monte', 'rio',
  'arena', 'roca', 'estrella', 'galaxia', 'cosmos', 'tiempo', 'espacio',
  'atomo', 'quarks', 'plasma', 'onda', 'luz', 'sombra', 'eco', 'vuelo',
  'salto', 'pulso', 'ritmo', 'alma', 'mente', 'vida', 'sueno', 'fuerza',
  'poder', 'libre', 'paz', 'noche', 'dia', 'claro', 'oscuro', 'frio',
  'calor', 'brisa', 'rayo', 'trueno', 'selva', 'desierto', 'valle',
  'cima', 'abismo', 'nieve', 'hielo', 'vapor', 'cristal', 'metal',
  'oro', 'plata', 'diamante', 'rubi', 'esmeralda', 'cuarzo', 'obsidiana',
  'vuelo', 'halcon', 'aguila', 'lobo', 'tigre', 'leon', 'pantera',
  'lince', 'zorro', 'buho', 'dragon', 'fenix', 'quimera', 'titan',
  'hero', 'mito', 'leyenda', 'fábula', 'poema', 'verso', 'ritmo',
  'clave', 'codigo', 'cifrado', 'enigma', 'secreto', 'misterio',
  'viaje', 'ruta', 'senda', 'camino', 'puerta', 'llave', 'portal'
];

type GeneratorMode = 'random'|'passphrase';

export const PasswordGenerator = () => {
  const [mode, setMode] = useState<GeneratorMode>('random');
  const [password, setPassword] = useState('');

  // Random Mode Settings
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Passphrase Mode Settings
  const [numWords, setNumWords] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [addNumber, setAddNumber] = useState(true);

  const [strength, setStrength] = useState({label: 'Fuerte', color: 'text-emerald-400', score: 3});
  const [isCopied, setIsCopied] = useState(false);

  // Leak Checker State
  const [leakStatus, setLeakStatus] = useState<'idle'|'checking'|'safe'|'leaked'|'error'>('idle');
  const [leakCount, setLeakCount] = useState(0);
  const checkTimeoutRef = useRef<NodeJS.Timeout|null>(null);

  const sha1 = async (str: string) => {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const checkPasswordLeak = useCallback(async (pwd: string) => {
    if (!pwd || pwd === 'Selecciona una opción') return;

    setLeakStatus('checking');
    try {
      const hash = await sha1(pwd);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) throw new Error('API Error');

      const data = await response.text();
      const lines = data.split('\n');
      const match = lines.find(line => line.startsWith(suffix));

      if (match) {
        const count = parseInt(match.split(':')[1]);
        setLeakCount(count);
        setLeakStatus('leaked');
      } else {
        setLeakStatus('safe');
      }
    } catch (error) {
      console.error('Leak check failed:', error);
      setLeakStatus('error');
    }
  }, []);

  const generateRandom = useCallback(() => {
    const charset = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
      symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let characters = '';
    if (includeUppercase) characters += charset.upper;
    if (includeLowercase) characters += charset.lower;
    if (includeNumbers) characters += charset.number;
    if (includeSymbols) characters += charset.symbol;

    if (characters.length === 0) return 'Selecciona una opción';

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += characters[array[i] % characters.length];
    }
    return result;
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generatePassphrase = useCallback(() => {
    let words: string[] = [];
    const array = new Uint32Array(numWords);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < numWords; i++) {
      let word = WORD_LIST[array[i] % WORD_LIST.length];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }

    let result = words.join(separator);

    if (addNumber) {
      const randomNum = Math.floor(Math.random() * 100);
      result += separator + randomNum;
    }

    return result;
  }, [numWords, separator, capitalize, addNumber]);

  const calculateStrength = useCallback((pwd: string) => {
    if (mode === 'random') {
      let score = 0;
      if (pwd.length >= 12) score++;
      if (pwd.length >= 16) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;

      if (score <= 2) setStrength({label: 'Débil', color: 'text-rose-500', score: 1});
      else if (score <= 4) setStrength({label: 'Media', color: 'text-amber-400', score: 2});
      else if (score <= 5) setStrength({label: 'Fuerte', color: 'text-emerald-400', score: 3});
      else setStrength({label: 'Irrompible', color: 'text-cyan-400', score: 4});
    } else {
      if (numWords <= 2) setStrength({label: 'Débil', color: 'text-rose-500', score: 1});
      else if (numWords === 3) setStrength({label: 'Media', color: 'text-amber-400', score: 2});
      else if (numWords === 4) setStrength({label: 'Fuerte', color: 'text-emerald-400', score: 3});
      else setStrength({label: 'Irrompible', color: 'text-cyan-400', score: 4});
    }
  }, [mode, numWords]);

  const handleGenerate = useCallback(() => {
    const newPassword = mode === 'random' ? generateRandom() : generatePassphrase();
    setPassword(newPassword);
    calculateStrength(newPassword);

    // Clear previous check and start a new one
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    setLeakStatus('idle');
    checkTimeoutRef.current = setTimeout(() => {
      checkPasswordLeak(newPassword);
    }, 800);
  }, [mode, generateRandom, generatePassphrase, calculateStrength, checkPasswordLeak]);

  useEffect(() => {
    handleGenerate();
    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [handleGenerate]);

  const copyToClipboard = () => {
    if (password === 'Selecciona una opción') return;
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    toast.success('Contraseña copiada al portapapeles');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.1)]"
    >
      <div className="space-y-8">
        {/* Mode Switcher */}
        <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5">
          <button
            onClick={() => setMode('random')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === 'random' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Binary size={18} />
            Aleatoria
          </button>
          <button
            onClick={() => setMode('passphrase')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === 'passphrase' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Type size={18} />
            Frase
          </button>
        </div>

        {/* Password Display */}
        <div className="relative group">
          <div
            className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div
            className="relative flex items-center justify-between bg-zinc-900/90 p-6 rounded-2xl border border-white/5">
            <span
              className={`text-2xl font-mono tracking-wider break-all ${password === 'Selecciona una opción' ? 'text-zinc-500' : 'text-white'}`}>
              {password}
            </span>
            <div className="flex gap-2 shrink-0 ml-4">
              <button
                onClick={handleGenerate}
                className="p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-cyan-400 transition-all duration-300"
                title="Generar de nuevo"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all duration-300 border border-cyan-500/20"
                title="Copiar"
              >
                {isCopied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar: Strength & Leak Check */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="flex-1 h-1.5 flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${
                    step <= strength.score
                      ? (strength.score === 1 ? 'bg-rose-500' : strength.score === 2 ? 'bg-amber-400' : strength.score === 3 ? 'bg-emerald-400' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]')
                      : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${strength.color}`}>
              {strength.label}
            </span>
          </div>

          {/* Leak Alert Box */}
          <AnimatePresence mode="wait">
            {leakStatus !== 'idle' && (
              <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  leakStatus === 'checking' ? 'bg-zinc-900/50 border-white/5 text-zinc-400' :
                    leakStatus === 'safe' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      leakStatus === 'leaked' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-zinc-900/50 border-white/5 text-zinc-500'
                }`}
              >
                {leakStatus === 'checking' && <Loader2 size={18} className="animate-spin" />}
                {leakStatus === 'safe' && <ShieldCheck size={18} />}
                {leakStatus === 'leaked' && <AlertTriangle size={18} />}
                {leakStatus === 'error' && <Info size={18} />}

                <span className="text-xs font-medium uppercase tracking-wider flex-1">
                  {leakStatus === 'checking' && "Escaneando filtraciones..."}
                  {leakStatus === 'safe' && "Esta clave no aparece en filtraciones conocidas."}
                  {leakStatus === 'leaked' && `¡Peligro! Encontrada en ${leakCount.toLocaleString()} filtraciones.`}
                  {leakStatus === 'error' && "No se pudo verificar la seguridad externa."}
                </span>

                {leakStatus === 'leaked' && (
                  <button
                    onClick={handleGenerate}
                    className="text-[10px] bg-rose-500 text-white px-2 py-1 rounded-md font-bold uppercase hover:bg-rose-600 transition-colors"
                  >
                    Regenerar
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mode === 'random' ? (
            <>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Longitud</label>
                    <span className="text-cyan-400 font-mono text-lg">{length}</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ToggleOption label="Mayúsculas" checked={includeUppercase}
                              onChange={() => setIncludeUppercase(!includeUppercase)} />
                <ToggleOption label="Minúsculas" checked={includeLowercase}
                              onChange={() => setIncludeLowercase(!includeLowercase)} />
                <ToggleOption label="Números" checked={includeNumbers}
                              onChange={() => setIncludeNumbers(!includeNumbers)} />
                <ToggleOption label="Símbolos" checked={includeSymbols}
                              onChange={() => setIncludeSymbols(!includeSymbols)} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Nº de Palabras</label>
                    <span className="text-cyan-400 font-mono text-lg">{numWords}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={numWords}
                    onChange={(e) => setNumWords(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider block">Separador</label>
                  <div className="flex gap-2">
                    {['-', '.', '_', ' '].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSeparator(s)}
                        className={`flex-1 py-2 rounded-lg border transition-all ${
                          separator === s ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20'
                        }`}
                      >
                        {s === ' ' ? 'Espacio' : s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ToggleOption label="Capitalizar" checked={capitalize} onChange={() => setCapitalize(!capitalize)} />
                <ToggleOption label="Añadir Número" checked={addNumber} onChange={() => setAddNumber(!addNumber)} />
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-white/5 flex items-start gap-3 text-zinc-500">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {mode === 'random'
              ? "Las contraseñas aleatorias usan una mezcla de caracteres criptográficamente seguros."
              : "Las frases de contraseña (Diceware) son más fáciles de recordar pero extremadamente difíciles de adivinar por fuerza bruta."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ToggleOption = ({label, checked, onChange}: {label: string, checked: boolean, onChange: () => void}) => (
  <label
    className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
    <div className="flex items-center gap-3">
      <span
        className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{label}</span>
    </div>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div
        className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
    </div>
  </label>
);
