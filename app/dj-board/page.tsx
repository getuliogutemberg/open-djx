'use client';
import React, { useState } from 'react';
import YouTube from 'react-youtube'; // Adicionando tipagem para YouTube
import styles from './DJBoard.module.css';


const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  popularity: string;
}

interface YouTubeDataItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface YouTubeApiResponse {
  items: YouTubeDataItem[];
}

const DJBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [channelA, setChannelA] = useState<string | null>(null);
  const [channelB, setChannelB] = useState<string | null>(null);
  const [isPlayingA, setIsPlayingA] = useState<boolean>(false);
  const [isPlayingB, setIsPlayingB] = useState<boolean>(false);
  const [volumeA, setVolumeA] = useState<number>(50);
  const [volumeB, setVolumeB] = useState<number>(50);
  const [balance, setBalance] = useState<number>(50); // Controle de balanço entre os canais

  // Função para buscar vídeos do YouTube
  const handleSearch = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&type=video`
    );
    const data: YouTubeApiResponse = await response.json();

    const results: SearchResult[] = data.items && data.items.map((item: YouTubeDataItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      popularity: 'Popular', // Você pode adaptar essa parte para popularidade real
    }));

    setSearchResults(results);
  };

  // Função para tocar ou pausar música em um canal
  const handlePlayPause = (channel: 'A' | 'B') => {
    if (channel === 'A') {
      setIsPlayingA(!isPlayingA);
    } else {
      setIsPlayingB(!isPlayingB);
    }
  };

  // Função para liberar canal (livrar o canal para uma nova música)
  const handleReleaseChannel = (channel: 'A' | 'B') => {
    if (channel === 'A') {
      setChannelA(null);
      setIsPlayingA(false);
    } else {
      setChannelB(null);
      setIsPlayingB(false);
    }
  };

  // Função para selecionar uma música para tocar em um canal
  const handleSelectSong = (songId: string) => {
    if (!channelA) {
      setChannelA(songId);
      setIsPlayingA(true);
    } else if (!channelB) {
      setChannelB(songId);
      setIsPlayingB(true);
    }
    setSearchResults([]);
  };

  const [isActive, setIsActive] = useState(false);

  const handlePowerButtonClick = () => {
    // Ativa a animação do LED
    setIsActive(true);

    // Aguarde alguns milissegundos antes de realizar a ação
    setTimeout(() => {
      window.history.back(); // Executa a função de voltar
      setIsActive(false); // Remove a animação
    }, 1000); // Ajuste o tempo de acordo com a duração da animação
  };

  return (
    <div className={styles.container}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.searchBarContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar músicas ou vídeos..."
          className={styles.searchBar}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Buscar</button>
        </div>
        <button 
          className={`${styles.logoutButton} ${isActive ? 'ledOn' : ''}`} 
          onClick={handlePowerButtonClick}
        >
          X
        </button>
      </div>

      {/* Dropdown de resultados da busca */}
      {searchResults && searchResults.length > 0 && (
        <div className={styles.resultsDropdown}>
          {searchResults.map((result) => (
            <div key={result.id} className={styles.resultItem}>
                <img src={result.thumbnail} alt={result.title} className={styles.thumbnail} />
              <div className={styles.resultInfo}>
                <h4>{result.title}</h4>
                <h5>{result.popularity}</h5>
              </div>
              <button onClick={() => handleSelectSong(result.id)} className={styles.selectButton}>Selecionar</button>
            </div>
          ))}
        </div>
      )}

      {/* Área dos canais de música */}

      <div className='flex'>
      <div className={styles.djContainer}>
        
        {/* Canal A */}
        <div className={styles.channel}>
          <h2>{isPlayingA && 'Tocando...' }Canal A</h2>
          {channelA ? (
           
           <div 
           className={`${styles.vinyl} ${isPlayingA ? styles.spin : ''}`} 
           style={{ 
            
            border: '20px solid #111', 
            borderRadius: '50%',
            boxShadow: '0px 0px 40px rgba(0, 0, 0, 1)',
            backgroundColor: 'black',
            overflow: 'hidden', // Isso garante que o conteúdo interno não ultrapasse o limite do círculo
           
            aspectRatio: '1 / 1', // Ajusta a proporção da altura para a largura
          }}>
            <div className={`${styles.vinylAnimation}`} >
            <YouTube videoId={channelA} opts={{ playerVars: { autoplay: 1 } ,controls: 0, rel: 0, modestbranding: 1, autohide: 1 }} />
            </div>
          </div>
              
              
            ) : (
              <div className={`${styles.vinyl} ${isPlayingA ? styles.spin : ''}`} style={{ backgroundColor: '#333' ,border: '20px solid #111',boxShadow: '0px 0px 20px rgba(0, 0, 0, 1)',}} />
            )}
            <div className={styles.controls}>
              <button onClick={() => handlePlayPause('A')}>{isPlayingA ? 'Pause' : 'Play'}</button>
              <button onClick={() => handleReleaseChannel('A')}>Livrar Canal</button>
              <button>Stop</button>
            </div>
            <input
              className={styles.rangeInput}
              type="range"
              min="0"
              max="100"
              value={volumeA}
              onChange={(e) => setVolumeA(parseInt(e.target.value))}
            />
        </div>
        
        
        {/* Painel de controle de áudio */}
        <div className={styles.controlPanel}>
          <div className={styles.equalizer}>
          <div className={styles.equalizerContainer}>
          <h3>Equalização A</h3>
          <label>
            Graves:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            />
          </label>
          <label>
            Médios:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            />
          </label>
          <label>
            Agudos:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            />
          </label>
          </div>

          <div className={styles.equalizerContainer}>
          <h3>Equalização B</h3>
          <label>
            Graves:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            />
          </label>
          <label>
            Médios:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            />
          </label>
          <label>
            Agudos:
            <input 
            className={styles.rangeInput}
            type="range" 
            min="0" 
            max="100" 
            
            />
          </label>
          </div>
          </div>

         <div  style={{ width: '100%', marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginBottom: '20px'}} >
         <h3>Balanço entre canais</h3>
          <input
            className={styles.rangeInput}
            type="range"
            min="0"
            max="100"
            value={balance}
            onChange={(e) => setBalance(parseInt(e.target.value))}
           
            step="10" 
          />
         </div>
        </div>

        {/* Canal B */}
        <div className={styles.channel}>
          <h2>{isPlayingB && 'Tocando...' }Canal B</h2>
          {channelB ? (
           
           <div 
           className={`${styles.vinyl} ${isPlayingB ? styles.spin : ''}`} 
           style={{ 
            
            border: '20px solid #111', 
            borderRadius: '50%',
            boxShadow: '0px 0px 40px rgba(0, 0, 0, 1)',
            backgroundColor: 'black',
            overflow: 'hidden', // Isso garante que o conteúdo interno não ultrapasse o limite do círculo
           
            aspectRatio: '1 / 1', // Ajusta a proporção da altura para a largura
          }}>
            <div className={`${styles.vinylAnimation}`} >
            <YouTube videoId={channelB} opts={{ playerVars: { autoplay: 1 } ,controls: 0, rel: 0, modestbranding: 1, autohide: 1 }} />
            </div>
          </div>
              
              
            ) : (
              <div className={`${styles.vinyl} ${isPlayingB ? styles.spin : ''}`} style={{ backgroundColor: '#333' ,border: '20px solid #111',boxShadow: '0px 0px 20px rgba(0, 0, 0, 1)',}} />
            )}
            <div className={styles.controls}>
              <button onClick={() => handlePlayPause('B')}>{isPlayingB ? 'Pause' : 'Play'}</button>
              <button onClick={() => handleReleaseChannel('B')}>Livrar Canal</button>
              <button>Stop</button>
            </div>
            <input
              className={styles.rangeInput}
              type="range"
              min="0"
              max="100"
              value={volumeB}
              onChange={(e) => setVolumeB(parseInt(e.target.value))}
            />
        </div>

        </div>
      </div>
    </div>
  );
};

export default DJBoard;
