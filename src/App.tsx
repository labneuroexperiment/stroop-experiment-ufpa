import React, { useState, useEffect, useRef } from 'react';
import {ChevronRight, CheckCircle, Download, AlertCircle} from 'lucide-react';

/* ===================== TIPOS ===================== */

interface TrialData {
  participantId: string;
  block: number;
  trialInBlock: number;
  globalTrial: number;
  x: number;
  word: string;
  color: string;
  congruent: boolean;
  response: boolean | null;
  reactionTime: number;
  accuracy: boolean;
  omitted: boolean;
  prevCongruent: boolean | null;
  prevResponse: boolean | null;
  prevAccuracy: boolean | null;
  repetitionWord: boolean;
  repetitionColor: boolean;
  timestamp: string;
}

interface StroopTrial {
  word: string;
  color: string;
  congruent: boolean;
}

/* ===================== CONFIGURAÇÃO ===================== */

const WORDS = ['VERMELHO', 'VERDE', 'AZUL'];
const COLORS = ['red', 'green', 'blue'];

const N_BLOCKS = 4;
const TRIALS_PER_BLOCK = 20;
const PRACTICE_TRIALS = 5;

const FIXATION_MS = 800;
const DEADLINE_MS = 2000;
const ITI_MIN = 700;
const ITI_MAX = 1300;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzauIcxpl6kTrcw8S9XHANbz9ZhqyN10Sw0QWyUEMS7yUD4AeQRmt71Mz67bz0itkvn/exec';
const TCLE_DOWNLOAD_URL = 'https://drive.google.com/file/d/1zEszA8NnJIb2HpCGp-Nhj9VB3kx-hUq9/view?usp=sharing';

/* ===================== APP ===================== */

