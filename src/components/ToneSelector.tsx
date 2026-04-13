import type { Tone } from '../types';

interface Props {
  tones: Tone[];
  selected: Tone | null;
  onSelect: (tone: Tone) => void;
  loading?: boolean;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function ToneSelector({ tones, selected, onSelect, loading, isPro = false, onUpgrade }: Props) {
  const blobClasses = ['blob-1', 'blob-2', 'blob-3', 'blob-4'];

  // Generate unique avatar URL for each tone
  const getAvatarUrl = (toneId: string) => {
    const seeds: Record<string, string> = {
      'corporativo': 'businessman',
      'mafioso': 'mobster',
      'dramatico': 'actor',
      'poeta': 'poet',
      'nerdy': 'nerd',
      'yogi': 'yogi',
      'abuela': 'grandma',
      'abogado': 'lawyer',
      'chef': 'chef',
      'influencer': 'influencer',
      'motivacional': 'coach',
      'alien': 'alien',
      'profesor': 'teacher',
      'coach': 'trainer',
      'abogado_chicano': 'lawyer2',
      'asmr': 'headphones',
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tones.map((tone, index) => {
          const isSelected = selected?.id === tone.id;
          const blobClass = blobClasses[index % 4];
          const isPremium = tone.isPremium;
          const isLocked = isPremium && !isPro;
          
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
                    ? 'bg-surface-container-low/50 opacity-75 cursor-pointer'
                    : 'bg-surface-container-low hover:bg-surface-container-lowest hover:scale-105'
              }`}
            >
              {/* Premium Badge */}
              {isPremium && !isLocked && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  PRO
                </div>
              )}
              
              {/* Lock Icon for Premium */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm rounded-lg z-10">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">lock</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">PRO</span>
                </div>
              )}
              
              {isSelected && !isLocked && (
                <div className="absolute -top-2 -right-2 bg-primary text-on-primary px-3 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-widest">
                  Activo
                </div>
              )}
              
              <div className="relative h-24 mb-4 flex items-center justify-center">
                <img
                  src={getAvatarUrl(tone.id)}
                  alt={tone.name}
                  className={`w-20 h-20 object-contain transform transition-transform duration-300 ${
                    isLocked ? '' : 'group-hover:-translate-y-1'
                  }`}
                />
              </div>
              
              <h3 className={`font-headline font-bold text-lg tracking-tight leading-none mb-1 ${
                isLocked ? 'text-on-surface-variant' : 'text-primary'
              }`}>
                {tone.name.toUpperCase()}
              </h3>
              <p className={`font-body italic text-xs ${
                isLocked ? 'text-on-surface-variant/50' : 'text-on-surface-variant'
              }`}>
                "{tone.tagline}"
              </p>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-on-surface-variant font-medium">Generando mensaje...</span>
        </div>
      )}
    </div>
  );
}
