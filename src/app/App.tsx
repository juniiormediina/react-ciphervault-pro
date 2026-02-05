import React, { useState } from 'react';
import { ChevronRight, Github, Lock, MousePointer2, Shield, X, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';
import { PasswordGenerator } from './components/password-generator';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

const App = () => {
  const [activeModal, setActiveModal] = useState<'privacy'|'terms'|null>(null);

  const closeModal = () => setActiveModal(null);

  return (<div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
    <Toaster position="bottom-right" theme="dark" expand={true} richColors />

    {/* Modals */}
    <AnimatePresence>
      {activeModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={closeModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{opacity: 0, scale: 0.95, y: 20}}
          animate={{opacity: 1, scale: 1, y: 0}}
          exit={{opacity: 0, scale: 0.95, y: 20}}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[80vh]"
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {activeModal === 'privacy' ? (<div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-400">Política de Privacidad</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>En <span className="text-white font-bold">CipherVault</span>, la privacidad no es una opción, es
                 nuestra base fundamental. Este portal ha sido diseñado bajo el principio de "Privacidad por
                 Diseño".</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="text-white font-medium">Procesamiento Local:</span> Todas las contraseñas se
                                                                                         generan en tu navegador
                                                                                         mediante la API Web
                                                                                         Crypto.
                </li>
                <li><span className="text-white font-medium">Sin Almacenamiento:</span> No poseemos bases de
                                                                                        datos. Tus claves nunca
                                                                                        tocan nuestros servidores.
                </li>
                <li><span className="text-white font-medium">Sin Rastreo:</span> No utilizamos cookies de rastreo
                                                                                 ni herramientas de análisis que
                                                                                 comprometan tu identidad.
                </li>
                <li><span className="text-white font-medium">Código Transparente:</span> La lógica es visible y
                                                                                         auditable, asegurando que
                                                                                         no existan puertas
                                                                                         traseras.
                </li>
              </ul>
            </div>
          </div>) : (<div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-500">Términos de Servicio</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>Al utilizar <span className="text-white font-bold">CipherVault</span>, aceptas las siguientes
                 condiciones de uso:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="text-white font-medium">Uso bajo Responsabilidad:</span> Proporcionamos las
                                                                                              herramientas, pero
                                                                                              la seguridad final
                                                                                              de tus cuentas
                                                                                              depende de cómo
                                                                                              manejes las claves
                                                                                              generadas.
                </li>
                <li><span className="text-white font-medium">Sin Garantía:</span> Aunque utilizamos estándares
                                                                                  criptográficos de alto nivel, no
                                                                                  garantizamos que el software
                                                                                  esté libre de errores.
                </li>
                <li><span className="text-white font-medium">Gratuidad:</span> El servicio es y será siempre
                                                                               gratuito para fomentar una cultura
                                                                               de ciberseguridad global.
                </li>
                <li><span className="text-white font-medium">Uso Ético:</span> Queda prohibido el uso de esta
                                                                               herramienta para cualquier
                                                                               actividad ilícita o
                                                                               malintencionada.
                </li>
              </ul>
            </div>
          </div>)}
        </motion.div>
      </div>)}
    </AnimatePresence>

    {/* Background Effect */}
    <div className="fixed inset-0 z-0">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1655036387197-566206c80980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY3liZXIlMjB0ZWNoJTIwYmFja2dyb3VuZCUyMG1pbmltYWx8ZW58MXx8fHwxNzcwMjQwMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Futuristic Background"
        className="w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]"></div>
    </div>

    <div className="relative z-10">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">Cipher<span
            className="text-cyan-400">Vault</span></span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Seguridad
          </a>
          <a href="#privacy" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Privacidad
          </a>
          <a href="#algorithm" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Algoritmo
          </a>
        </nav>

        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          onClick={() => document.getElementById('generator-section')?.scrollIntoView({behavior: 'smooth'})}
          className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-cyan-400 transition-colors"
        >
          Comenzar
        </motion.button>
      </header>

      <main>
        {/* Hero Section */}
        <section id="generator-section" className="px-6 py-20 text-center">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Lock size={12} />
            Seguridad de Grado Militar
          </motion.div>

          <motion.h1
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]"
          >
            Crea contraseñas <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">imposibles de hackear.</span>
          </motion.h1>

          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4}}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Genera claves aleatorias de alta entropía con personalización total. Minimalista, seguro y diseñado para
            el futuro de la privacidad digital.
          </motion.p>

          {/* Generator Component */}
          <PasswordGenerator />
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="text-cyan-400" />}
              title="Generación Instantánea"
              description="Algoritmos de aleatoriedad criptográficamente seguros que generan claves en milisegundos."
            />
            <FeatureCard
              id="privacy"
              icon={<Shield className="text-purple-500" />}
              title="Privacidad Total"
              description="Sin bases de datos, sin rastreo. Todo sucede en tu dispositivo y nunca sale de él."
            />
            <FeatureCard
              id="algorithm"
              icon={<MousePointer2 className="text-emerald-400" />}
              title="Personalización"
              description="Control total sobre longitud y tipos de caracteres para adaptarse a cualquier plataforma."
            />
          </div>
        </section>

        {/* Call to action */}
        <section className="px-6 py-32 text-center overflow-hidden">
          <div
            className="relative max-w-5xl mx-auto p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"></div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">¿Listo para asegurar tu identidad
                                                                              digital?</h2>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto relative z-10">Únete a miles de usuarios que ya
                                                                              protegen sus cuentas con CipherVault.
                                                                              Gratis para siempre.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={() => document.getElementById('generator-section')?.scrollIntoView({behavior: 'smooth'})}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Generar mi clave <ChevronRight size={20} />
              </button>
              <a
                href="https://github.com/juniiormediina/react-ciphervault-pro" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2">
                Ver en GitHub <Github size={20} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-cyan-400" />
            <span className="font-bold tracking-tighter text-white uppercase">CipherVault</span>
          </div>
          <p>© 2026 CipherVault. Diseñado para la seguridad absoluta.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">Twitter</a>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>);
};

const FeatureCard = ({icon, title, description, id}: {
  icon: React.ReactNode, title: string, description: string, id?: string
}) => (<motion.div
  id={id}
  whileHover={{y: -10}}
  className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
>
  <div
    className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
    {icon}
  </div>
  <h3 className="text-xl font-bold mb-3">{title}</h3>
  <p className="text-zinc-400 leading-relaxed">{description}</p>
</motion.div>);

export default App;
