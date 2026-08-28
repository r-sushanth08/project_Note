import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { VocabEntry } from '../types/entry';
import { TagPillSelector } from '../components/TagPillSelector';
import { Trash2 } from 'lucide-react';

interface VocabEditorViewProps {
  vocab: VocabEntry;
  onBack: () => void;
}

export const VocabEditorView: React.FC<VocabEditorViewProps> = ({ vocab, onBack }) => {
  const { updateEntry, deleteEntry } = useEntries();

  const [word, setWord] = useState(vocab.word || '');
  const [partOfSpeech, setPartOfSpeech] = useState(vocab.partOfSpeech || '');
  const [meaning, setMeaning] = useState(vocab.meaning || '');
  const [synonyms, setSynonyms] = useState((vocab.synonyms || []).join(', '));
  const [antonyms, setAntonyms] = useState((vocab.antonyms || []).join(', '));
  const [examples, setExamples] = useState((vocab.examples || []).join('\n'));
  const [selectedTags, setSelectedTags] = useState<string[]>(vocab.tags || []);

  useEffect(() => {
    const updated: VocabEntry = {
      ...vocab,
      word,
      title: word || 'Untitled Word',
      partOfSpeech,
      meaning,
      synonyms: synonyms.split(',').map((s) => s.trim()).filter(Boolean),
      antonyms: antonyms.split(',').map((a) => a.trim()).filter(Boolean),
      examples: examples.split('\n').map((e) => e.trim()).filter(Boolean),
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
    };

    updateEntry(updated);
  }, [word, partOfSpeech, meaning, synonyms, antonyms, examples, selectedTags]);

  const handleDelete = () => {
    deleteEntry(vocab.id);
    onBack();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-44 flex flex-col gap-8 h-full overflow-y-auto no-scrollbar">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900/90 border border-white/25 text-white font-bold text-xl hover:border-orange-400 active:scale-95 transition-all shadow-md">
            ‹
          </span>
          <span className="font-semibold text-base">All Vocabulary</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Auto-saved lexicon card</span>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Delete Word Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Title */}
      <h1 className="text-3xl font-serif font-medium text-white flex-shrink-0">
        {word ? `Edit Word` : `Add Word to Lexicon`}
      </h1>

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* Word & Part of Speech */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
              Word
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. Eunoia"
              className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white font-serif text-lg shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
              Part of Speech
            </label>
            <input
              type="text"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              placeholder="e.g. noun, adjective"
              className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Meaning */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Meaning
          </label>
          <textarea
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            rows={3}
            placeholder="A pure and well-balanced mind; a good spirit."
            className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm leading-relaxed shadow-sm resize-y"
          />
        </div>

        {/* Synonyms */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Synonyms
          </label>
          <input
            type="text"
            value={synonyms}
            onChange={(e) => setSynonyms(e.target.value)}
            placeholder="Goodwill, benevolence, kindness"
            className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm shadow-sm"
          />
        </div>

        {/* Antonyms */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Antonyms
          </label>
          <input
            type="text"
            value={antonyms}
            onChange={(e) => setAntonyms(e.target.value)}
            placeholder="Malice, ill-will, kakoneia"
            className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm shadow-sm"
          />
        </div>

        {/* Example Sentence(s) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Example sentence(s)
          </label>
          <textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            rows={3}
            placeholder='"The speaker’s eunoia put the troubled audience at complete ease."'
            className="w-full px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm leading-relaxed shadow-sm resize-y"
          />
        </div>

        {/* Interactive Tag Pill Selector */}
        <TagPillSelector
          selectedTags={selectedTags}
          onTagsChange={(newTags) => setSelectedTags(newTags)}
        />
      </div>
    </div>
  );
};
