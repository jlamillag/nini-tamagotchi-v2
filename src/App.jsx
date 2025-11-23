import React, { useState, useEffect, useRef, useCallback } from 'react';
// IMPORTACIONES ACTUALIZADAS: Se asegura Egg, Flame y Utensils
import { Heart, Zap, Gamepad2, Utensils, Moon, RefreshCw, Sun, Flame, Egg, Play, FastForward, AlertTriangle, Pause, LogOut, ChevronRight, Settings, BookOpen, GraduationCap, Music } from 'lucide-react';

// URL BASE OPTIMIZADA (Para la carga estable de assets desde GitHub Raw)
// EXTERNAL_ASSETS_URL_BASE se usará para el huevo y como fallback.
const EXTERNAL_ASSETS_URL_BASE = "https://raw.githubusercontent.com/jlamillag/nini-assets-v1/main/"; 
// ASSETS_RAW_PREFIX se usará para TODAS las etapas Niño y Adulto para mayor estabilidad.
const ASSETS_RAW_PREFIX = "https://raw.githubusercontent.com/jlamillag/nini-assets-v1/refs/heads/main/"; 


// --- CONFIGURACIÓN DEL JUEGO ---
const GAME_RULES = {
  timeMultipliers: { 1: 1, 2: 2, 3: 15, 4: 60, 5: 300, 6: 1800 },
  secondsPerDay: 86400, 
  // AJUSTE SOLICITADO: Etapas reducidas de 12 horas a 3 horas Niní.
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
    intelligence_consent: 10, // Consentir aumenta levemente inteligencia
    
    // ACCIONES ESPECÍFICAS DE HUEVO
    incubate_heat: 30, // Empollar sube calor
    music_heat: 15,    // Música sube calor levemente (por vibración)
    music_happiness: 15, // Música sube felicidad
    music_intelligence: 5, // Música sube inteligencia
  } 
};

// --- TEMAS DE COLOR PREDEFINIDOS (Para consistencia multiplataforma) ---
const CARCASA_THEMES = [
    { name: 'Morado Nini', hex: '#7c3aed', gradient: 'linear-gradient(to bottom right, #7c3aed, #3730a3)' }, // Default (Purple 600)
    { name: 'Negro Clásico', hex: '#1f2937', gradient: 'linear-gradient(to bottom right, #1f2937, #000000)' }, // (Gray 800)
    { name: 'Lima Power', hex: '#84cc16', gradient: 'linear-gradient(to bottom right, #84cc16, #4d7c0f)' }, // (Lime 500)
    { name: 'Aqua Fresh', hex: '#06b6d4', gradient: 'linear-gradient(to bottom right, #06b6d4, #0e7490)' }, // (Cyan 500)
    { name: 'Naranja Fuego', hex: '#f97316', gradient: 'linear-gradient(to bottom right, #f97316, #c2410c)' }, // (Orange 500)
];

const SCREEN_THEMES = [
    { name: 'Gris Clásico', hex: '#9ea792' }, // Default (Gris pantalla)
    { name: 'Verde Original', hex: '#789c67' }, // (Verde retro)
    { name: 'Blanco Puro', hex: '#ffffff' }, 
    { name: 'Negro Mate', hex: '#000000' },
    { name: 'Azul Retro', hex: '#94a3b8' }, // (Slate 400)
];

const TEXT_THEMES = [
    { name: 'Negro Oscuro', hex: '#1f2937' }, // Default (Gray 800)
    { name: 'Blanco Brillante', hex: '#ffffff' },
    { name: 'Verde Neón', hex: '#16a34a' }, // (Green 600)
    { name: 'Rojo Fuego', hex: '#ef4444' }, // (Red 500)
    { name: 'Amarillo Ciber', hex: '#facc15' }, // (Yellow 400)
];


