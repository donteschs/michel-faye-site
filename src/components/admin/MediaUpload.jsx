import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Loader from '../ui/Loader';

export default function MediaUpload({ onImageUrl, onAudioUrl, imageUrl, audioUrl }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const imageRef = useRef(null);
  const audioRef = useRef(null);

  const upload = async (file, bucket, onSuccess, setUploading, setError) => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onSuccess(data.publicUrl);
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
      {/* Image upload */}
      <div>
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) upload(file, 'article-images', onImageUrl, setUploadingImage, setImageError);
            e.target.value = '';
          }}
        />
        {imageUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: '#2D6A2D', fontFamily: 'var(--ui)' }}>✓ Image ajoutée</span>
            <button
              type="button"
              onClick={() => onImageUrl(null)}
              aria-label="Supprimer l'image"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontFamily: 'var(--ui)', fontSize: 14, padding: '0 4px', minHeight: 32 }}
            >✕</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            disabled={uploadingImage}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 14px', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', cursor: uploadingImage ? 'not-allowed' : 'pointer', minHeight: 44 }}
          >
            {uploadingImage ? <Loader size={14} /> : '🖼'}
            Image
          </button>
        )}
        {imageError && <p style={{ fontSize: 12, color: 'var(--rose)', fontFamily: 'var(--ui)', marginTop: 4 }}>{imageError}</p>}
      </div>

      {/* Audio upload */}
      <div>
        <input
          ref={audioRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) upload(file, 'article-audio', onAudioUrl, setUploadingAudio, setAudioError);
            e.target.value = '';
          }}
        />
        {audioUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: '#2D6A2D', fontFamily: 'var(--ui)' }}>✓ Audio ajouté</span>
            <button
              type="button"
              onClick={() => onAudioUrl(null)}
              aria-label="Supprimer l'audio"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontFamily: 'var(--ui)', fontSize: 14, padding: '0 4px', minHeight: 32 }}
            >✕</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => audioRef.current?.click()}
            disabled={uploadingAudio}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 14px', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', cursor: uploadingAudio ? 'not-allowed' : 'pointer', minHeight: 44 }}
          >
            {uploadingAudio ? <Loader size={14} /> : '🎵'}
            Audio
          </button>
        )}
        {audioError && <p style={{ fontSize: 12, color: 'var(--rose)', fontFamily: 'var(--ui)', marginTop: 4 }}>{audioError}</p>}
      </div>
    </div>
  );
}
