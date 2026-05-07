export const AUTO_FRASES: Record<string, string[]> = {
  'Dia das Mães': [
    'Você é a razão de eu acreditar no amor incondicional.',
    'Cada abraço seu é um lar que carrego para onde vou.',
    'Mãe: a palavra mais bonita que minha boca já pronunciou.',
    'Você não me ensinou só a andar — me ensinou a voar.',
    'Obrigado por ser meu porto seguro em todas as tempestades.',
    'No seu colo aprendi que o mundo pode ser gentil.',
    'Cada sacrifício seu virou a minha maior força.',
  ],
  'Aniversário': [
    'Hoje o mundo ganhou sua melhor versão.',
    'Cada ano que passa só aumenta a admiração que tenho por você.',
    'Você envelhece como o vinho: só fica melhor.',
    'Feliz aniversário para quem faz todos os meus dias mais bonitos.',
    'Que este ano traga tudo o que você merece — e você merece muito.',
  ],
  'Natal': [
    'O melhor presente desta noite é estar com você.',
    'Que este Natal traga paz para o seu coração, que tanto merece.',
    'Em cada luz de Natal, vejo o brilho do seu sorriso.',
  ],
  'Dia das Mulheres': [
    'Você é a prova de que força e delicadeza podem coexistir.',
    'Mulher como você é rara. Eu tenho sorte de te ter.',
    'Você inspira sem perceber. Transforma sem querer.',
  ],
  'Só porque sim': [
    'Às vezes o amor não precisa de data para se manifestar.',
    'Só queria que você soubesse o quanto você é importante para mim.',
    'Pensei em você hoje e precisei te dizer: obrigado por existir.',
  ],
}

export function getFraseAleatoria(occasion: string): string {
  const frases = AUTO_FRASES[occasion] ?? AUTO_FRASES['Só porque sim']
  return frases[Math.floor(Math.random() * frases.length)]
}

export function getFrasesParaOcasiao(occasion: string): string[] {
  return AUTO_FRASES[occasion] ?? AUTO_FRASES['Só porque sim']
}