// --- Componente: PAGINAS DE BIENVENIDA (ONBOARDING) ---
const Onboarding = ({ onFinish }) => {
    const [page, setPage] = useState(1);
    // Estado para la animacion de la ultima letra del titulo
    const [titleSuffix, setTitleSuffix] = useState('O');
    // Nuevo estado para la animacion del pronombre en la pagina 2
    const [pronounSuffix, setPronounSuffix] = useState('él');
    
    // Definicion de version y fecha de creacion
    const VERSION = "2.0"; // Versión Actualizada a 2.0
    const CREATION_DATE = "22 Nov 2025"; 
    
    // Listas de sufijos y estados de indice para la animacion
    const titleSuffixes = ['O', 'A', 'E'];
    const pronounSuffixes = ['él', 'ella', 'elle']; // Los pronombres a rotar
    const titleIndexRef = useRef(0);
    const pronounIndexRef = useRef(0);


    // Hook para la animacion del titulo
    useEffect(() => {
        // CORRECCIÓN: Si estamos en appStage 0, se ejecuta al montar. Animar en ambas páginas.
        if (page !== 1 && page !== 2) return; 

        const interval = setInterval(() => {
            titleIndexRef.current = (titleIndexRef.current + 1) % titleSuffixes.length;
            setTitleSuffix(titleSuffixes[titleIndexRef.current]);
        }, 500); // Cambia cada 500ms

        return () => clearInterval(interval);
    }, [page]); 

    // Hook para la animacion del pronombre (Pagina 2)
    useEffect(() => {
        if (page !== 2) return; // Solo animar en la segunda página

        const interval = setInterval(() => {
            pronounIndexRef.current = (pronounIndexRef.current + 1) % pronounSuffixes.length;
            setPronounSuffix(pronounSuffixes[pronounIndexRef.current]);
        }, 800); // Cambia cada 800ms para diferenciar del título

        return () => clearInterval(interval);
    }, [page]); 

    // Contenido de las paginas
    const pagesContent = {
        1: {
            // TITULO: BIENVENID[SUFFIX] AL MUNDO NINI
            title: `BIENVENID[SUFFIX] AL MUNDO NINI`, 
            // SUBTITULO: Gramática correcta
            text: "Donde haces lo que te hace falta y no haces más si no quieres.\nTu Niní también podrá ser lo que quiera, si tú le dejas.",
            buttonText: "siguiente 1/2",
        },
        2: {
            // TITULO: BIENVENID[SUFFIX] AL MUNDO NINI
            title: `BIENVENID[SUFFIX] AL MUNDO NINI`,
            // TEXTO PRINCIPAL: Gramática correcta
            text: `Tu Niní será tu compañía de ahora en adelante y tú la de`,
            buttonText: "empezar 2/2",
        },
    };

    const content = pagesContent[page];

    // Funcion para manejar el renderizado dinamico del titulo (REVERTIDO A STRING REPLACE POR ESTABILIDAD)
    const renderPageTitle = () => {
        // Usa el placeholder [SUFFIX] para inyectar la letra animada
        const displayTitle = content.title.replace('[SUFFIX]', titleSuffix);
        return (
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-indigo-900/50 pb-2">
                {displayTitle}
            </h2>
        );
    }
    
    // Funcion para manejar el renderizado dinamico del texto de la pagina 2
    const renderPageTwoText = () => {
        // CORRECCIÓN: Se renderiza el texto estático + el pronombre animado y el punto final.
        if (page === 2) {
            return (
                <div className="flex flex-col items-center">
                    <p className="text-sm font-bold whitespace-pre-line leading-relaxed mb-3">
                        {content.text}
                         {/* El pronombre animado: 'él', 'ella', 'elle' */}
                         <span className="inline-block transition-all duration-300 ease-in-out font-extrabold ml-1">
                            {pronounSuffix}
                        </span>
                        .
                    </p>
                    
                    {/* Espacio reservado para el texto extra, para evitar CLS */}
                    <div className="h-6 flex items-center justify-center">
                        {/* Se eliminan contenidos invisibles que puedan generar errores de layout */}
                    </div>

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
            onFinish(); // Pasa al StartMenu
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-between text-indigo-900 p-6 text-center">
            {/* Contenido principal centrado */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                {/* Renderizado de título dinámico para ambas páginas */}
                {renderPageTitle()}

                {/* Renderizado de contenido de página */}
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
            
            {/* Pie de pagina con Version y Fecha */}
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
  
  // FUNCION CORREGIDA para manejar el cambio de nombre
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 text-indigo-900 p-2">
      <h2 className="text-2xl font-black uppercase tracking-tighter">CREA TU NINI</h2>
      
      <div className="w-full space-y-1">
        <label className="text-[10px] font-bold ml-1">NOMBRE</label>
        {/* Usamos el handler explicito para asegurar el control de estado */}
        <input 
          type="text" 
          maxLength={10} 
          value={name} 
          onChange={handleNameChange} // Referencia a la nueva funcion
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
        // VALORES POR DEFECTO DEL JUEGO (Usando el primer elemento de cada lista de temas)
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
    // Estados locales inicializados con la configuración actual del juego
    const [newName, setNewName] = useState(gameConfig.name);
    const [newGender, setNewGender] = useState(gameConfig.gender);
    
    // Verificación simple para saber si el botón de Aceptar debe estar habilitado
    const canSave = newName.trim() !== '' && (newName !== gameConfig.name || newGender !== gameConfig.gender);

    const handleSave = () => {
        // Actualiza gameConfig si hay cambios
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
                    {/* CAMPO NOMBRE */}
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

                    {/* CAMPO GÉNERO */}
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

                {/* BOTONES */}
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
    
    // Estado para controlar el modal de edición de identidad
    const [showEditIdentity, setShowEditIdentity] = useState(false);
    
    // FUNCIONES PARA CAMBIO DE COLOR (REESTRUCTURADAS)
    // Ahora toman el valor HEX directamente
    const changeCarcasaColor = (hexColor) => {
        setGameConfig(p => ({ ...p, carcasaColor: hexColor }));
    };

    const changeScreenColor = (hexColor) => {
        setGameConfig(p => ({ ...p, screenColor: hexColor }));
    };

    const changeTextColor = (hexColor) => {
        setGameConfig(p => ({ ...p, textColor: hexColor }));
    };

    // NUEVA FUNCIÓN: RESTABLECER COLORES POR DEFECTO
    const resetColorsToDefault = () => {
        setGameConfig(p => ({
            ...p,
            carcasaColor: CARCASA_THEMES[0].hex, 
            screenColor: SCREEN_THEMES[0].hex, 
            textColor: TEXT_THEMES[0].hex
        }));
    };
    
    // Componente auxiliar para renderizar los swatches
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
                        // Si el tema tiene gradiente (solo carcasa), lo aplica.
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
                
                {/* 1. Modificar Nombre y Género */}
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
                        {/* BOTÓN RESTABLECER COLORES (Texto Cambiado) */}
                        <button 
                            onClick={resetColorsToDefault}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-100 px-3 py-1 rounded-full shadow-sm hover:shadow-md active:scale-95"
                            title="Restablecer todos los colores a los valores iniciales"
                        >
                            <RefreshCw size={12} />
                            Restablecer colores
                        </button>
                    </div>

                    {/* Selector de Color de Carcasa (Ahora Swatches) */}
                    <div className="space-y-2 mb-6">
                        <label className="text-xs font-bold">Color Principal de la Carcasa</label>
                        <ColorSwatch 
                            themes={CARCASA_THEMES} 
                            currentColor={gameConfig.carcasaColor} 
                            onChange={changeCarcasaColor} 
                        />
                    </div>
                    
                    {/* Selectores de Color de Pantalla y Texto (Ahora Swatches) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Selector de Fondo de Pantalla */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold">Fondo de Pantalla</label>
                            <ColorSwatch 
                                themes={SCREEN_THEMES} 
                                currentColor={gameConfig.screenColor} 
                                onChange={changeScreenColor} 
                            />
                        </div>
                        {/* Selector de Color de Texto */}
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
                    
                    {/* Botón de Regreso (el más grande y llamativo) */}
                    <button 
                        onClick={onBack}
                        // Botón más grande (py-4) y con sombra más profunda (shadow-xl)
                        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl active:scale-95 transition-all text-sm"
                    >
                        REGRESA A TU NINÍ ACTUAL
                    </button>
                    
                    {/* Botón de Reiniciar (el más pequeño) */}
                    <button 
                        onClick={onRestart}
                        // Botón más pequeño (py-2) y menos sombreado (shadow-md)
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-red-600 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1 text-xs"
                    >
                        REINICIAR JUEGO
                    </button>
                </div>
            </div>
            
            {/* RENDERIZADO DEL MODAL DE EDICIÓN */}
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
  
  // CORRECCION: Calculo de Horas, Minutos y SEGUNDOS
  const hours = Math.floor(remainingSeconds / 3600); // 3600 segundos en una hora
  const minutes = Math.floor((remainingSeconds % 3600) / 60); // Segundos restantes despues de horas, divididos por 60 para minutos
  const seconds = Math.floor(remainingSeconds % 60); // Los segundos restantes

  // Ahora devuelve HH:MM:SS
  return `NiniDía ${days} - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- Componente Principal ---
export default function App() {
  // 0: Onboarding, 1: StartMenu, 2: Game, 3: Settings, 4: Loading, 5: Birth Animation, 6: Fry Animation
  const [appStage, setAppStage] = useState(0); 
  // CORRECCION: Incluir valores por defecto para screenColor y textColor para evitar errores al inicio.
  const [gameConfig, setGameConfig] = useState(null);
  // ESTADO INICIAL (Incluye 'heat' y las 3 stats originales para el huevo)
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
  // Eliminamos animationTimerRef ya que la animación idle se mueve al timer principal
  const timerRef = useRef(null);
  const birthAnimationTimerRef = useRef(null); // Nuevo temporizador para la animacion de nacimiento
  const fryAnimationTimerRef = useRef(null); // NUEVO: Temporizador para la animación de fritura

  
  // Contador para sincronizar la animación IDLE cada 500ms
  // REMOVIDO: Ya no se necesita el contador de 500ms, la animación avanza con el pulso.
  // const idleFrameCounter = useRef(0);
  
  // NUEVO ESTADO: Controla la aparición del modal de evolución.
  const [showEvolutionModal, setShowEvolutionModal] = useState(null); // 'child' o 'adult'
  
  // ESTADOS PARA TEXTO INCLUSIVO ANIMADO EN EL MODAL DE ADULTO Y NIÑO
  const [inclusiveSuffixAdult, setInclusiveSuffixAdult] = useState('O');
  const [inclusiveSuffixChild, setInclusiveSuffixChild] = useState('O');
  const inclusiveSuffixes = ['O', 'E', 'A'];
  const inclusiveIndexAdultRef = useRef(0);
  const inclusiveIndexChildRef = useRef(0);
  
  // NUEVOS ESTADOS CRITICOS PARA LA PRECARGA
  const [assetUrls, setAssetUrls] = useState(null); 
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false); 

  // Hook 1: Carga inicial de URLs de Assets (se ejecuta una vez)
  useEffect(() => {
    // Definicion local y segura de las URLs (usa una funcion para evitar definir constantes fuera)
    const buildAssetUrls = (BASE_URL, RAW_PREFIX) => {
        // Genera la lista de 6 frames de la animacion de nacimiento usando el prefijo completo
        const birthFrames = Array.from({ length: 6 }, (_, i) => 
            RAW_PREFIX + `nini_birth_0${(i + 1)}.png` // Nomenclatura 01 a 06
        );
        
        // NUEVOS ASSETS: HUEVO FRITO
        const fryFrames = [
            RAW_PREFIX + `huevo_frito_00.png`,
            RAW_PREFIX + `huevo_frito_01.png`,
            RAW_PREFIX + `huevo_frito_02.png`,
        ];

        return ({
            // ASSETS DE ANIMACION DE NACIMIENTO (6 Frames)
            birthAnimation: birthFrames,
            // NUEVO: ASSETS DE ANIMACION DE FRITURA (3 Frames)
            fryAnimation: fryFrames,
            // ASSETS DE HUEVO (Egg)
            egg: [
                BASE_URL + "huevo_idle_01.png",
                BASE_URL + "huevo_idle_02.png",
                BASE_URL + "huevo_idle_03.png",
            ],
            // ASSETS DE NINEZ (Child) - INTEGRACION DE NUEVOS ASSETS CON NOMENCLATURA CORREGIDA
            child: {
                // Hombre (Nino) - Uso de 'nino'
                hombre: [
                    RAW_PREFIX + "hom_nino_idle_01.png", 
                    RAW_PREFIX + "hom_nino_idle_02.png",
                    RAW_PREFIX + "hom_nino_idle_03.png",
                ], 
                // Mujer (Nina) - Uso de 'nina'
                mujer: [
                    RAW_PREFIX + "muj_nina_idle_01.png", 
                    RAW_PREFIX + "muj_nina_idle_02.png", 
                    RAW_PREFIX + "muj_nina_idle_03.png", 
                ], 
                // LGTBIQ+ (Nine) - Uso de 'nino'
                lgtbq: [
                    RAW_PREFIX + "lgb_nino_idle_01.png", 
                    RAW_PREFIX + "lgb_nino_idle_02.png", 
                    RAW_PREFIX + "lgb_nino_idle_03.png", 
                ],
            },
            // ASSETS DE ADULTO (Adult) - AHORA USA RAW_PREFIX POR ESTABILIDAD
            adult: {
                hombre: [
                    RAW_PREFIX + "hom_adulto_idle_01.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "hom_adulto_idle_02.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "hom_adulto_idle_03.png", // CORRECCION: Usando RAW_PREFIX
                ],
                mujer: [
                    RAW_PREFIX + "muj_adulto_idle_01.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "muj_adulto_idle_02.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "muj_adulto_idle_03.png", // CORRECCION: Usando RAW_PREFIX
                ],
                lgtbq: [
                    RAW_PREFIX + "lgb_adulto_idle_01.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "lgb_adulto_idle_02.png", // CORRECCION: Usando RAW_PREFIX
                    RAW_PREFIX + "lgb_adulto_idle_03.png", // CORRECCION: Usando RAW_PREFIX
                ],
            },
            dead: [
                "https://placehold.co/200x200/333333/white?text=RIP",
                "https://placehold.co/200x200/333333/white?text=RIP",
                "https://placehold.co/200x200/333333/white?text=RIP",
            ]
        });
    }

    // Carga las URLs en el estado despues del montaje
    setAssetUrls(buildAssetUrls(EXTERNAL_ASSETS_URL_BASE, ASSETS_RAW_PREFIX));
  }, []); // Se ejecuta solo una vez al montar

  // Hook 2: Transicion de la Pantalla de Carga
  useEffect(() => {
    // Si estamos en la animacion de nacimiento (appStage 5) y esta termina
    if (appStage === 5 && frame >= assetUrls?.birthAnimation.length * 3 - 1) { // 6 frames * 3 ciclos = 18 frames totales
        // Da tiempo para que se muestre el ultimo frame
        setTimeout(() => {
            setAppStage(2); // Inicia el juego
            setFrame(0); // Reinicia el frame para la animacion idle
            // ELIMINADO: setShowEvolutionModal('child'); para que no aparezca el modal al inicio.
        }, 500);
    }
  }, [appStage, isAssetsLoaded, frame, assetUrls]);
  
  // Hook 7: Animación Inclusiva del Modal de Evolución a Adulto
  useEffect(() => {
      // Solo anima si no estamos en pausa por el modal de evolución (showEvolutionModal no es null)
      if (showEvolutionModal !== 'adult') return;

      const interval = setInterval(() => {
          inclusiveIndexAdultRef.current = (inclusiveIndexAdultRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixAdult(inclusiveSuffixes[inclusiveIndexAdultRef.current]);
      }, 700); // Rota cada 700ms

      return () => clearInterval(interval);
  }, [showEvolutionModal]);

  // NUEVO Hook 8: Animación Inclusiva del Modal de Evolución a Niño
  useEffect(() => {
      // Solo anima si no estamos en pausa por el modal de evolución (showEvolutionModal no es null)
      if (showEvolutionModal !== 'child') return;

      const interval = setInterval(() => {
          // CORRECCIÓN DE ERROR: Se completó la sintaxis de la operación.
          inclusiveIndexChildRef.current = (inclusiveIndexChildRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixChild(inclusiveSuffixes[inclusiveIndexChildRef.current]);
      }, 700); // Rota cada 700ms

      return () => clearInterval(interval);
  }, [showEvolutionModal]);
  
  // NUEVO Hook 9: Animación de Huevo Frito (Stage 6)
  useEffect(() => {
      if (fryAnimationTimerRef.current) clearInterval(fryAnimationTimerRef.current);

      if (appStage !== 6 || !assetUrls || !assetUrls.fryAnimation) return;

      const TOTAL_FRAMES_IN_SEQUENCE = assetUrls.fryAnimation.length; // 3 frames
      const TOTAL_CYCLES = 3; 
      const TOTAL_ANIMATION_FRAMES = TOTAL_FRAMES_IN_SEQUENCE * TOTAL_CYCLES; // 9 frames
      const FRAME_RATE_MS = 250; // Velocidad de la fritura

      setFrame(0); // Asegura empezar desde el primer frame
      
      fryAnimationTimerRef.current = setInterval(() => {
          setFrame(prev => {
              // Si ya estamos en el ultimo frame (8, que es 9-1), paramos el intervalo
              if (prev >= TOTAL_ANIMATION_FRAMES - 1) {
                  clearInterval(fryAnimationTimerRef.current);
                  
                  // Una vez terminada la animación, forzamos el estado de muerte, el mensaje
                  // Y SALIMOS DEL ESTADO appStage=6 para asegurar que el modal isDead se renderice SIN CONFLICTO
                  setTimeout(() => {
                      setIsDead(true);
                      setAppStage(2); // <--- CORRECCIÓN CRÍTICA: Sale de la animación de fritura (Stage 6)
                      setStats({ hunger: 0, happiness: 0, energy: 0, intelligence: 0, heat: 0 }); // Reinicia stats a cero
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


// --- FUNCION DE PRECARGA DE IMAGENES ---
  const preloadAssets = useCallback((config) => {
    // Aseguramos que assetUrls este listo
    if (!assetUrls) return;
    
    setIsAssetsLoaded(false); // Inicia el proceso de carga
    
    // 1. URLs base: Assets del Huevo, Muerte, Animacion de Nacimiento y FRITURA
    const baseUrls = [...assetUrls.egg, ...assetUrls.dead, ...assetUrls.birthAnimation, ...assetUrls.fryAnimation];

    // 2. URLs especificas del genero seleccionado
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
            img.onload = () => {
                loadedCount++; // Contar assets cargados
                resolve();
            };
            img.onerror = () => {
                console.warn(`[PRECARGA FALLIDA]: No se pudo cargar el asset: ${url}.`);
                // Continuar incluso si falla para no bloquear el juego
                resolve(); 
            };
            img.src = url;
        });
    });

    Promise.all(loadPromises).then(() => {
        // Todas las promesas (cargadas o con error) han terminado.
        console.log(`[PRECARGA COMPLETA]: ${loadedCount}/${totalCount} assets cargados (o resueltos).`);
        setGameConfig(config); // Establece la configuracion del juego ANTES de isAssetsLoaded=true
        setIsAssetsLoaded(true); // Permite el inicio de la Animacion (Hook 2)
    });
  }, [assetUrls]); // Depende de que assetUrls este disponible

  // --- Funciones de Accion de Tarea ---

  // ACCIONES DE HUEVO
  const incubate = () => {
    if(isDead || isPaused || showEvolutionModal) return; 
    setStats(p => ({
      ...p,
      heat: Math.min(p.heat + GAME_RULES.recovery.incubate_heat, 100),
      // No modificamos energy del huevo directamente aqui, solo para la logica de decaimiento
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
  
  // FUNCIÓN FRITAR MODIFICADA: Ahora activa la animación (appStage 6)
  const fry = () => {
    if (lifeStage !== 'egg' || isDead || isPaused || showEvolutionModal) {
      setMessage("Solo puedes 'fritar' al Nini cuando es un huevo.");
      return;
    }
    
    // Limpiamos el timer principal y activamos la animación de fritura (Stage 6)
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    
    setAppStage(6); // Inicia la fase de animación de fritura
    // Las stats y la muerte se establecen en Hook 9 al finalizar la animación
  }

  // ACCIONES GENERALES
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
      energy: lifeStage !== 'egg' ? Math.max(p.energy - 5, 0) : p.energy, // Cuesta energía solo si no es huevo
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
      // Si es huevo, no afecta energy/hunger, si es niño/adulto sí
      energy: lifeStage !== 'egg' ? Math.min(p.energy + GAME_RULES.recovery.read, 100) : p.energy,
      hunger: lifeStage !== 'egg' ? Math.max(p.hunger - 5, 0) : p.hunger,
    })); 
    triggerAnim('tilt'); 
    setMessage("Qué linda ninihistoria."); 
  };

  const toggleSleep = () => { if(isDead || lifeStage === 'egg' || isPaused || showEvolutionModal) return; setIsSleeping(!isSleeping); setMessage(isSleeping ? "¡A despertar!" : "Zzz..."); };
  
  // FUNCION DE PAUSA MEJORADA: Reinicia velocidad a 1 al reanudar
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
    setIsAssetsLoaded(false); // Reinicia el estado de carga
  };

  // NUEVA FUNCIÓN: Cierra el modal de evolución y reanuda el juego
  const closeEvolutionModal = () => {
      setShowEvolutionModal(null);
      // Opcional: Reanudar la velocidad pre-pausa o mantener la velocidad actual (dejamos a 1 para que el usuario retome el control)
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

  // Hook 3: Limpieza del Timer Principal
  useEffect(() => {
      // Si el juego sale de la fase 2, aseguramos la limpieza del timer principal.
      if (appStage !== 2) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
      }
      return () => {
           if (timerRef.current) clearInterval(timerRef.current);
      }
  }, [appStage]); 
  
  // Hook 4: Animacion de Nacimiento (Control de Frames de la secuencia de 6 frames, 3 ciclos)
  useEffect(() => {
      // Limpia el temporizador existente si hay uno
      if (birthAnimationTimerRef.current) {
          clearInterval(birthAnimationTimerRef.current);
      }
      
      // Solo correr si estamos en la fase de animacion de nacimiento (appStage 5)
      if (appStage !== 5 || !assetUrls || !assetUrls.birthAnimation) return;
      
      const TOTAL_FRAMES_IN_SEQUENCE = assetUrls.birthAnimation.length; // 6 frames
      const TOTAL_CYCLES = 3; 
      const TOTAL_ANIMATION_FRAMES = TOTAL_FRAMES_IN_SEQUENCE * TOTAL_CYCLES; // 18 frames
      const FRAME_RATE_MS = 1000 / TOTAL_FRAMES_IN_SEQUENCE; // 1000ms / 6 frames ≈ 167ms

      setFrame(0); // Asegura empezar desde el primer frame
      
      birthAnimationTimerRef.current = setInterval(() => {
          setFrame(prev => {
              // Si ya estamos en el ultimo frame (17, que es 18-1), paramos el intervalo
              if (prev >= TOTAL_ANIMATION_FRAMES - 1) {
                  clearInterval(birthAnimationTimerRef.current);
                  return prev;
              }
              return prev + 1;
          });
      }, FRAME_RATE_MS);

      return () => clearInterval(birthAnimationTimerRef.current);
  }, [appStage, assetUrls]); // Depende de appStage y assetUrls

  // Hook 7: Animación Inclusiva del Modal de Evolución a Adulto
  useEffect(() => {
      if (showEvolutionModal !== 'adult') return;

      const interval = setInterval(() => {
          inclusiveIndexAdultRef.current = (inclusiveIndexAdultRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixAdult(inclusiveSuffixes[inclusiveIndexAdultRef.current]);
      }, 700); // Rota cada 700ms

      return () => clearInterval(interval);
  }, [showEvolutionModal]);

  // NUEVO Hook 8: Animación Inclusiva del Modal de Evolución a Niño
  useEffect(() => {
      // Solo anima si no estamos en pausa por el modal de evolución (showEvolutionModal no es null)
      if (showEvolutionModal !== 'child') return;

      const interval = setInterval(() => {
          // CORRECCIÓN DE ERROR: Se completó la sintaxis de la operación.
          inclusiveIndexChildRef.current = (inclusiveIndexChildRef.current + 1) % inclusiveSuffixes.length;
          setInclusiveSuffixChild(inclusiveSuffixes[inclusiveIndexChildRef.current]);
      }, 700); // Rota cada 700ms

      return () => clearInterval(interval);
  }, [showEvolutionModal]);


  // Hook 5: Logica del Juego (Decaimiento, Evolucion y ANIMACION IDLE SINCRONIZADA)
  useEffect(() => {
    // El juego solo debe correr si la CONFIGURACION ha iniciado Y los ASSETS están cargados Y estamos en la fase de juego (appStage 2).
    if (!gameConfig || isDead || !isAssetsLoaded || appStage !== 2 || showEvolutionModal) return;
    
    // --- 1. DETERMINAR LA FRECUENCIA DE PULSO VISUAL (pulseRateMS) ---
    const multiplier = GAME_RULES.timeMultipliers[gameConfig?.speed] || 1;
    let pulseRateMS;

    if (multiplier <= 15) { // Speeds 1, 2, 3 (Multipliers 1, 2, 15)
        pulseRateMS = 500; // Pulso cada 0.5s (lento, visible)
    } else if (multiplier <= 300) { // Speeds 4, 5 (Multipliers 60, 300)
        pulseRateMS = 200; // Pulso cada 0.2s (más rápido)
    } else { // Speed 6 (Multiplier 1800)
        pulseRateMS = 50; // Pulso cada 0.05s (máxima velocidad)
    }
    
    // Limpiamos el timer anterior antes de crear uno nuevo (necesario al cambiar dependencias)
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (isPaused) return;

      // niniSecondsPassed es la cantidad de segundos Nini simulados en CADA PULSO
      const niniSecondsPassed = (pulseRateMS / 1000) * multiplier; 
      
      let newLifeStage = lifeStage;

      // --- 1. AVANCE DE TIEMPO Y EVOLUCIÓN ---
      setTotalNiniTime(prev => {
        const newTime = prev + niniSecondsPassed;
        
        // LOGICA DE EVOLUCION
        const eggDuration = GAME_RULES.stageDurations.egg;
        const childDuration = GAME_RULES.stageDurations.child;
        const currentStage = lifeStage;

        if (newTime < eggDuration) {
            newLifeStage = 'egg';
        } else if (newTime < (eggDuration + childDuration)) {
            newLifeStage = 'child';
        } else {
            newLifeStage = 'adult';
        }
        
        // CORRECCION CRITICA: Detectar el cambio de etapa y FORZAR el reinicio del frame
        if (newLifeStage !== currentStage) {
            setLifeStage(newLifeStage);
            setFrame(0); // <--- FUERZA AL SELECTOR DE IMAGEN A COMENZAR EN FRAME 01 DE LA NUEVA FASE
            
            // NUEVO: PAUSAR EL JUEGO Y MOSTRAR EL MODAL
            setIsPaused(true);
            setShowEvolutionModal(newLifeStage); // 'child' o 'adult'
        }

        return newTime;
      });

      // --- 2. DECAIMIENTO DE ESTADÍSTICAS ---
      setStats(prev => {
        let { hunger, energy, happiness, intelligence, heat } = prev;
        
        // --- DECAIMIENTO ESPECIFICO DEL HUEVO (Calor, Intel, Felicidad) ---
        if (lifeStage === 'egg') {
             // Decaimiento del calor es crucial
             heat = Math.max(prev.heat - (GAME_RULES.decayRates.heat * niniSecondsPassed), 0);
             happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * 0.1 * niniSecondsPassed), 0); 
             intelligence = Math.max(prev.intelligence - (GAME_RULES.decayRates.intelligence * 0.1 * niniSecondsPassed), 0);
             return { hunger, energy, happiness, intelligence, heat };
        }
        // --- FIN DECAIMIENTO HUEVO ---

        // --- DECAIMIENTO GENERAL (NINO/ADULTO) ---
        if (!isSleeping) {
            intelligence = Math.max(prev.intelligence - (GAME_RULES.decayRates.intelligence * niniSecondsPassed), 0);
        }
        
        if (isSleeping) {
          const energyRec = 100 / (8 * 3600); 
          // Recuperación de Energía (ajustada a la recuperación por niniSecondsPassed, pero con un factor mayor por dormir)
          energy = Math.min(prev.energy + (energyRec * niniSecondsPassed * 10), 100); 
          
          // Decaimiento lento mientras duerme
          hunger = Math.max(prev.hunger - (GAME_RULES.decayRates.hunger * 0.5 * niniSecondsPassed), 0);
          happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * 0.1 * niniSecondsPassed), 0);
        } else {
          // Decaimiento normal
          hunger = Math.max(prev.hunger - (GAME_RULES.decayRates.hunger * niniSecondsPassed), 0);
          energy = Math.max(prev.energy - (GAME_RULES.decayRates.energy * niniSecondsPassed), 0);
          happiness = Math.max(prev.happiness - (GAME_RULES.decayRates.happiness * niniSecondsPassed), 0);
        }
        return { hunger, energy, happiness, intelligence, heat };
      });
      
      // --- 3. ANIMACIÓN IDLE (Avanza en cada pulso VISUAL) ---
      setFrame(prev => (prev + 1) % 3);
      
    }, pulseRateMS); // El delay es ahora dinámico!

    return () => clearInterval(timerRef.current);
  }, [isSleeping, isDead, gameConfig, isPaused, lifeStage, isAssetsLoaded, appStage, showEvolutionModal]); 


  // Hook 6: Monitor de Estado (Chequeo de Muerte/Hambre/Mensajes)
  useEffect(() => {
    // Si la animación de fritura está activa (Stage 6), detenemos el chequeo normal.
    if (appStage === 6) {
        setMessage("Fritando..."); // Mensaje de transición
        return;
    }

    if (!gameConfig || appStage !== 2) return;
    // AÑADIDO: No actualizar mensajes de estado si el juego está en pausa por un modal de evolución.
    if (isPaused || showEvolutionModal) { 
        if (!isDead && !showEvolutionModal) setMessage("PAUSA");
        return; 
    }
    
    const h = Math.floor(stats.hunger);
    const e = Math.floor(stats.energy);
    const hap = Math.floor(stats.happiness);
    const i = Math.floor(stats.intelligence);
    const ht = Math.floor(stats.heat);

    // CHEQUEO DE MUERTE
    let isDying = false;
    let messageToDisplay = "";

    if (lifeStage === 'egg') {
        if (ht <= 0) { isDying = true; messageToDisplay = "El huevo se ha enfriado..."; }
        else if (ht < 30) messageToDisplay = "Huevo: ¡Necesito calor!";
        else if (i < 10) messageToDisplay = "Huevo: Más ninimúsica...";
        else if (hap < 10) messageToDisplay = "Huevo: ¡Consentir!";
        else messageToDisplay = "Incubando... zzz...";
    } else { // NINO / ADULTO
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
      clearInterval(timerRef.current); // Detiene el timer principal
    } else {
      setMood(messageToDisplay.includes('Huevo') || messageToDisplay.includes('Durmiendo') ? 'neutral' : 'happy');
      setMessage(messageToDisplay);
    }
  }, [stats, isSleeping, gameConfig, lifeStage, isPaused, appStage, showEvolutionModal]);


// --- SELECTOR DE IMAGEN SEGURO ---
  const getCurrentImageSrc = () => {
    // 1. Caso de la Animacion de Fritura (appStage 6)
    if (appStage === 6 && assetUrls && assetUrls.fryAnimation) {
        const sequenceLength = assetUrls.fryAnimation.length; // 3 frames
        // Usamos el operador modulo para ciclar entre los 3 frames, incluso si el contador llega a 9
        const frameIndexInSequence = frame % sequenceLength;
        return assetUrls.fryAnimation[frameIndexInSequence] || assetUrls.fryAnimation[0];
    }
    
    // 2. Caso de la Animacion de Nacimiento (appStage 5)
    if (appStage === 5 && assetUrls && assetUrls.birthAnimation) {
        const sequenceLength = assetUrls.birthAnimation.length; // 6 frames
        // Utilizamos el operador modulo (%) para repetir la secuencia de 6 frames,
        // aunque el contador 'frame' llegue hasta 17 (18 frames totales).
        const frameIndexInSequence = frame % sequenceLength;
        return assetUrls.birthAnimation[frameIndexInSequence] || assetUrls.birthAnimation[0];
    }
    
    // 3. Casos normales (Idle, Dead)
    if (!assetUrls) {
        return "https://placehold.co/200x200/9ea792/000000?text=Cargando+Assets";
    }
    
    let srcKey = "";
    const NINI_IMAGES = assetUrls; // Usa el estado
    
    if (mood === 'dead') {
        // Si ya está muerto, usa el placeholder RIP.
        srcKey = NINI_IMAGES.dead[frame % 3] || NINI_IMAGES.dead[0];
    } else {
        const g = gameConfig?.gender || 'hombre'; 
        let stageImages = NINI_IMAGES.egg; // Default a huevo (seguro)

        if (lifeStage === 'egg') {
            stageImages = NINI_IMAGES.egg;
        } else if (lifeStage === 'child') {
            // AHORA USA LOS ASSETS DE NINEZ PROPIOS
            stageImages = NINI_IMAGES.child[g] || NINI_IMAGES.egg;
        } else if (lifeStage === 'adult') {
            stageImages = NINI_IMAGES.adult[g] || NINI_IMAGES.egg;
        }
        
        // REFUERZO DE ANIMACION (Version Limpia): Si el array no tiene 3 elementos, usa el Huevo.
        if (!stageImages || stageImages.length < 3) {
            stageImages = NINI_IMAGES.egg;
        }

        // SELECCION DE FRAME: Asegura que el frame siempre esté dentro del rango [0, 2]
        srcKey = stageImages[frame % 3]; 
    }

    return srcKey;
  };

  const currentImg = (gameConfig || appStage === 5 || appStage === 6) ? getCurrentImageSrc() : null;

  const StatBar = ({ icon: Icon, value, color, name }) => (
    <div className="flex items-center gap-3 w-full">
      <Icon size={20} className={color} />
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600 relative">
        <div className={`h-full transition-all duration-500 ${value < 30 ? 'bg-red-500' : color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }} />
        {/* Nombre de la barra para claridad, especialmente en HUEVO */}
        <span className="absolute right-2 top-0 text-[10px] font-black text-white/50 opacity-70 leading-none">{name}</span>
      </div>
    </div>
  );
  
  // Modificacion del handler de inicio para usar la precarga
  const handleStartGame = (config) => {
    if (assetUrls) {
        // En lugar de ir directamente al juego, inicia la precarga
        setAppStage(4); // Pantalla de Carga
        preloadAssets(config);
    } else {
        // Fallback si assetUrls aun no esta listo (deberia ser raro)
        console.error("Asset URLs not ready for preload.");
        setGameConfig(config);
        setAppStage(2); 
    }
  }

  // Helper para el contenido del modal de evolución
  const getEvolutionModalContent = () => {
    if (showEvolutionModal === 'child') {
        // MENSAJE DE HUEVO A NIÑO
        return {
            title: "ENHORABUENA",
            subtitle: (
                <>
                    TU NINÍ ESTÁ CRECIENDO, YA PASÓ SU ETAPA HUEVÍPARA Y AHORA ES UN NIÑ
                    <span className="inline-block transition-all duration-300 ease-in-out font-extrabold">
                        {inclusiveSuffixChild}
                    </span>
                </>
            ),
            message: "", // Mensaje vacío
            buttonText: "OK" 
        };
    } else if (showEvolutionModal === 'adult') {
        // MENSAJE DE NIÑO A ADULTO
        return {
            title: "ENHORABUENA",
            subtitle: (
                <>
                    TU NINÍ ESTÁ CRECIENDO, ACABA DE DEJAR LA NIÑEZ Y AHORA ES UN ADULT
                    <span className="inline-block transition-all duration-300 ease-in-out font-extrabold">
                        {inclusiveSuffixAdult}
                    </span>
                </>
            ),
            message: "", // Mensaje vacío
            buttonText: "OK" 
        };
    }
    return null;
  };

  // Traducción del lifeStage de inglés a español, ahora depende del género
  const translateLifeStage = (stage, gender) => {
      if (stage === 'egg') return 'HUEVO';
      
      const genderMap = {
          'hombre': { child: 'NIÑO', adult: 'ADULTO' },
          'mujer': { child: 'NIÑA', adult: 'ADULTA' },
          'lgtbq': { child: 'NIÑE', adult: 'ADULTE' },
      };

      // Si no hay gameConfig (ej. en Onboarding), o si el stage no es reconocido, usa el stage en mayúsculas como fallback.
      const translations = genderMap[gender] || { child: 'NIÑO', adult: 'ADULTO' };
      
      return translations[stage] ? translations[stage].toUpperCase() : stage.toUpperCase();
  }


  const renderContent = () => {
    // CRITICAL STABILITY CHECK: Prevents screen crash if appStage is 2 but state is still initializing
    if (appStage === 2 && !gameConfig) {
        setAppStage(1); // Force back to start menu if state is corrupted
        return null;
    }

    if (appStage === 0) {
      return <Onboarding onFinish={() => setAppStage(1)} />;
    }

    if (appStage === 1) {
      return <StartMenu onStart={handleStartGame} />;
    }
    
    // PANTALLA DE CARGA (Stage 4) - CON EL NUEVO MENSAJE
    if (appStage === 4) {
        const showButton = isAssetsLoaded; // Muestra el boton cuando la carga ha terminado

        return (
            <div className="h-full flex flex-col items-center justify-center space-y-8 text-indigo-900 p-6 text-center">
                <Music size={48} className={`text-indigo-600 ${!showButton ? 'animate-pulse' : ''}`} />
                <h2 className="text-xl font-black uppercase tracking-tighter">
                    NiniGallina está encluecada...
                </h2>
                <p className="text-sm">te va a dar un pequeño regalito...</p>
                
                {showButton && (
                    <button
                        onClick={() => setAppStage(5)} // Pasa a la animacion
                        className="mt-8 bg-pink-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-pink-700 shadow-md active:scale-95 transition-all flex items-center gap-2 text-sm"
                    >
                        Recibir regalito de NiniGallina
                    </button>
                )}
            </div>
        );
    }
    
    // NUEVA PANTALLA DE ANIMACION DE NACIMIENTO (Stage 5)
    if (appStage === 5) {
        // El hook 2 maneja la transicion a appStage 2 (Game) cuando la animacion termina.
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-indigo-900 p-6 text-center">
                {currentImg && (
                    <img 
                        src={currentImg} 
                        alt="Animación de Nacimiento" 
                        className={`w-full h-full object-contain`}
                        style={{ imageRendering: 'pixelated' }}
                    />
                )}
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                    ¡{gameConfig.name.toUpperCase()} HA NACIDO!
                </h2>
            </div>
        );
    }
    
    // NUEVA PANTALLA DE ANIMACION DE FRITURA (Stage 6)
    if (appStage === 6) {
        // Mientras la animación de fritura está en curso, solo se muestra la animación.
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-red-700 p-6 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                    ¡FRITANDO NINÍ!
                </h2>
                {currentImg && (
                    <img 
                        src={currentImg} 
                        alt="Animación de Huevo Frito" 
                        className={`w-full h-full object-contain`}
                        style={{ imageRendering: 'pixelated' }}
                    />
                )}
                <p className="text-sm font-bold">{message}</p>
            </div>
        );
    }


    if (appStage === 3) {
      return <SettingsMenu onBack={closeSettings} onRestart={restart} gameConfig={gameConfig} setGameConfig={setGameConfig} />;
    }

    // appStage === 2 (Game)
    // Se ha movido el boton de settings fuera del area de renderContent
    
    // Extracción y formato de NiniTiempo
    const formattedTime = formatNiniTime(totalNiniTime).split('-');
    const timePart = formattedTime[1].trim().split(':');
    const hoursMinutes = `${timePart[0]}:${timePart[1]}`;
    const seconds = timePart[2];
    
    // VARIABLES DE COLOR DINÁMICAS
    const screenBgStyle = { backgroundColor: gameConfig.screenColor || SCREEN_THEMES[0].hex };
    const textStyle = { color: gameConfig.textColor || TEXT_THEMES[0].hex }; // Default a gray-800
    
    return (
        <div className="p-4 h-full flex flex-col justify-between">
            {/* HEADER */}
            {/* Aplicar textStyle aquí y a los hijos que heredan el color */}
            <div className="flex justify-between items-start opacity-70 border-b border-indigo-900/20 pb-2" style={textStyle}>
                <div className="flex flex-col">
                    {/* AUMENTO DE TAMAÑO Y REESTRUCTURACION DEL RELOJ */}
                    <span className="text-xl font-black uppercase tracking-widest leading-tight">{gameConfig.name.toUpperCase()}</span>
                    {/* CAMBIO: Mostrar lifeStage traducido a español, pasando el género */}
                    <span className="text-sm font-bold opacity-80">{translateLifeStage(lifeStage, gameConfig.gender)}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <div>
                    {/* CAMBIO DE TEXTO: NiniTiempo -> NiniHora */}
                    <span className="text-xs font-bold block">NiniHora</span>
                    
                    {/* IMPLEMENTACIÓN DEL SEGÚNDERO (text-3xl para H:M, text-base para SS) */}
                    <span className="text-3xl font-black leading-none flex items-baseline">
                        {/* Horas y Minutos - Grande */}
                        {hoursMinutes}
                        {/* Segundero agregado - Más pequeño y separado por : */}
                        <span className="text-base font-semibold ml-1">:{seconds}</span> 
                    </span> 
                    </div>
                    
                    {/* INDICADOR DE DÍA - CAMBIO DE TEXTO: DÍA -> NiniDía */}
                    <span className="text-sm font-bold opacity-60">{formatNiniTime(totalNiniTime).split('-')[0]}</span>
                    
                    {/* CONTROLES DE VELOCIDAD */}
                    <div className="flex items-center gap-2 mt-2">
                      {/* BOTON DE PAUSA/CONTINUAR EN EL HEADER */}
                      <button 
                        onClick={togglePause} 
                        disabled={isDead || showEvolutionModal}
                        // Botón ahora usa el color de texto para su ícono y el color de pantalla para el fondo
                        className={`p-1 rounded transition-colors ${isPaused ? 'bg-yellow-400 text-yellow-900 animate-pulse' : 'bg-indigo-900/5 hover:bg-indigo-900/10'} ${isDead || showEvolutionModal ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ color: gameConfig.textColor }}
                      >
                          {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                      </button>
                      
                      {/* SLIDER DE VELOCIDAD MEJORADO Y GRANDE */}
                      <div className={`flex items-center gap-2 rounded px-2 py-1 transition-colors bg-indigo-900/10`}>
                          <FastForward size={14} className={gameConfig.speed === 6 ? 'text-red-600' : ''} style={{ color: gameConfig.textColor }} />
                          {/* AUMENTO DE EXTENSION DEL SLIDER: w-32 (de w-24) y GROSOR (h-3 de h-2) */}
                          <input type="range" min="1" max="6" value={gameConfig.speed} onChange={(e) => updateSpeed(e.target.value)} disabled={isPaused || showEvolutionModal} className={`w-32 h-3 bg-indigo-900/20 rounded-lg appearance-none cursor-pointer ${gameConfig.speed === 6 ? 'accent-red-600' : 'accent-indigo-600'} ${isPaused || showEvolutionModal ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </div>
                    </div>
                    
                    {/* ELIMINADO: INDICADOR DE EQUIVALENCIA DE TIEMPO HUMANO */}
                </div>
            </div>

            {/* AREA DE IMAGEN */}
            <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${animClass}`}>
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Fondo de sombra simple y plana */}
                    <div className="absolute bottom-0 w-32 h-2 bg-black/10 rounded-full"></div>
                    
                    {currentImg && (
                    <img 
                        src={currentImg} 
                        alt="Nini" 
                        // CAMBIO 1: Opacidad reducida a 50% al dormir para un efecto más oscuro
                        className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ${isSleeping || showEvolutionModal || appStage === 6 ? 'opacity-50' : 'opacity-100'}`}
                        style={{ imageRendering: 'pixelated' }}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src="https://placehold.co/200x200/ffbb00/white?text=FALLO+IMAGEN"; // Actualizado el texto de fallback
                        }}
                    />
                    )}
                    {/* CAMBIO 1: El texto zZz es blanco para simular oscuridad */}
                    {isSleeping && <div className="absolute -top-4 right-0 font-black text-white animate-bounce text-2xl z-30">zZz</div>}
                </div>
                
                {/* Aplicar textStyle aquí */}
                <div className="mt-4 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm" style={textStyle}>
                    {/* Se ha movido el lifeStage aqui: */}
                    {/* {lifeStage === 'egg' ? 'HUEVO' : (lifeStage === 'child' ? 'NINO' : 'ADULTO')} */}
                </div>
            </div>

            {/* Aplicar textStyle al mensaje central */}
            <div className="text-center font-bold text-sm h-6 truncate" style={textStyle}>{message}</div>
            
            {/* MODAL DE EVOLUCIÓN (NUEVO) */}
            {(showEvolutionModal && !isDead) && (() => {
                const content = getEvolutionModalContent();
                if (!content) return null;

                return (
                    <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-xs mx-auto">
                            <GraduationCap size={48} className="text-indigo-600 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-indigo-900 mb-2">
                                {content.title}
                            </h2>
                            <p className="text-lg font-semibold text-gray-700 mb-4">
                                {content.subtitle}
                            </p>
                            {/* CAMBIO: Se muestra el mensaje SOLO si no está vacío */}
                            {content.message && (
                                <p className="text-sm text-gray-600 mb-6">
                                    {content.message}
                                </p>
                            )}
                            <button 
                                onClick={closeEvolutionModal} 
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md active:scale-95 transition-all text-sm"
                            >
                                {content.buttonText}
                            </button>
                        </div>
                    </div>
                );
            })()}

            {isDead && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <h2 className="text-red-500 font-black text-4xl mb-2">GAME OVER</h2>
                    {/* Mensaje dinámico, incluye el mensaje de fritura si aplica */}
                    <p className="text-white text-sm mb-6 opacity-80">{message}</p>
                    <div className="text-xs text-gray-400 mb-6">Vivió {formatNiniTime(totalNiniTime)}</div>
                    {/* Botón de REINICIAR */}
                    <button onClick={restart} className="bg-white text-purple-900 px-8 py-4 rounded-full font-bold border-4 border-purple-500 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.5)]">REINICIAR</button>
                </div>
            )}
            
            {/* MODAL DE PAUSA NORMAL (Solo si NO hay modal de evolución) */}
            {(isPaused && !showEvolutionModal) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/20 backdrop-blur-sm gap-4">
                    {/* BOTÓN DE PAUSA GRANDE PARA CONTINUAR */}
                    <button 
                        onClick={togglePause}
                        className="p-4 rounded-full bg-indigo-900/20 backdrop-blur-md border-4 border-indigo-900/30 shadow-xl transition-transform hover:scale-110 active:scale-100"
                    >
                        <Pause size={50} className="text-indigo-900 fill-indigo-900 animate-pulse" />
                    </button>
                    
                    <div className="text-indigo-900 font-black tracking-widest text-2xl">PAUSA</div>

                    {/* BOTÓN GRANDE DE CONTINUAR (MANTENIDO) */}
                    <button 
                    onClick={togglePause}
                    className="group flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black border-2 border-indigo-600 hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg text-xs uppercase tracking-wider"
                    >
                    <Play size={14} fill="currentColor" />
                    Continuar
                    </button>
                    <button 
                    onClick={restart}
                    className="group flex items-center gap-2 bg-white text-red-500 px-6 py-2 rounded-xl font-bold border-2 border-red-500 hover:bg-red-50 transition-transform active:scale-95 shadow-lg text-xs uppercase tracking-wider"
                    >
                    <LogOut size={14} />
                    Salir al Menú
                    </button>
                </div>
            )}
        </div>
    );
  }

  // --- FUNCION DE RENDERIZADO PRINCIPAL ---
  // CORRECCION DE ESTABILIDAD: Asegurar que el objeto THEMES y gameConfig existan antes de renderizar
  const currentCarcasaTheme = gameConfig?.carcasaColor 
    ? CARCASA_THEMES.find(t => t.hex === gameConfig.carcasaColor) 
    : CARCASA_THEMES[0];
  
  const carcasaGradient = currentCarcasaTheme.gradient;
  const screenBgColor = gameConfig?.screenColor || SCREEN_THEMES[0].hex;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono select-none">
      {/* MODIFICACIÓN CLAVE: Carcasa usa gradiente dinámico. */}
      <div className={`w-full max-w-md rounded-[3rem] p-6 shadow-2xl border-8 border-indigo-950 relative overflow-hidden min-h-[600px] flex flex-col`}
           style={{ background: carcasaGradient }} 
      >
        <div className="absolute top-0 left-10 w-20 h-10 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>

        {/* MODIFICACIÓN CRÍTICA: Aquí se aplica el color de fondo de pantalla dinámico */}
        <div 
          className="rounded-xl border-4 border-black shadow-inner mb-6 relative flex-1 flex flex-col overflow-hidden"
          style={{ backgroundColor: screenBgColor }}
        >
          {/* BOTON DE CONFIGURACION - SOLUCION ESTABLE (Anclado al borde del marco gris) */}
          {appStage === 2 && (
              <button 
                onClick={openSettings} 
                // Posicion: 16px desde la izquierda (left-4), 16px desde el fondo (bottom-4) del marco gris.
                className="absolute left-4 bottom-4 w-8 h-8 bg-white/90 rounded-full border-2 border-indigo-900/30 flex items-center justify-center text-indigo-900 shadow-lg hover:scale-110 active:scale-95 transition-transform z-30"
              >
                <Settings size={14} />
              </button>
            )}

          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9yZWN0Pgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 h-full w-full">
            {renderContent()}
          </div>
        </div>

        {/* CONTROLES DE ACCIÓN Y BARRAS */}
        <div className="relative">
            {/* CONTROLES DE ACCIÓN (SOLO EN JUEGO) */}
            {appStage === 2 && (
              <div className={`grid grid-cols-5 gap-2 mb-6 transition-opacity duration-500 ${isPaused || showEvolutionModal ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
                
                {/* TAREAS DE HUEVO */}
                {lifeStage === 'egg' && (
                    <>
                      {/* BOTON EMPOLLAR: AHORA USA EGG (Huevo) */}
                      <button onClick={incubate} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Egg className="text-yellow-600" /> {/* Ícono de huevo para Empollar */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">EMPOLLAR</span>
                      </button>
                      <button onClick={leerCuento} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <BookOpen className="text-indigo-700" /> {/* Ícono índigo para LEER */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">LEER</span>
                      </button>
                      <button onClick={playMusic} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Music className="text-cyan-600" /> {/* Ícono cyan para MÚSICA */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">MÚSICA</span>
                      </button>
                      <button onClick={consentir} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Heart className="text-pink-600" /> {/* Ícono rosa para CONSENTIR */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">CONSENTIR</span>
                      </button>
                      {/* BOTON FRITAR: AHORA USA UTENSILS (Cubiertos) */}
                      <button onClick={fry} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Utensils className="text-gray-700" /> {/* Ícono de cubiertos para Fritar */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">FRITAR</span>
                      </button>
                    </>
                )}
                
                {/* TAREAS DE NINO/ADULTO */}
                {lifeStage !== 'egg' && (
                    <>
                      {/* BOTON COMER: Usa Utensils (Tenedor y cuchillo) - COINCIDE CON FRITAR, pero solo se ve aquí */}
                      <button onClick={feed} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Utensils className="text-yellow-700" /> {/* Ícono amarillo para COMER */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">COMER</span>
                      </button>
                      <button onClick={consentir} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Heart className="text-pink-600" /> {/* Ícono rosa para CONSENTIR */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">CONSENTIR</span>
                      </button>
                      <button onClick={play} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <Gamepad2 className="text-green-700" /> {/* Ícono verde para JUGAR */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">JUGAR</span>
                      </button>
                      <button onClick={leerCuento} disabled={isDead || isSleeping || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                          <BookOpen className="text-indigo-700" /> {/* Ícono índigo para LEER */}
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-wider">LEER</span>
                      </button>
                      
                      {/* Botón Dormir - Ícono 'zZz' y color azul sutil */}
                      <button onClick={toggleSleep} disabled={isDead || isPaused || showEvolutionModal} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                          <div className="w-12 h-12 bg-gray-200 rounded-full border-b-4 border-gray-400 flex items-center justify-center shadow-lg group-active:border-b-0 group-active:translate-y-1">
                              {/* CAMBIO 2: Alterna entre el ícono ZzZ y el de la Luna */}
                              {isSleeping ? <Moon className="text-blue-700" /> : <span className="text-blue-700 text-lg font-black italic">zZz</span>}
                          </div>
                          {/* CAMBIO 2: Alterna entre DORMIR y DESPERTAR */}
                          <span className="text-white text-[10px] font-bold tracking-wider">{isSleeping ? "DESPERTAR" : "DORMIR"}</span>
                      </button>
                    </>
                )}
              </div>
            )}

            {/* BARRAS DE ESTADO (DINÁMICO) */}
            {appStage === 2 && (
              <div className={`bg-black/30 rounded-xl p-4 space-y-3 backdrop-blur-sm transition-opacity duration-500`}>
                {lifeStage === 'egg' ? (
                    // BARRAS DE HUEVO
                    <>
                      <StatBar icon={Zap} value={stats.heat} color="text-yellow-400" name="CALOR" />
                      <StatBar icon={GraduationCap} value={stats.intelligence} color="text-purple-400" name="INTELIGENCIA" />
                      <StatBar icon={Heart} value={stats.happiness} color="text-pink-400" name="FELICIDAD" />
                    </>
                ) : (
                    // BARRAS DE NINO/ADULTO
                    <>
                      <StatBar icon={Utensils} value={stats.hunger} color="text-pink-400" name="HAMBRE" />
                      <StatBar icon={Zap} value={stats.energy} color="text-yellow-400" name="ENERGÍA" />
                      <StatBar icon={Heart} value={stats.happiness} color="text-green-400" name="FELICIDAD" />
                      <StatBar icon={GraduationCap} value={stats.intelligence} color="text-purple-400" name="INTELIGENCIA" />
                    </>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}