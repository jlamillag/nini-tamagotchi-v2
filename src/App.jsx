import React, { useState, useEffect, useRef, useCallback } from 'react';
// IMPORTACIONES ACTUALIZADAS: Se asegura Egg, Flame y Utensils
import { Heart, Zap, Gamepad2, Utensils, Moon, RefreshCw, Sun, Flame, Egg, Play, FastForward, AlertTriangle, Pause, LogOut, ChevronRight, Settings, BookOpen, GraduationCap, Music } from 'lucide-react';

// URL BASE OPTIMIZADA (Para la carga estable de assets desde GitHub Raw)
const EXTERNAL_ASSETS_URL_BASE = "https://raw.githubusercontent.com/jlamillag/nini-assets-v1/main/"; 
const ASSETS_RAW_PREFIX = "https://raw.githubusercontent.com/jlamillag/nini-assets-v1/refs/heads/main/"; 


// --- CONFIGURACIÓN DEL JUEGO ---
const GAME_RULES = {
  timeMultipliers: { 1: 1, 2: 2, 3: 15, 4: 60, 5: 300, 6: 1800 },
  secondsPerDay: 86400, 
  stageDurations: { egg: 3 * 3600, child: 3 * 3600 },
  // REGLAS DE DECAIMIENTO GENERAL
  decayRates: { 
    hunger: 100 / (4 * 3600), 
    happiness: 100 / (2 * 3600), 
    energy: 100 / (8 * 3600),
    intelligence: 100 / (12 * 3600),
    heat: 100 / (6 * 3600), // DECAIMIENTO DE CALOR PARA EL HUEVO
  },
  // REGLAS DE RECUPERACIÓN GENERAL
  recovery: { 
    // ACCIONES GENERALES (NIÑO/ADULTO)
    feed: 20, play: 15, sleep: 50, consent: 25, read: 10,
    intelligence_feed: 5,
    intelligence_play: 8,
    intelligence_read: 20, 
    intelligence_consent: 10, 
    
    // ACCIONES ESPECÍFICAS DE HUEVO
    incubate_heat: 30, // Empollar sube calor
    music_heat: 15,    
    music_happiness: 15, 
    music_intelligence: 5, 
  } 
};

// --- TEMAS DE COLOR PREDEFINIDOS ---
const CARCASA_THEMES = [
    { name: 'Morado Nini', hex: '#7c3aed', gradient: 'linear-gradient(to bottom right, #7c3aed, #3730a3)' },
    { name: 'Negro Clásico', hex: '#1f2937', gradient: 'linear-gradient(to bottom right, #1f2937, #000000)' },
    { name: 'Lima Power', hex: '#84cc16', gradient: 'linear-gradient(to bottom right, #84cc16, #4d7c0f)' },
    { name: 'Aqua Fresh', hex: '#06b6d4', gradient: 'linear-gradient(to bottom right, #06b6d4, #0e7490)' },
    { name: 'Naranja Fuego', hex: '#f97316', gradient: 'linear-gradient(to bottom right, #f97316, #c2410c)' },
];

const SCREEN_THEMES = [
    { name: 'Gris Clásico', hex: '#9ea792' },
    { name: 'Verde Original', hex: '#789c67' },
    { name: 'Blanco Puro', hex: '#ffffff' }, 
    { name: 'Negro Mate', hex: '#000000' },
    { name: 'Azul Retro', hex: '#94a3b8' },
];

const TEXT_THEMES = [
    { name: 'Negro Oscuro', hex: '#1f2937' },
    { name: 'Blanco Brillante', hex: '#ffffff' },
    { name: 'Verde Neón', hex: '#16a34a' },
    { name: 'Rojo Fuego', hex: '#ef4444' },
    { name: 'Amarillo Ciber', hex: '#facc15' },
];


