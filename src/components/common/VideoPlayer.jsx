// src/components/common/VideoPlayer.jsx
import React from 'react';

// Esta función para obtener la URL de embed ya es robusta, la mantenemos.
const getEmbedUrl = (url) => {
    // ... (la función getEmbedUrl que ya tienes)
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === "drive.google.com") {
        const pathParts = urlObj.pathname.split('/');
        const fileIdIndex = pathParts.findIndex(part => part === 'd');
        if (fileIdIndex !== -1 && pathParts[fileIdIndex + 1]) {
            return `https://drive.google.com/file/d/${pathParts[fileIdIndex + 1]}/preview`;
        }
        const fileId = urlObj.searchParams.get('id');
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        }
    } catch (error) {
        console.error("URL de Drive no válida:", error);
        return null;
    }
    return null;
};

const VideoPlayer = ({ videoUrl }) => {
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
            <h3 className="text-xl font-semibold">Video no disponible</h3>
            <p className="text-gray-400 mt-2">Puede que la URL no sea correcta o el video haya sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    // ESTE CONTENEDOR ES LA CLAVE. Es relativo y tiene un aspect-ratio.
    <div className="relative w-full h-0 bg-black" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
      <iframe
        src={embedUrl}
        // ESTAS CLASES SON LA SOLUCIÓN. Hacen que el iframe llene el contenedor.
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Google Drive Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;