import { characterCards } from './character-cards.js';

const STORAGE_KEY='living-table-library-v2';
const currentCharacters=characterCards.map(card=>({
  id:card.id,
  name:card.name,
  level:3,
  system:'D&D 5e 2014 / 2024',
  version:card.version,
  portrait:card.front.portrait,
  subtitle:card.front.subtitle,
  local:true
}));

try{
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(saved && typeof saved==='object'){
    saved.player={...(saved.player||{}),characters:currentCharacters};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
  }
}catch{
  // Library hub will fall back to its defaults if persisted JSON is invalid.
}