// --- Componente: PAGINAS DE BIENVENIDA (ONBOARDING) ---
const Onboarding = ({ onFinish }) => {
    const [page, setPage] = useState(1);
    const [titleSuffix, setTitleSuffix] = useState('O');
    const [pronounSuffix, setPronounSuffix] = useState('él');
    
    const VERSION = "2.0"; 
    const CREATION_DATE = "23 Nov 2025"; 
    
    const titleSuffixes = ['O', 'A', 'E'];
    const pronounSuffixes = ['él', 'ella', 'elle']; 
    const titleIndexRef = useRef(0);
    const pronounIndexRef = useRef(0);

    useEffect(() => {
        if (page !== 1 && page !== 2) return; 
        const interval = setInterval(() => {
            titleIndexRef.current = (titleIndexRef.current + 1) % titleSuffixes.length;
            setTitleSuffix(titleSuffixes[titleIndexRef.current]);
        }, 500); 
        return () => clearInterval(interval);
    }, [page]); 

    useEffect(() => {
        if (page !== 2) return; 
        const interval = setInterval(() => {
            pronounIndexRef.current = (pronounIndexRef.current + 1) % pronounSuffixes.length;
            setPronounSuffix(pronounSuffixes[pronounIndexRef.current]);
        }, 800); 
        return () => clearInterval(interval);
    }, [page]); 

    const pagesContent = {
        1: {
            title: `BIENVENID[SUFFIX] AL MUNDO NINI`, 
            text: "Donde haces lo que te hace falta y no haces más si no quieres.\nTu Niní también podrá ser lo que quiera, si tú le dejas.",
            buttonText: "siguiente 1/2",
        },
        2: {
            title: `BIENVENID[SUFFIX] AL MUNDO NINI`,
            text: `Tu Niní será tu compañía de ahora en adelante y tú la de`,
            buttonText: "empezar 2/2",
        },
    };

    const content = pagesContent[page];

    const renderPageTitle = () => {
        const displayTitle = content.title.replace('[SUFFIX]', titleSuffix);
        return (
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-indigo-900/50 pb-2">
                {displayTitle}
            </h2>
        );
    }
    
    const renderPageTwoText = () => {
        if (page === 2) {
            return (
                <div className="flex flex-col items-center">
                    <p className="text-sm font-bold whitespace-pre-line leading-relaxed mb-3">
                        {content.text}
                         <span className="inline-block transition-all duration-300 ease-in-out font-extrabold ml-1">
                            {pronounSuffix}
                        </span>
                        .
                    </p>
                    <div className="h-6 flex items-center justify-center"></div>
                </div>
            );
        }
        return (
            <p className="text-sm font-bold whitespace-pre-line leading-relaxed">
                {content.text}
            </p>
        );
    }

    const handleNext = () => {
        if (page < Object.keys(pagesContent).length) {
            setPage(page + 1);
        } else {
            onFinish(); 
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-between text-indigo-900 p-6 text-center">
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                {renderPageTitle()}
                {page === 2 ? renderPageTwoText() : (
                    <p className="text-sm font-bold whitespace-pre-line leading-relaxed">
                        {content.text}
                    </p>
                )}
                <button 
                    onClick={handleNext} 
                    className={`bg-indigo-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md active:scale-95 transition-all flex items-center gap-2 text-sm ${page === 2 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                    {content.buttonText}
                    <ChevronRight size={14} />
                </button>
            </div>
            <div className="text-[10px] font-semibold opacity-70 mt-4">
                <p>Nini Version {VERSION}</p>
                <p>Fecha de Creación: {CREATION_DATE}</p>
            </div>
        </div>
    );
}

// --- Componente: Menu de Inicio ---
const StartMenu = ({ onStart }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('hombre');
  const [speed, setSpeed] = useState(5); 
  
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 text-indigo-900 p-2">
      <h2 className="text-2xl font-black uppercase tracking-tighter">CREA TU NINI</h2>
      
      <div className="w-full space-y-1">
        <label className="text-[10px] font-bold ml-1">NOMBRE</label>
        <input 
          type="text" 
          maxLength={10} 
          value={name} 
          onChange={handleNameChange} 
          className="w-full bg-white/60 border-2 border-indigo-900/20 rounded-lg px-3 py-2 font-bold text-center focus:outline-none focus:border-indigo-600" 
        />
      </div>

      <div className="w-full space-y-1">
        <label className="text-[10px] font-bold ml-1">GÉNERO</label>
        <select className="w-full bg-white/60 border-2 border-indigo-900/20 rounded-lg px-3 py-2 font-bold text-center focus:outline-none cursor-pointer" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="lgtbq">LGTBIQ++XYZ,etc</option> 
        </select>
      </div>

      <div className="w-full space-y-1">
        <div className="flex justify-between px-1 items-center">
          <label className="text-[10px] font-bold">VELOCIDAD INICIAL</label>
          <span className={`text-[10px] font-bold transition-colors ${speed === 6 ? 'text-red-600 animate-pulse flex items-center gap-1' : 'text-indigo-600'}`}>
            {speed === 6 && <AlertTriangle size={10} />}
            {speed === 6 ? 'PELIGRO' : `NIVEL ${speed}`}
          </span>
        </div>
        <input type="range" min="1" max="6" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className={`w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer transition-all ${speed === 6 ? 'accent-red-600 bg-red-200' : 'accent-indigo-600'}`} />
        <div className="flex justify-between text-[10px] opacity-60 font-bold mt-1 px-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span className={speed === 6 ? 'text-red-600 font-black' : ''}>6</span>
        </div>
      </div>

      <button onClick={() => name.trim() && onStart({ 
        name, 
        gender, 
        speed, 
        carcasaColor: CARCASA_THEMES[0].hex, 
        screenColor: SCREEN_THEMES[0].hex, 
        textColor: TEXT_THEMES[0].hex
      })} 
      disabled={!name.trim()} 
      className="mt-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 transition-all flex items-center gap-2 text-sm">
        <Play size={14} fill="currentColor" /> NACER
      </button>
    </div>
  );
};

// --- Componente: Modal para editar Nombre y Género ---
const EditIdentityModal = ({ gameConfig, setGameConfig, onClose }) => {
    const [newName, setNewName] = useState(gameConfig.name);
    const [newGender, setNewGender] = useState(gameConfig.gender);
    
    const canSave = newName.trim() !== '' && (newName !== gameConfig.name || newGender !== gameConfig.gender);

    const handleSave = () => {
        if (canSave) {
            setGameConfig(prev => ({
                ...prev,
                name: newName.trim(),
                gender: newGender,
            }));
        }
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl text-center shadow-2xl max-w-sm w-full space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-900 border-b pb-2">
                    MODIFICAR IDENTIDAD
                </h3>
                <div className="w-full space-y-3 pt-2">
                    <div className="space-y-1 text-left">
                        <label className="text-xs font-bold ml-1 text-indigo-900 opacity-70 block">NUEVO NOMBRE</label>
                        <input 
                            type="text" 
                            maxLength={10} 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-gray-100 border border-indigo-900/20 rounded-lg px-3 py-2 font-bold text-center focus:outline-none focus:border-indigo-600" 
                        />
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-xs font-bold ml-1 text-indigo-900 opacity-70 block">NUEVO GÉNERO</label>
                        <select 
                            className="w-full bg-gray-100 border border-indigo-900/20 rounded-lg px-3 py-2 font-bold text-center focus:outline-none cursor-pointer" 
                            value={newGender} 
                            onChange={(e) => setNewGender(e.target.value)}
                        >
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="lgtbq">LGTBIQ++XYZ,etc</option> 
                        </select>
                    </div>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                    <button 
                        onClick={handleSave} 
                        disabled={!canSave}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 transition-all text-sm shadow-md"
                    >
                        ACEPTAR
                    </button>
                    <button 
                        onClick={onClose} 
                        className="flex-1 bg-gray-300 text-indigo-900 px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-gray-400 transition-all text-sm shadow-md"
                    >
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente: Menu de Configuracion ---
const SettingsMenu = ({ onBack, onRestart, gameConfig, setGameConfig }) => {
    const [showEditIdentity, setShowEditIdentity] = useState(false);
    
    const changeCarcasaColor = (hexColor) => {
        setGameConfig(p => ({ ...p, carcasaColor: hexColor }));
    };
    const changeScreenColor = (hexColor) => {
        setGameConfig(p => ({ ...p, screenColor: hexColor }));
    };
    const changeTextColor = (hexColor) => {
        setGameConfig(p => ({ ...p, textColor: hexColor }));
    };
    const resetColorsToDefault = () => {
        setGameConfig(p => ({
            ...p,
            carcasaColor: CARCASA_THEMES[0].hex, 
            screenColor: SCREEN_THEMES[0].hex, 
            textColor: TEXT_THEMES[0].hex
        }));
    };
    
    const ColorSwatch = ({ themes, currentColor, onChange }) => (
        <div className="grid grid-cols-5 gap-3">
            {themes.map((theme) => (
                <button
                    key={theme.name}
                    onClick={() => onChange(theme.hex)}
                    title={theme.name}
                    className={`w-full h-8 rounded-lg shadow-md transition-all border-4 ${
                        currentColor === theme.hex
                            ? 'border-indigo-600 scale-105 shadow-lg' 
                            : 'border-indigo-900/20 hover:border-indigo-900/50'
                    }`}
                    style={{ 
                        backgroundColor: theme.hex,
                        background: theme.gradient && themes === CARCASA_THEMES ? theme.gradient : theme.hex 
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="h-full flex flex-col justify-start space-y-6 text-indigo-900 p-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-indigo-900/50 pb-2 mb-4">
                CONFIGURACIÓN
            </h2>
            <div className="flex flex-col space-y-4 text-left">
                <p className="text-lg font-extrabold">Opciones de Jugabilidad:</p>
                <button 
                    onClick={() => setShowEditIdentity(true)}
                    className="flex justify-between items-center p-3 bg-white/60 rounded-lg font-semibold border border-indigo-900/10 hover:bg-white transition-colors"
                >
                    Modificar Nombre y Género
                    <ChevronRight size={18} />
                </button>
                <div className="pt-4 border-t border-indigo-900/20">
                    <div className="flex justify-between items-center pb-2">
                        <p className="text-lg font-extrabold">PERSONALIZACIÓN DE COLORES:</p>
                        <button 
                            onClick={resetColorsToDefault}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-100 px-3 py-1 rounded-full shadow-sm hover:shadow-md active:scale-95"
                            title="Restablecer todos los colores a los valores iniciales"
                        >
                            <RefreshCw size={12} />
                            Restablecer colores
                        </button>
                    </div>
                    <div className="space-y-2 mb-6">
                        <label className="text-xs font-bold">Color Principal de la Carcasa</label>
                        <ColorSwatch 
                            themes={CARCASA_THEMES} 
                            currentColor={gameConfig.carcasaColor} 
                            onChange={changeCarcasaColor} 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold">Fondo de Pantalla</label>
                            <ColorSwatch 
                                themes={SCREEN_THEMES} 
                                currentColor={gameConfig.screenColor} 
                                onChange={changeScreenColor} 
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold">Color de Texto</label>
                            <ColorSwatch 
                                themes={TEXT_THEMES} 
                                currentColor={gameConfig.textColor} 
                                onChange={changeTextColor} 
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-indigo-900/30 mt-6 flex flex-col gap-4">
                    <button 
                        onClick={onBack}
                        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl active:scale-95 transition-all text-sm"
                    >
                        REGRESA A TU NINÍ ACTUAL
                    </button>
                    <button 
                        onClick={onRestart}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-red-600 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1 text-xs"
                    >
                        REINICIAR JUEGO
                    </button>
                </div>
            </div>
            {showEditIdentity && (
                <EditIdentityModal
                    gameConfig={gameConfig}
                    setGameConfig={setGameConfig}
                    onClose={() => setShowEditIdentity(false)}
                />
            )}
        </div>
    );
};


// --- Helper: Formato de Tiempo ---
const formatNiniTime = (totalSeconds) => {
  const days = Math.floor(totalSeconds / GAME_RULES.secondsPerDay);
  const remainingSeconds = totalSeconds % GAME_RULES.secondsPerDay;
  const hours = Math.floor(remainingSeconds / 3600); 
  const minutes = Math.floor((remainingSeconds % 3600) / 60); 
  const seconds = Math.floor(remainingSeconds % 60); 
  return `NiniDía ${days} - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- Componente Principal ---
export default function App() {
  const [appStage, setAppStage] = useState(0); 
  const [gameConfig, setGameConfig] = useState(null);
  const [stats, setStats] = useState({ hunger: 100, happiness: 100, energy: 100, intelligence: 0, heat: 100 }); 
  const [isSleeping, setIsSleeping] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalNiniTime, setTotalNiniTime] = useState(0);
  const [lifeStage, setLifeStage] = useState('egg');
  const [mood, setMood] = useState('happy'); 
  const [message, setMessage] = useState("");
  const [animClass, setAnimClass] = useState('');
  
  const [frame, setFrame] = useState(0);
  const [prePauseSpeed, setPrePauseSpeed] = useState(5); 
  const timerRef = useRef(null);
  const birthAnimationTimerRef = useRef(null); 
  const fryAnimationTimerRef = useRef(null); 

  const [showEvolutionModal, setShowEvolutionModal] = useState(null); 
  
  const [inclusiveSuffixAdult, setInclusiveSuffixAdult] = useState('O');
  const [inclusiveSuffixChild, setInclusiveSuffixChild] = useState('O');
  const inclusiveSuffixes = ['O', 'E', 'A'];
  const inclusiveIndexAdultRef = useRef(0);
  const inclusiveIndexChildRef = useRef(0);
  
  const [assetUrls, setAssetUrls] = useState(null); 
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false); 

  // Hook 1: Carga inicial
  useEffect(() => {
    const buildAssetUrls = (BASE_URL, RAW_PREFIX) => {
        const birthFrames = Array.from({ length: 6 }, (_, i) => RAW_PREFIX + `nini_birth_0${(i + 1)}.png`);
        const fryFrames = [RAW_PREFIX + `huevo_frito_00.png`, RAW_PREFIX + `huevo_frito_01.png`, RAW_PREFIX + `huevo_frito_02.png`];
        return ({
            birthAnimation: birthFrames,
            fryAnimation: fryFrames,
            egg: [BASE_URL + "huevo_idle_01.png", BASE_URL + "huevo_idle_02.png", BASE_URL + "huevo_idle_03.png"],
            child: {
                hombre: [RAW_PREFIX + "hom_nino_idle_01.png", RAW_PREFIX + "hom_nino_idle_02.png", RAW_PREFIX + "hom_nino_idle_03.png"], 
                mujer: [RAW_PREFIX + "muj_nina_idle_01.png", RAW_PREFIX + "muj_nina_idle_02.png", RAW_PREFIX + "muj_nina_idle_03.png"], 
                lgtbq: [RAW_PREFIX + "lgb_nino_idle_01.png", RAW_PREFIX + "lgb_nino_idle_02.png", RAW_PREFIX + "lgb_nino_idle_03.png"],
            },
            adult: {
                hombre: [RAW_PREFIX + "hom_adulto_idle_01.png", RAW_PREFIX + "hom_adulto_idle_02.png", RAW_PREFIX + "hom_adulto_idle_03.png"],
                mujer: [RAW_PREFIX + "muj_adulto_idle_01.png", RAW_PREFIX + "muj_adulto_idle_02.png", RAW_PREFIX + "muj_adulto_idle_03.png"],
                lgtbq: [RAW_PREFIX + "lgb_adulto_idle_01.png", RAW_PREFIX + "lgb_adulto_idle_02.png", RAW_PREFIX + "lgb_adulto_idle_03.png"],
            },
            dead: ["https://placehold.co/200x200/333333/white?text=RIP", "https://placehold.co/200x200/333333/white?text=RIP", "https://placehold.co/200x200/333333/white?text=RIP"]
        });
    }
    setAssetUrls(buildAssetUrls(EXTERNAL_ASSETS_URL_BASE, ASSETS_RAW_PREFIX));
  }, []); 

  // Hook 2: Transicion Carga
  useEffect(() => {
    if (appStage === 5 && frame >= assetUrls?.birthAnimation.length * 3 - 1) { 
        setTimeout(() => {
            setAppStage(2); 
            setFrame(0); 
        }, 500);
    }
  }, [appStage, isAssetsLoaded, frame, assetUrls]);
  
  // Hook 7 & 8: Animación Inclusiva
  useEffect(() => {
      if (showEvolutionModal !== 'adult') return;
      const interval = setInterval(() => {
          inclusiveIndexAdultRef.current = (inclusiveIndexAdultRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixAdult(inclusiveSuffixes[inclusiveIndexAdultRef.current]);
      }, 700); 
      return () => clearInterval(interval);
  }, [showEvolutionModal]);

  useEffect(() => {
      if (showEvolutionModal !== 'child') return;
      const interval = setInterval(() => {
          inclusiveIndexChildRef.current = (inclusiveIndexChildRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixChild(inclusiveSuffixes[inclusiveIndexChildRef.current]);
      }, 700); 
      return () => clearInterval(interval);
  }, [showEvolutionModal]);
  
  // Hook 9: Fritura
  useEffect(() => {
      if (fryAnimationTimerRef.current) clearInterval(fryAnimationTimerRef.current);
      if (appStage !== 6 || !assetUrls || !assetUrls.fryAnimation) return;
      const TOTAL_FRAMES_IN_SEQUENCE = assetUrls.fryAnimation.length; 
      const TOTAL_CYCLES = 3; 
      const TOTAL_ANIMATION_FRAMES = TOTAL_FRAMES_IN_SEQUENCE * TOTAL_CYCLES; 
      const FRAME_RATE_MS = 250; 
      setFrame(0); 
      fryAnimationTimerRef.current = setInterval(() => {
          setFrame(prev => {
              if (prev >= TOTAL_ANIMATION_FRAMES - 1) {
                  clearInterval(fryAnimationTimerRef.current);
                  setTimeout(() => {
                      setIsDead(true);
                      setAppStage(2); 
                      setStats({ hunger: 0, happiness: 0, energy: 0, intelligence: 0, heat: 0 }); 
                      setMood('dead');
                      setMessage("HICISTE DESAYUNO CON TU NINI... ¡BUEN PROVECHO!");
                  }, FRAME_RATE_MS); 
                  return prev;
              }
              return prev + 1;
          });
      }, FRAME_RATE_MS);
      return () => clearInterval(fryAnimationTimerRef.current);
  }, [appStage, assetUrls]);

  const preloadAssets = useCallback((config) => {
    if (!assetUrls) return;
    setIsAssetsLoaded(false); 
    const baseUrls = [...assetUrls.egg, ...assetUrls.dead, ...assetUrls.birthAnimation, ...assetUrls.fryAnimation];
    const childUrls = assetUrls.child[config.gender] || [];
    const adultUrls = assetUrls.adult[config.gender] || [];
    const allUrls = [...baseUrls, ...childUrls, ...adultUrls];
    let loadedCount = 0;
    const totalCount = allUrls.length;
    if (totalCount === 0) {
        setGameConfig(config);
        setIsAssetsLoaded(true);
        return;
    }
    const loadPromises = allUrls.map(url => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => { loadedCount++; resolve(); };
            img.onerror = () => { resolve(); };
            img.src = url;
        });
    });
    Promise.all(loadPromises).then(() => {
        setGameConfig(config); 
        setIsAssetsLoaded(true); 
    });
  }, [assetUrls]); 

  // Acciones
  const incubate = () => {
    if(isDead || isPaused || showEvolutionModal) return; 
    setStats(p => ({
      ...p,
      heat: Math.min(p.heat + GAME_RULES.recovery.incubate_heat, 100),
    }));
    triggerAnim('bounce');
    setMessage("¡Calentito!");
  }
  
  const playMusic = () => {
    if(isDead || isPaused || showEvolutionModal) return; 
    setStats(p => ({
        ...p,
        heat: Math.min(p.heat + GAME_RULES.recovery.music_heat, 100),
        happiness: Math.min(p.happiness + GAME_RULES.recovery.music_happiness, 100),
        intelligence: Math.min(p.intelligence + GAME_RULES.recovery.music_intelligence, 100),
    }));
    triggerAnim('wave');
    setMessage("Melodías de incubación...");
  }
  
  const fry = () => {
    if (lifeStage !== 'egg' || isDead || isPaused || showEvolutionModal) {
      setMessage("Solo puedes 'fritar' al Nini cuando es un huevo.");
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setAppStage(6); 
  }

  const feed = () => { 
    if(isDead || isSleeping || lifeStage === 'egg' || isPaused || showEvolutionModal) return; 
    setStats(p => ({
      ...p, 
      hunger: Math.min(p.hunger+GAME_RULES.recovery.feed, 100),
      intelligence: Math.min(p.intelligence + GAME_RULES.recovery.intelligence_feed, 100) 
    })); 
    triggerAnim('bounce'); 
    setMessage("¡Yummy!"); 
  };
  
  const consentir = () => { 
    if(isDead || isSleeping || isPaused || showEvolutionModal) return; 
    setStats(p => ({
      ...p, 
      happiness: Math.min(p.happiness + GAME_RULES.recovery.consent, 100),
      intelligence: Math.min(p.intelligence + GAME_RULES.recovery.intelligence_consent, 100),
      energy: lifeStage !== 'egg' ? Math.max(p.energy - 5, 0) : p.energy, 
    })); 
    triggerAnim('wave'); 
    setMessage("¡Awww, que Nini!"); 
  };

  const play = () => { 
    if(isDead || isSleeping || lifeStage === 'egg' || isPaused || showEvolutionModal) return; 
    if(stats.energy < 20) { setMessage("Sin energía..."); return; } 
    setStats(p => ({
      ...p, 
      happiness: Math.min(p.happiness + GAME_RULES.recovery.play, 100), 
      energy: Math.max(p.energy - 10, 0), 
      hunger: Math.max(p.hunger - 5, 0),
      intelligence: Math.min(p.intelligence + GAME_RULES.recovery.intelligence_play, 100) 
    })); 
    triggerAnim('spin'); 
    setMessage("¡Wiii!"); 
  };

  const leerCuento = () => { 
    if(isDead || isSleeping || isPaused || showEvolutionModal) return; 
    setStats(p => ({
      ...p, 
      happiness: Math.min(p.happiness + GAME_RULES.recovery.read, 100), 
      intelligence: Math.min(p.intelligence + GAME_RULES.recovery.intelligence_read, 100),
      energy: lifeStage !== 'egg' ? Math.min(p.energy + GAME_RULES.recovery.read, 100) : p.energy,
      hunger: lifeStage !== 'egg' ? Math.max(p.hunger - 5, 0) : p.hunger,
    })); 
    triggerAnim('tilt'); 
    setMessage("Qué linda ninihistoria."); 
  };

  const toggleSleep = () => { if(isDead || lifeStage === 'egg' || isPaused || showEvolutionModal) return; setIsSleeping(!isSleeping); setMessage(isSleeping ? "¡A despertar!" : "Zzz..."); };
  
  const togglePause = () => { 
    if (isDead || showEvolutionModal) return; 
    if (!isPaused) {
        setPrePauseSpeed(gameConfig.speed);
        setIsPaused(true);
    } else {
        setGameConfig(p => ({ ...p, speed: 1 }));
        setIsPaused(false);
    }
  };

  const openSettings = () => {
    if (appStage === 2) {
        setPrePauseSpeed(gameConfig.speed);
        setIsPaused(true);
    }
    setAppStage(3);
  }

  const closeSettings = () => {
    if (gameConfig) {
      setGameConfig(p => ({ ...p, speed: 1 }));
      setIsPaused(false);
      setAppStage(2);
    } else {
      setAppStage(1);
    }
  }

  const restart = () => { 
    setGameConfig(null); 
    setIsDead(false); 
    setIsPaused(false); 
    setStats({ hunger: 100, happiness: 100, energy: 100, intelligence: 0, heat: 100 }); 
    setTotalNiniTime(0); 
    setLifeStage('egg'); 
    setIsSleeping(false); 
    setMessage(""); 
    setAppStage(0); 
    setIsAssetsLoaded(false); 
  };

  const closeEvolutionModal = () => {
      setShowEvolutionModal(null);
      setGameConfig(p => ({ ...p, speed: 1 }));
      setIsPaused(false);
  }
  
  const triggerAnim = (type) => { 
    if (type === 'bounce') setAnimClass('animate-bounce'); 
    if (type === 'spin') setAnimClass('animate-spin'); 
    if (type === 'wave') setAnimClass('animate-pulse'); 
    if (type === 'tilt') setAnimClass('animate-wiggle'); 
    setTimeout(() => setAnimClass(''), 1000); 
  };
  
  const updateSpeed = (v) => setGameConfig(p => ({ ...p, speed: parseInt(v) }));

  // Hook 3: Limpieza
  useEffect(() => {
      if (appStage !== 2) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
      }
      return () => { if (timerRef.current) clearInterval(timerRef.current); }
  }, [appStage]); 
  
  // Hook 4: Animacion Nacimiento
  useEffect(() => {
      if (birthAnimationTimerRef.current) clearInterval(birthAnimationTimerRef.current);
      if (appStage !== 5 || !assetUrls || !assetUrls.birthAnimation) return;
      const TOTAL_FRAMES_IN_SEQUENCE = assetUrls.birthAnimation.length; 
      const TOTAL_CYCLES = 3; 
      const TOTAL_ANIMATION_FRAMES = TOTAL_FRAMES_IN_SEQUENCE * TOTAL_CYCLES; 
      const FRAME_RATE_MS = 1000 / TOTAL_FRAMES_IN_SEQUENCE; 
      setFrame(0); 
      birthAnimationTimerRef.current = setInterval(() => {
          setFrame(prev => {
              if (prev >= TOTAL_ANIMATION_FRAMES - 1) {
                  clearInterval(birthAnimationTimerRef.current);
                  return prev;
              }
              return prev + 1;
          });
      }, FRAME_RATE_MS);
      return () => clearInterval(birthAnimationTimerRef.current);
  }, [appStage, assetUrls]); 

  // Hook 5: Lógica Principal
  useEffect(() => {
    if (!gameConfig || isDead || !isAssetsLoaded || appStage !== 2 || showEvolutionModal) return;
    
    const multiplier = GAME_RULES.timeMultipliers[gameConfig?.speed] || 1;
    let pulseRateMS;
    if (multiplier <= 15) pulseRateMS = 500; 
    else if (multiplier <= 300) pulseRateMS = 200; 
    else pulseRateMS = 50; 
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (isPaused) return;

      const niniSecondsPassed = (pulseRateMS / 1000) * multiplier; 
      let newLifeStage = lifeStage;

      setTotalNiniTime(prev => {
        const newTime = prev + niniSecondsPassed;
        const eggDuration = GAME_RULES.stageDurations.egg;
        const childDuration = GAME_RULES.stageDurations.child;
        const currentStage = lifeStage;

        if (newTime < eggDuration) newLifeStage = 'egg';
        else if (newTime < (eggDuration + childDuration)) newLifeStage = 'child';
        else newLifeStage = 'adult';
        
        if (newLifeStage !== currentStage) {
            setLifeStage(newLifeStage);
            setFrame(0); 
            setIsPaused(true);
            setShowEvolutionModal(newLifeStage); 
        }
        return newTime;
      });

      setStats(prev => {
        let { hunger, energy, happiness, intelligence, heat } = prev;
        
        if (lifeStage === 'egg') {
             heat = Math.max(prev.heat - (GAME_RULES.decayRates.heat * niniSecondsPassed), 0);
             happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * 0.1 * niniSecondsPassed), 0); 
             intelligence = Math.max(prev.intelligence - (GAME_RULES.decayRates.intelligence * 0.1 * niniSecondsPassed), 0);
             return { hunger, energy, happiness, intelligence, heat };
        }

        if (!isSleeping) {
            intelligence = Math.max(prev.intelligence - (GAME_RULES.decayRates.intelligence * niniSecondsPassed), 0);
        }
        
        if (isSleeping) {
          const energyRec = 100 / (8 * 3600); 
          energy = Math.min(prev.energy + (energyRec * niniSecondsPassed * 10), 100); 
          hunger = Math.max(prev.hunger - (GAME_RULES.decayRates.hunger * 0.5 * niniSecondsPassed), 0);
          happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * 0.1 * niniSecondsPassed), 0);
        } else {
          hunger = Math.max(prev.hunger - (GAME_RULES.decayRates.hunger * niniSecondsPassed), 0);
          energy = Math.max(prev.energy - (GAME_RULES.decayRates.energy * niniSecondsPassed), 0);
          happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * niniSecondsPassed), 0);
        }
        return { hunger, energy, happiness, intelligence, heat };
      });
      
      setFrame(prev => (prev + 1) % 3);
      
    }, pulseRateMS); 

    return () => clearInterval(timerRef.current);
  }, [isSleeping, isDead, gameConfig, isPaused, lifeStage, isAssetsLoaded, appStage, showEvolutionModal]); 

  // Hook 6: Monitor Estado
  useEffect(() => {
    if (appStage === 6) { setMessage("Fritando..."); return; }
    if (!gameConfig || appStage !== 2) return;
    if (isPaused || showEvolutionModal) { 
        if (!isDead && !showEvolutionModal) setMessage("PAUSA");
        return; 
    }
    
    const h = Math.floor(stats.hunger);
    const e = Math.floor(stats.energy);
    const hap = Math.floor(stats.happiness);
    const i = Math.floor(stats.intelligence);
    const ht = Math.floor(stats.heat);

    let isDying = false;
    let messageToDisplay = "";

    if (lifeStage === 'egg') {
        if (ht <= 0) { isDying = true; messageToDisplay = "El huevo se ha enfriado..."; }
        else if (ht < 30) messageToDisplay = "Huevo: ¡Necesito calor!";
        else if (i < 10) messageToDisplay = "Huevo: Más ninimúsica...";
        else if (hap < 10) messageToDisplay = "Huevo: ¡Consentir!";
        else messageToDisplay = "Incubando... zzz...";
    } else { 
        if (h <= 0 || hap <= 0 || e <= 0) { isDying = true; messageToDisplay = "Adiós..."; }
        else if (isSleeping) { messageToDisplay = "Durmiendo..."; }
        else if (h < 30) messageToDisplay = "Tengo hambre...";
        else if (e < 30) messageToDisplay = "Agotado...";
        else if (hap < 30) messageToDisplay = "Aburrido...";
        else if (i < 10) messageToDisplay = "Necesito un Ninilibro...";
        else messageToDisplay = lifeStage === 'adult' ? "¡Soy un adulto!" : `¡Hola, soy ${gameConfig.name}!`;
    }

    if (isDying) {
      setIsDead(true);
      setMood('dead');
      setMessage(messageToDisplay);
      clearInterval(timerRef.current); 
    } else {
      setMood(messageToDisplay.includes('Huevo') || messageToDisplay.includes('Durmiendo') ? 'neutral' : 'happy');
      setMessage(messageToDisplay);
    }
  }, [stats, isSleeping, gameConfig, lifeStage, isPaused, appStage, showEvolutionModal]);

  const getCurrentImageSrc = () => {
    if (appStage === 6 && assetUrls?.fryAnimation) {
        return assetUrls.fryAnimation[frame % assetUrls.fryAnimation.length] || assetUrls.fryAnimation[0];
    }
    if (appStage === 5 && assetUrls?.birthAnimation) {
        return assetUrls.birthAnimation[frame % assetUrls.birthAnimation.length] || assetUrls.birthAnimation[0];
    }
    if (!assetUrls) return "https://placehold.co/200x200/9ea792/000000?text=Cargando+Assets";
    
    let srcKey = "";
    const NINI_IMAGES = assetUrls; 
    
    if (mood === 'dead') {
        srcKey = NINI_IMAGES.dead[frame % 3] || NINI_IMAGES.dead[0];
    } else {
        const g = gameConfig?.gender || 'hombre'; 
        let stageImages = NINI_IMAGES.egg; 
        if (lifeStage === 'egg') stageImages = NINI_IMAGES.egg;
        else if (lifeStage === 'child') stageImages = NINI_IMAGES.child[g] || NINI_IMAGES.egg;
        else if (lifeStage === 'adult') stageImages = NINI_IMAGES.adult[g] || NINI_IMAGES.egg;
        
        if (!stageImages || stageImages.length < 3) stageImages = NINI_IMAGES.egg;
        srcKey = stageImages[frame % 3]; 
    }
    return srcKey;
  };

  const currentImg = (gameConfig || appStage === 5 || appStage === 6) ? getCurrentImageSrc() : null;

  // CORRECCIÓN VISUAL: Separamos barColor y iconColor explícitos para asegurar que Tailwind los detecte
  const StatBar = ({ icon: Icon, value, iconColor, barColor, name }) => (
    <div className="flex items-center gap-3 w-full">
      <Icon size={20} className={iconColor} />
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600 relative">
        <div className={`h-full transition-all duration-500 ${value < 30 ? 'bg-red-500' : barColor}`} style={{ width: `${value}%` }} />
        <span className="absolute right-2 top-0 text-[10px] font-black text-white/50 opacity-70 leading-none">{name}</span>
      </div>
    </div>
  );
  
  const handleStartGame = (config) => {
    if (assetUrls) {
        setAppStage(4); 
        preloadAssets(config);
    } else {
        setGameConfig(config);
        setAppStage(2); 
    }
  }

  const getEvolutionModalContent = () => {
    if (showEvolutionModal === 'child') {
        return {
            title: "ENHORABUENA",
            subtitle: (<>TU NINÍ ESTÁ CRECIENDO, YA PASÓ SU ETAPA HUEVÍPARA Y AHORA ES UN NIÑ<span className="inline-block transition-all duration-300 ease-in-out font-extrabold">{inclusiveSuffixChild}</span></>),
            message: "", 
            buttonText: "OK" 
        };
    } else if (showEvolutionModal === 'adult') {
        return {
            title: "ENHORABUENA",
            subtitle: (<>TU NINÍ ESTÁ CRECIENDO, ACABA DE DEJAR LA NIÑEZ Y AHORA ES UN ADULT<span className="inline-block transition-all duration-300 ease-in-out font-extrabold">{inclusiveSuffixAdult}</span></>),
            message: "", 
            buttonText: "OK" 
        };
    }
    return null;
  };

  const translateLifeStage = (stage, gender) => {
      if (stage === 'egg') return 'HUEVO';
      const genderMap = { 'hombre': { child: 'NIÑO', adult: 'ADULTO' }, 'mujer': { child: 'NIÑA', adult: 'ADULTA' }, 'lgtbq': { child: 'NIÑE', adult: 'ADULTE' } };
      const translations = genderMap[gender] || { child: 'NIÑO', adult: 'ADULTO' };
      return translations[stage] ? translations[stage].toUpperCase() : stage.toUpperCase();
  }

  const renderContent = () => {
    if (appStage === 2 && !gameConfig) { setAppStage(1); return null; }
    if (appStage === 0) return <Onboarding onFinish={() => setAppStage(1)} />;
    if (appStage === 1) return <StartMenu onStart={handleStartGame} />;
    
    if (appStage === 4) {
        const showButton = isAssetsLoaded; 
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-8 text-indigo-900 p-6 text-center">
                <Music size={48} className={`text-indigo-600 ${!showButton ? 'animate-pulse' : ''}`} />
                <h2 className="text-xl font-black uppercase tracking-tighter">NiniGallina está encluecada...</h2>
                <p className="text-sm">te va a dar un pequeño regalito...</p>
                {showButton && (
                    <button onClick={() => setAppStage(5)} className="mt-8 bg-pink-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-pink-700 shadow-md active:scale-95 transition-all flex items-center gap-2 text-sm">
                        Recibir regalito de NiniGallina
                    </button>
                )}
            </div>
        );
    }
    
    if (appStage === 5) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-indigo-900 p-6 text-center">
                {currentImg && <img src={currentImg} alt="Animación de Nacimiento" className={`w-full h-full object-contain`} style={{ imageRendering: 'pixelated' }} />}
                <h2 className="text-2xl font-black uppercase tracking-tighter">¡{gameConfig.name.toUpperCase()} HA NACIDO!</h2>
            </div>
        );
    }
    
    if (appStage === 6) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-red-700 p-6 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">¡FRITANDO NINÍ!</h2>
                {currentImg && <img src={currentImg} alt="Animación de Huevo Frito" className={`w-full h-full object-contain`} style={{ imageRendering: 'pixelated' }} />}
                <p className="text-sm font-bold">{message}</p>
            </div>
        );
    }

    if (appStage === 3) return <SettingsMenu onBack={closeSettings} onRestart={restart} gameConfig={gameConfig} setGameConfig={setGameConfig} />;

    const formattedTime = formatNiniTime(totalNiniTime).split('-');
    const timePart = formattedTime[1].trim().split(':');
    const hoursMinutes = `${timePart[0]}:${timePart[1]}`;
    const seconds = timePart[2];
    
    const textStyle = { color: gameConfig.textColor || TEXT_THEMES[0].hex }; 
    
    return (
        <div className="p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start opacity-70 border-b border-indigo-900/20 pb-2" style={textStyle}>
                <div className="flex flex-col">
                    <span className="text-xl font-black uppercase tracking-widest leading-tight">{gameConfig.name.toUpperCase()}</span>
                    <span className="text-sm font-bold opacity-80">{translateLifeStage(lifeStage, gameConfig.gender)}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <div>
                    <span className="text-xs font-bold block">NiniHora</span>
                    <span className="text-3xl font-black leading-none flex items-baseline">
                        {hoursMinutes}<span className="text-base font-semibold ml-1">:{seconds}</span> 
                    </span> 
                    </div>
                    <span className="text-sm font-bold opacity-60">{formatNiniTime(totalNiniTime).split('-')[0]}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={togglePause} 
                        disabled={isDead || showEvolutionModal}
                        className={`p-1 rounded transition-colors ${isPaused ? 'bg-yellow-400 text-yellow-900 animate-pulse' : 'bg-indigo-900/5 hover:bg-indigo-900/10'} ${isDead || showEvolutionModal ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ color: gameConfig.textColor }}
                      >
                          {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                      </button>
                      <div className={`flex items-center gap-2 rounded px-2 py-1 transition-colors bg-indigo-900/10`}>
                          <FastForward size={14} className={gameConfig.speed === 6 ? 'text-red-600' : ''} style={{ color: gameConfig.textColor }} />
                          <input type="range" min="1" max="6" value={gameConfig.speed} onChange={(e) => updateSpeed(e.target.value)} disabled={isPaused || showEvolutionModal} className={`w-32 h-3 bg-indigo-900/20 rounded-lg appearance-none cursor-pointer ${gameConfig.speed === 6 ? 'accent-red-600' : 'accent-indigo-600'} ${isPaused || showEvolutionModal ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </div>
                    </div>
                </div>
            </div>

            <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${animClass}`}>
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute bottom-0 w-32 h-2 bg-black/10 rounded-full"></div>
                    {currentImg && (
                    <img 
                        src={currentImg} 
                        alt="Nini" 
                        className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ${isSleeping || showEvolutionModal || appStage === 6 ? 'opacity-50' : 'opacity-100'}`}
                        style={{ imageRendering: 'pixelated' }}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/ffbb00/white?text=FALLO+IMAGEN"; }}
                    />
                    )}
                    {isSleeping && <div className="absolute -top-4 right-0 font-black text-white animate-bounce text-2xl z-30">zZz</div>}
                </div>
                <div className="mt-4 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm" style={textStyle}></div>
            </div>

            <div className="text-center font-bold text-sm h-6 truncate" style={textStyle}>{message}</div>
            
            {(showEvolutionModal && !isDead) && (() => {
                const content = getEvolutionModalContent();
                if (!content) return null;
                return (
                    <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-xs mx-auto">
                            <GraduationCap size={48} className="text-indigo-600 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-indigo-900 mb-2">{content.title}</h2>
                            <p className="text-lg font-semibold text-gray-700 mb-4">{content.subtitle}</p>
                            {content.message && <p className="text-sm text-gray-600 mb-6">{content.message}</p>}
                            <button onClick={closeEvolutionModal} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md active:scale-95 transition-all text-sm">{content.buttonText}</button>
                        </div>
                    </div>
                );
            })()}

            {isDead && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <h2 className="text-red-500 font-black text-4xl mb-2">GAME OVER</h2>
                    <p className="text-white text-sm mb-6 opacity-80">{message}</p>
                    <div className="text-xs text-gray-400 mb-6">Vivió {formatNiniTime(totalNiniTime)}</div>
                    <button onClick={restart} className="bg-white text-purple-900 px-8 py-4 rounded-full font-bold border-4 border-purple-500 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.5)]">REINICIAR</button>
                </div>
            )}
            
            {(isPaused && !showEvolutionModal) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/20 backdrop-blur-sm gap-4">
                    <button onClick={togglePause} className="p-4 rounded-full bg-indigo-900/20 backdrop-blur-md border-4 border-indigo-900/30 shadow-xl transition-transform hover:scale-110 active:scale-100">
                        <Pause size={50} className="text-indigo-900 fill-indigo-900 animate-pulse" />
                    </button>
                    <div className="text-indigo-900 font-black tracking-widest text-2xl">PAUSA</div>
                    <button onClick={togglePause} className="group flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black border-2 border-indigo-600 hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg text-xs uppercase tracking-wider">
                        <Play size={14} fill="currentColor" /> Continuar
                    </button>
                    <button onClick={restart} className="group flex items-center gap-2 bg-white text-red-500 px-6 py-2 rounded-xl font-bold border-2 border-red-500 hover:bg-red-50 transition-transform active:scale-95 shadow-lg text-xs uppercase tracking-wider">
                        <LogOut size={14} /> Salir al Menú
                    </button>
                </div>
            )}
        </div>
    );
  }

  const currentCarcasaTheme = gameConfig?.carcasaColor ? CARCASA_THEMES.find(t => t.hex === gameConfig.carcasaColor) : CARCASA_THEMES[0];
  const carcasaGradient = currentCarcasaTheme.gradient;
  const screenBgColor = gameConfig?.screenColor || SCREEN_THEMES[0].hex;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono select-none">
      <div className={`w-full max-w-md rounded-[3rem] p-6 shadow-2xl border-8 border-indigo-950 relative overflow-hidden min-h-[600px] flex flex-col`} style={{ background: carcasaGradient }} >
        <div className="absolute top-0 left-10 w-20 h-10 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
        <div className="rounded-xl border-4 border-black shadow-inner mb-6 relative flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: screenBgColor }}>
          {appStage === 2 && (
              <button onClick={openSettings} className="absolute left-4 bottom-4 w-8 h-8 bg-white/90 rounded-full border-2 border-indigo-900/30 flex items-center justify-center text-indigo-900 shadow-lg hover:scale-110 active:scale-95 transition-transform z-30">
                <Settings size={14} />
              </button>
            )}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9yZWN0Pgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>
          <div className="relative z-10 h-full w-full">{renderContent()}</div>
        </div>
        <div className="relative">
            {appStage === 2 && (
              <div className={`grid grid-cols-5 gap-2 mb-6 transition-opacity duration-500 ${isPaused || showEvolutionModal ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
                {lifeStage === 'egg' && (
                    <>
                      <button onClick={incubate} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Egg className="text-yellow-600" /></div><span className="text-white text-[10px] font-bold tracking-wider">EMPOLLAR</span>
                      </button>
                      <button onClick={leerCuento} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><BookOpen className="text-indigo-700" /></div><span className="text-white text-[10px] font-bold tracking-wider">LEER</span>
                      </button>
                      <button onClick={playMusic} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Music className="text-cyan-600" /></div><span className="text-white text-[10px] font-bold tracking-wider">MÚSICA</span>
                      </button>
                      <button onClick={consentir} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Heart className="text-pink-600" /></div><span className="text-white text-[10px] font-bold tracking-wider">CONSENTIR</span>
                      </button>
                      <button onClick={fry} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Utensils className="text-gray-700" /></div><span className="text-white text-[10px] font-bold tracking-wider">FRITAR</span>
                      </button>
                    </>
                )}
                {lifeStage !== 'egg' && (
                    <>
                      <button onClick={feed} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Utensils className="text-yellow-700" /></div><span className="text-white text-[10px] font-bold tracking-wider">COMER</span>
                      </button>
                      <button onClick={consentir} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Heart className="text-pink-600" /></div><span className="text-white text-[10px] font-bold tracking-wider">CONSENTIR</span>
                      </button>
                      <button onClick={play} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><Gamepad2 className="text-green-700" /></div><span className="text-white text-[10px] font-bold tracking-wider">JUGAR</span>
                      </button>
                      <button onClick={leerCuento} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1"><BookOpen className="text-indigo-700" /></div><span className="text-white text-[10px] font-bold tracking-wider">LEER</span>
                      </button>
                      <button onClick={toggleSleep} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                          <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                              {isSleeping ? <Moon className="text-blue-700" /> : <span className="text-blue-700 text-lg font-black italic">zZz</span>}
                          </div>
                          <span className="text-white text-[10px] font-bold tracking-wider">{isSleeping ? "DESPERTAR" : "DORMIR"}</span>
                      </button>
                    </>
                )}
              </div>
            )}
            {appStage === 2 && (
              <div className={`bg-black/30 rounded-xl p-4 space-y-3 backdrop-blur-sm transition-opacity duration-500`}>
                {lifeStage === 'egg' ? (
                    <>
                      <StatBar icon={Zap} value={stats.heat} iconColor="text-yellow-400" barColor="bg-yellow-400" name="CALOR" />
                      <StatBar icon={GraduationCap} value={stats.intelligence} iconColor="text-purple-400" barColor="bg-purple-400" name="INTELIGENCIA" />
                      <StatBar icon={Heart} value={stats.happiness} iconColor="text-pink-400" barColor="bg-pink-400" name="FELICIDAD" />
                    </>
                ) : (
                    <>
                      <StatBar icon={Utensils} value={stats.hunger} iconColor="text-pink-400" barColor="bg-pink-400" name="HAMBRE" />
                      <StatBar icon={Zap} value={stats.energy} iconColor="text-yellow-400" barColor="bg-yellow-400" name="ENERGÍA" />
                      <StatBar icon={Heart} value={stats.happiness} iconColor="text-green-400" barColor="bg-green-400" name="FELICIDAD" />
                      <StatBar icon={GraduationCap} value={stats.intelligence} iconColor="text-purple-400" barColor="bg-purple-400" name="INTELIGENCIA" />
                    </>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}