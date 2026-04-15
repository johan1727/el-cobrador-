import type { Tone } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  tones: Tone[];
  selected: Tone | null;
  onSelect: (tone: Tone) => void;
  loading?: boolean;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function ToneSelector({ tones, selected, onSelect, loading, isPro = false, onUpgrade }: Props) {
  const { t } = useTranslation();
  const blobClasses = ['blob-1', 'blob-2', 'blob-3', 'blob-4'];

  // Helper para obtener traducción de tono de forma type-safe
  const getToneTranslation = (toneId: string) => {
    const toneTranslations: Record<string, { name: string; tagline: string }> = {
      corporativo: t.tones.corporativo,
      mafioso: t.tones.mafioso,
      dramatico: t.tones.dramatico,
      poeta: t.tones.poeta,
      nerdy: t.tones.nerdy,
      yogi: t.tones.yogi,
      abuela: t.tones.abuela,
      abogado: t.tones.abogado,
      chef: t.tones.chef,
      influencer: t.tones.influencer,
      motivacional: t.tones.motivacional,
      alien: t.tones.alien,
      profesor: t.tones.profesor,
      coach: t.tones.coach,
      abogado_chicano: t.tones.abogado_chicano,
      asmr: t.tones.asmr,
      chaman: t.tones.chaman,
      fitness: t.tones.fitness,
      chef_pesado: t.tones.chef_pesado,
      politico: t.tones.politico,
      rapero: t.tones.rapero,
      abuela_sabia: t.tones.abuela_sabia,
      ia: t.tones.ia,
      narcotelenovela: t.tones.narcotelenovela,
    };
    return toneTranslations[toneId];
  };

  const localImages = [
    'corporativo', 'mafioso', 'dramatico', 'poeta', 'nerdy', 'yogi', 
    'abuela', 'abogado', 'chef', 'influencer', 'motivacional', 'alien',
    'profesor', 'coach', 'abogado_chicano', 'asmr'
  ];

  // Generate unique avatar URL for each tone
  const getAvatarUrl = (toneId: string) => {
    if (localImages.includes(toneId)) {
      return `/images/tones/${toneId}.png`;
    }

    const seeds: Record<string, string> = {
      'chaman': 'shaman',
      'fitness': 'athlete',
      'chef_pesado': 'chef2',
      'politico': 'politician',
      'rapero': 'rapper',
      'abuela_sabia': 'grandmother',
      'ia': 'robot',
      'narcotelenovela': 'narco'
    };
    const seed = seeds[toneId] || toneId;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=eaddff`;
  };

  return (
    <div className="space-y-6">
      {/* Tonos Gratuitos */}
      <h3 className="font-headline font-extrabold text-xl text-on-surface/80 flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined">mood</span>
        {t.tones.free}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {tones.filter(t => !t.isPremium).map((tone, index) => {
          const isSelected = selected?.id === tone.id;
          const blobClass = blobClasses[index % 4];
          
          return (
            <button
              key={tone.id}
              onClick={() => {
                if (!loading) {
                  onSelect(tone);
                }
              }}
              disabled={loading}
              className={`group relative ${blobClass} p-4 transition-all duration-300 text-left ${
                isSelected 
                  ? 'bg-surface-container-lowest border-[3px] border-primary scale-105 shadow-xl' 
                  : 'bg-surface-container-low hover:bg-surface-container-lowest hover:scale-105'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-on-primary px-3 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest z-20">
                  {t.tones.active}
                </div>
              )}
              
              <div className="relative h-24 mb-4 flex items-center justify-center">
                <img
                  src={getAvatarUrl(tone.id)}
                  alt={tone.name}
                  className={`w-20 h-20 transform transition-transform duration-300 ${
                    localImages.includes(tone.id) 
                      ? 'object-cover rounded-2xl shadow-lg shadow-primary/20 bg-white ring-1 ring-primary/10' 
                      : 'object-contain'
                  } group-hover:-translate-y-1 group-hover:scale-105`}
                />
              </div>
              
              <h3 className="font-headline font-bold text-lg tracking-tight leading-none mb-1 text-primary">
                {(getToneTranslation(tone.id)?.name || tone.name).toUpperCase()}
              </h3>
              <p className="font-body italic text-xs text-on-surface-variant">
                "{getToneTranslation(tone.id)?.tagline || tone.tagline}"
              </p>
            </button>
          );
        })}
      </div>

      {/* Tonos Premium */}
      <div className="mt-12 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-headline font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
            {t.tones.premium} 💎
          </h3>
          {!isPro && (
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {t.tones.exclusivePro}
            </span>
          )}
        </div>
        <p className="text-on-surface-variant text-sm mb-4">
          {t.tones.premiumDesc}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tones.filter(t => t.isPremium).map((tone, index) => {
          const isSelected = selected?.id === tone.id;
          const blobClass = blobClasses[index % 4];
          const isLocked = !isPro;
          
          return (
            <button
              key={tone.id}
              onClick={() => {
                if (isLocked) {
                  onUpgrade?.();
                } else if (!loading) {
                  onSelect(tone);
                }
              }}
              disabled={loading}
              className={`group relative ${blobClass} p-4 transition-all duration-300 text-left ${
                isSelected 
                  ? 'bg-surface-container-lowest border-[3px] border-primary scale-105 shadow-xl' 
                  : isLocked
                    ? 'bg-surface-container-low/50 cursor-pointer'
                    : 'bg-surface-container-low hover:bg-surface-container-lowest hover:scale-105'
              }`}
            >
              {/* Premium Badge */}
              {!isLocked && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest shadow-lg z-20">
                  {t.ui.proBadge}
                </div>
              )}
              
              {/* Lock Icon for Premium */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/20 backdrop-blur-[1.5px] rounded-lg z-10 transition-all group-hover:bg-surface/10 ring-1 ring-inset ring-surface/30">
                  <div className="bg-surface/90 p-3 rounded-full shadow-lg flex flex-col items-center transform group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-primary mb-1">lock</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-wide">{t.tones.unlock}</span>
                  </div>
                </div>
              )}
              
              {isSelected && !isLocked && (
                <div className="absolute -top-2 -right-2 bg-primary text-on-primary px-3 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest z-20">
                  {t.tones.active}
                </div>
              )}
              
              <div className="relative h-24 mb-4 flex items-center justify-center">
                <img
                  src={getAvatarUrl(tone.id)}
                  alt={tone.name}
                  className={`w-20 h-20 transform transition-transform duration-300 ${
                    localImages.includes(tone.id) 
                      ? 'object-cover rounded-2xl shadow-lg shadow-primary/20 bg-white ring-1 ring-primary/10' 
                      : 'object-contain'
                  } ${isLocked ? '' : 'group-hover:-translate-y-1 group-hover:scale-105'}`}
                />
              </div>
              
              <h3 className={`font-headline font-bold text-lg tracking-tight leading-none mb-1 ${
                isLocked ? 'text-on-surface-variant' : 'text-primary'
              }`}>
                {(getToneTranslation(tone.id)?.name || tone.name).toUpperCase()}
              </h3>
              <p className={`font-body italic text-xs ${
                isLocked ? 'text-on-surface-variant/50' : 'text-on-surface-variant'
              }`}>
                "{getToneTranslation(tone.id)?.tagline || tone.tagline}"
              </p>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-on-surface-variant font-medium">{t.ui.generating}</span>
        </div>
      )}
    </div>
  );
}
