import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { VocabEntry } from '../types/entry';
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
  const [tagsInput, setTagsInput] = useState((vocab.tags || []).join(', '));

  // Auto-save on form state change
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
      tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    updateEntry(updated);
  }, [word, partOfSpeech, meaning, synonyms, antonyms, examples, tagsInput]);

  const handleDelete = () => {
    // Permanent deletion per DECISIONS.md #5
    deleteEntry(vocab.id);
    onBack();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <span className="text-base font-semibold">‹</span>
          <span className="font-medium">All Vocabulary</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink-muted">Auto-saved lexicon card</span>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete Word Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Title */}
      <h1 className="text-3xl font-serif font-medium text-ink-primary">
        {word ? `Edit Word` : `Add Word to Lexicon`}
      </h1>

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* Word & Part of Speech */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
              Word
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. Eunoia"
              className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary font-serif text-lg shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
              Part of Speech
            </label>
            <input
              type="text"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              placeholder="e.g. noun, adjective"
              className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Meaning */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
            Meaning
          </label>
          <textarea
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            rows={3}
            placeholder="A pure and well-balanced mind; a good spirit."
            className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm leading-relaxed shadow-sm resize-y"
          />
        </div>

        {/* Synonyms */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
            Synonyms
          </label>
          <input
            type="text"
            value={synonyms}
            onChange={(e) => setSynonyms(e.target.value)}
            placeholder="Goodwill, benevolence, kindness"
            className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
          />
        </div>

        {/* Antonyms */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
            Antonyms
          </label>
          <input
            type="text"
            value={antonyms}
            onChange={(e) => setAntonyms(e.target.value)}
            placeholder="Malice, ill-will, kakoneia"
            className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
          />
        </div>

        {/* Example Sentence(s) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-primary">
            Example sentence(s)
          </label>
          <textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            rows={3}
            placeholder='"The speaker’s eunoia put the troubled audience at complete ease."'
            className="w-full px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm leading-relaxed shadow-sm resize-y"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2 pt-2 border-t border-ink-border">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
            Tags (Optional)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="philosophy, reflection"
            className="w-full px-4 py-2.5 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