const App: React.FC = () => {
  const [phase, setPhase] = useState<'welcome' | 'code' | 'consent' | 'instructions' | 'practice' | 'fixation' | 'experiment' | 'iti' | 'interblock' | 'finish'>('welcome');
  
  const [participantId, setParticipantId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [block, setBlock] = useState(0);
  const [trialInBlock, setTrialInBlock] = useState(0);
  const [globalTrial, setGlobalTrial] = useState(0);
  
  const [blocks, setBlocks] = useState<StroopTrial[][]>([]);
  const [practiceTrials, setPracticeTrials] = useState<StroopTrial[]>([]);
  const [data, setData] = useState<TrialData[]>([]);
  const [isPractice, setIsPractice] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  
  const onsetRef = useRef<number | null>(null);

  /* ===================== GERAÇÃO DE CÓDIGO ===================== */

  const generateParticipantId = (first: string, last: string): string => {
    const timestamp = Date.now().toString(36);
    const firstInitial = first.charAt(0).toUpperCase();
    const lastInitial = last.charAt(0).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${firstInitial}${lastInitial}-${timestamp}-${random}`;
  };

  /* ===================== GERAÇÃO DE TRIALS ===================== */

  const generateTrials = (n: number): StroopTrial[] => {
    const arr: StroopTrial[] = [];
    for (let i = 0; i < n; i++) {
      const congruent = Math.random() < 0.5;
      const w = Math.floor(Math.random() * WORDS.length);
      let c = Math.floor(Math.random() * COLORS.length);
      if (!congruent) {
        while (c === w) c = Math.floor(Math.random() * COLORS.length);
      }
      arr.push({ word: WORDS[w], color: COLORS[c], congruent });
    }
    return arr.sort(() => Math.random() - 0.5);
  };

  /* ===================== FLUXO - PRACTICE ===================== */

  useEffect(() => {
    if (phase === 'practice' && practiceTrials.length === 0) {
      setPracticeTrials(generateTrials(PRACTICE_TRIALS));
      setTrialInBlock(0);
      setIsPractice(true);
      setTimeout(() => setPhase('fixation'), 100);
    }
  }, [phase, practiceTrials.length]);

  /* ===================== FLUXO - EXPERIMENT ===================== */

  useEffect(() => {
    if (phase === 'experiment' && blocks.length === 0 && !isPractice) {
      const bs: StroopTrial[][] = [];
      for (let b = 0; b < N_BLOCKS; b++) {
        bs.push(generateTrials(TRIALS_PER_BLOCK));
      }
      setBlocks(bs);
      setBlock(0);
      setTrialInBlock(0);
      setGlobalTrial(0);
      setTimeout(() => setPhase('fixation'), 100);
    }
  }, [phase, blocks.length, isPractice]);

  /* ===================== FLUXO - FIXATION ===================== */

  useEffect(() => {
    if (phase === 'fixation') {
      const t = setTimeout(() => {
        onsetRef.current = performance.now();
        if (isPractice) {
          setPhase('practice');
        } else {
          setPhase('experiment');
        }
      }, FIXATION_MS);
      return () => clearTimeout(t);
    }
  }, [phase, isPractice]);

  /* ===================== FLUXO - DEADLINE ===================== */

  useEffect(() => {
    if (phase === 'experiment' || phase === 'practice') {
      const t = setTimeout(() => {
        if (onsetRef.current) {
          registerResponse(null);
        }
      }, DEADLINE_MS);
      return () => clearTimeout(t);
    }
  }, [phase, trialInBlock]);

  /* ===================== FLUXO - ITI ===================== */

  useEffect(() => {
    if (phase === 'iti') {
      const itiDuration = ITI_MIN + Math.random() * (ITI_MAX - ITI_MIN);
      const t = setTimeout(() => {
        advance();
      }, itiDuration);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* ===================== RESPOSTA ===================== */

  const registerResponse = (response: boolean | null) => {
    if (!onsetRef.current) return;

    const rt = performance.now() - onsetRef.current;
    onsetRef.current = null;

    if (isPractice) {
      setPhase('iti');
      return;
    }

    const trial = blocks[block][trialInBlock];
    const prev = data[data.length - 1];

    const accuracy = response !== null && response === trial.congruent;

    const record: TrialData = {
      participantId,
      block,
      trialInBlock,
      globalTrial,
      x: trialInBlock / (TRIALS_PER_BLOCK - 1),
      word: trial.word,
      color: trial.color,
      congruent: trial.congruent,
      response,
      reactionTime: rt,
      accuracy,
      omitted: response === null,
      prevCongruent: prev?.congruent ?? null,
      prevResponse: prev?.response ?? null,
      prevAccuracy: prev?.accuracy ?? null,
      repetitionWord: prev ? prev.word === trial.word : false,
      repetitionColor: prev ? prev.color === trial.color : false,
      timestamp: new Date().toISOString(),
    };

    setData(d => [...d, record]);
    setPhase('iti');
  };

  /* ===================== AVANÇAR ===================== */

  const advance = () => {
    if (isPractice) {
      if (trialInBlock + 1 < PRACTICE_TRIALS) {
        setTrialInBlock(t => t + 1);
        setPhase('fixation');
      } else {
        setIsPractice(false);
        setPhase('experiment');
      }
    } else {
      if (trialInBlock + 1 < TRIALS_PER_BLOCK) {
        setTrialInBlock(t => t + 1);
        setGlobalTrial(g => g + 1);
        setPhase('fixation');
      } else if (block + 1 < N_BLOCKS) {
        setBlock(b => b + 1);
        setTrialInBlock(0);
        setGlobalTrial(g => g + 1);
        setPhase('interblock');
      } else {
        setPhase('finish');
        sendData();
      }
    }
  };

  /* ===================== ENVIO DE DADOS ===================== */

  const sendData = async () => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, data }),
      });
      setDataSent(true);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      setDataSent(false);
    }
  };

  /* ===================== TECLADO ===================== */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'experiment' || phase === 'practice') {
        if (e.key === 'ArrowLeft') {
          registerResponse(false);
        } else if (e.key === 'ArrowRight') {
          registerResponse(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, block, trialInBlock, isPractice]);

  /* ===================== TRIAL ATUAL ===================== */

  const getCurrentTrial = (): StroopTrial | null => {
    if (phase === 'practice' && isPractice) {
      return practiceTrials[trialInBlock] || null;
    }
    if (phase === 'experiment' && !isPractice) {
      return blocks[block]?.[trialInBlock] || null;
    }
    return null;
  };

  const trial = getCurrentTrial();

  /* ===================== RENDER ===================== */

  if (phase === 'welcome') {
    return (
      <div className="screen">
        <div className="card">
          {/* ADICIONE A URL DA IMAGEM DO LOGO AQUI */}
          <img src="https://www.laps.ufpa.br/assets/img/laps_logo.png" alt="Logo LaPS" className="lab-logo" />
          <h1>Experimento Stroop</h1>
          <p className="subtitle">Dinâmica Contextual Sequencial</p>
          <p className="info">UFPA - ITEC - Laboratório de Processamento de Sinais (LaPS)</p>
          <button className="btn-primary" onClick={() => setPhase('code')}>
            Iniciar <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'code') {
    return (
      <div className="screen">
        <div className="card">
          <h2>Identificação do Participante</h2>
          <p className="info">Por favor, insira suas iniciais para gerar seu código anônimo:</p>
          <div className="form-group">
            <label>Primeiro Nome:</label>
            <input
              type="text"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: João"
              maxLength={20}
            />
          </div>
          <div className="form-group">
            <label>Sobrenome:</label>
            <input
              type="text"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Silva"
              maxLength={20}
            />
          </div>
          <button
            className="btn-primary"
            disabled={!firstName.trim() || !lastName.trim()}
            onClick={() => {
              const id = generateParticipantId(firstName, lastName);
              setParticipantId(id);
              setPhase('consent');
            }}
          >
            Gerar Código <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'consent') {
    return (
      <div className="screen">
        <div className="card card-large">
          <h2>Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
          <p><strong>Código do Participante:</strong> {participantId}</p>
          <div className="consent-content">
            <p><strong>Título do Estudo:</strong> Dinâmica Contextual em Tarefas de Stroop: Uma Investigação da Dependência Sequencial</p>
            <p><strong>Instituição:</strong> Universidade Federal do Pará (UFPA) - Instituto de Tecnologia (ITEC) - Laboratório de Processamento de Sinais (LaPS)</p>
            <p><strong>Objetivo:</strong> Investigar como o contexto sequencial e a dependência histórica influenciam o desempenho cognitivo em tarefas de conflito perceptual (experimento tipo Stroop).</p>
            <p><strong>Procedimento:</strong> Você verá palavras escritas em cores. Sua tarefa é indicar se a palavra e a cor são congruentes (coincidem) ou incongruentes (não coincidem), usando as teclas de seta ou botões na tela.</p>
            <p><strong>Duração:</strong> Aproximadamente 15-20 minutos.</p>
            <p><strong>Riscos e Desconfortos:</strong> Mínimos. Possível cansaço visual ou mental leve.</p>
            <p><strong>Benefícios:</strong> Contribuição para pesquisa científica em cognição e neurociência computacional.</p>
            <p><strong>Confidencialidade:</strong> Seus dados serão coletados de forma anônima. O código gerado não permite identificação pessoal.</p>
            <p><strong>Voluntariedade:</strong> Sua participação é totalmente voluntária. Você pode desistir a qualquer momento sem qualquer penalidade.</p>
            <p><strong>Contato:</strong> Para dúvidas, entre em contato com o LaPS/UFPA.</p>
            <p className="consent-declaration">Ao clicar em "Aceito Participar", você declara que leu e compreendeu este termo e concorda voluntariamente em participar deste estudo.</p>
          </div>
          <div className="button-group">
            <a href={TCLE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Download size={18} /> Baixar TCLE
            </a>
            <button className="btn-primary" onClick={() => setPhase('instructions')}>
              Aceito Participar <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'instructions') {
    return (
      <div className="screen">
        <div className="card card-scrollable">
          <h2>Instruções</h2>
          <p className="info">Você verá palavras de cores (VERMELHO, VERDE, AZUL) escritas em cores (vermelho, verde, azul).</p>
          <p className="info"><strong>Sua tarefa:</strong> Indicar se a palavra e a cor são <strong>CONGRUENTES</strong> ou <strong>INCONGRUENTES</strong>.</p>
          
          <div className="example-box">
            <p><strong>Exemplo CONGRUENTE:</strong></p>
            <p className="example-word" style={{ color: 'red' }}>VERMELHO</p>
            <p className="small-text">(palavra "VERMELHO" escrita em vermelho)</p>
          </div>

          <div className="example-box">
            <p><strong>Exemplo INCONGRUENTE:</strong></p>
            <p className="example-word" style={{ color: 'blue' }}>VERMELHO</p>
            <p className="small-text">(palavra "VERMELHO" escrita em azul)</p>
          </div>

          <div className="instructions-keys">
            <p><strong>Respostas:</strong></p>
            <div className="key-row">
              <div className="key-item">
                <span className="key">←</span>
                <span>INCONGRUENTE</span>
              </div>
              <div className="key-item">
                <span className="key">→</span>
                <span>CONGRUENTE</span>
              </div>
            </div>
            <p className="small-text">Você também pode usar os botões na tela</p>
          </div>

          <p className="info">Responda o mais rápido e preciso possível.</p>
          <p className="info">Primeiro, você fará um breve treino de {PRACTICE_TRIALS} tentativas.</p>

          <button className="btn-primary" onClick={() => setPhase('practice')}>
            Iniciar Treino <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'interblock') {
    return (
      <div className="screen">
        <div className="card">
          <h2>Pausa</h2>
          <p className="info">Você completou o bloco {block} de {N_BLOCKS}.</p>
          <p className="info">Descanse por um momento.</p>
          <p className="info">Clique abaixo quando estiver pronto para continuar.</p>
          <button className="btn-primary" onClick={() => setPhase('fixation')}>
            Continuar <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'fixation') {
    return (
      <div className="screen-dark">
        <div className="fixation">+</div>
      </div>
    );
  }

  if (phase === 'iti') {
    return <div className="screen-dark"></div>;
  }

  if ((phase === 'experiment' || phase === 'practice') && trial) {
    return (
      <div className="screen-dark">
        <div className="trial-container">
          <div className={`stroop-word color-${trial.color}`}>
            {trial.word}
          </div>
          <div className="response-buttons">
            <button
              className="response-btn"
              onClick={() => registerResponse(false)}
            >
              ← INCONGRUENTE
            </button>
            <button
              className="response-btn"
              onClick={() => registerResponse(true)}
            >
              CONGRUENTE →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'finish') {
    return (
      <div className="screen">
        <div className="card">
          {dataSent ? (
            <CheckCircle size={64} className="icon-success" />
          ) : (
            <AlertCircle size={64} className="icon-warning" />
          )}
          <h2>Experimento Concluído</h2>
          <p className="info">Obrigado pela sua participação!</p>
          <p className="info"><strong>Código do Participante:</strong> {participantId}</p>
          <p className="info">Total de tentativas: {data.length}</p>
          {dataSent ? (
            <p className="success-text">✓ Dados enviados com sucesso</p>
          ) : (
            <p className="warning-text">⚠ Verifique sua conexão. Os dados podem não ter sido enviados.</p>
          )}
          <div className="button-group">
            <a href={TCLE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Download size={18} /> Baixar TCLE
            </a>
            <button
              className="btn-secondary"
              onClick={() => {
                const dataStr = JSON.stringify(data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stroop-data-${participantId}.json`;
                a.click();
              }}
            >
              <Download size={18} /> Baixar Dados (JSON)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
