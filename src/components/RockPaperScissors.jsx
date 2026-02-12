import React, { useState, useEffect } from 'react';
import usePeerGame from '../hooks/usePeerGame';

const RockPaperScissors = () => {
    const [localChoice, setLocalChoice] = useState(null);
    const [remoteChoice, setRemoteChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [gameMode, setGameMode] = useState('local');
    const [joinCodeInput, setJoinCodeInput] = useState('');
    const [score, setScore] = useState({ me: 0, them: 0 });

    const {
        hostGame,
        joinGame,
        peerId,
        status,
        isHost,
        gameState,
        sendState
    } = usePeerGame();

    useEffect(() => {
        if (status === 'connected') {
            setGameMode('playing-online');
        } else if (status === 'waiting') {
            setGameMode('hosting');
        }
    }, [status]);

    useEffect(() => {
        if (gameState) {
            if (gameState.type === 'choice') {
                setRemoteChoice('hidden');
                checkResult(localChoice, 'hidden');
            } else if (gameState.type === 'reveal') {
                setRemoteChoice(gameState.choice);
                checkResult(localChoice, gameState.choice);
            } else if (gameState.type === 'reset') {
                setLocalChoice(null);
                setRemoteChoice(null);
                setResult(null);
            }
        }
    }, [gameState]);

    const choices = [
        { id: 'rock', emoji: '✊', beats: 'scissors', label: 'TAŞ' },
        { id: 'paper', emoji: '✋', beats: 'rock', label: 'KAĞIT' },
        { id: 'scissors', emoji: '✌️', beats: 'paper', label: 'MAKAS' }
    ];

    const handleChoice = (choiceId) => {
        setLocalChoice(choiceId);
        if (gameMode === 'playing-online') {
            sendState({ type: 'choice' });
            sendState({ type: 'reveal', choice: choiceId });
        } else {
            const random = choices[Math.floor(Math.random() * 3)].id;
            setRemoteChoice(random);
            checkResult(choiceId, random);
        }
    };

    const checkResult = (myChoice, theirChoice) => {
        if (!myChoice || !theirChoice || theirChoice === 'hidden') return;

        if (myChoice === theirChoice) {
            setResult('draw');
        } else {
            const myMove = choices.find(c => c.id === myChoice);
            if (myMove.beats === theirChoice) {
                setResult('win');
                setScore(s => ({ ...s, me: s.me + 1 }));
            } else {
                setResult('lose');
                setScore(s => ({ ...s, them: s.them + 1 }));
            }
        }
    };

    const resetGame = () => {
        setLocalChoice(null);
        setRemoteChoice(null);
        setResult(null);
        if (gameMode === 'playing-online') {
            sendState({ type: 'reset' });
        }
    };

    const renderOnlineMenu = () => (
        <div className="online-menu fade-in">
            {gameMode === 'online-menu' && (
                <div className="menu-options">
                    <p className="menu-instruction">oda kur yada aşkına katıl</p>
                    <br />
                    <button className="cta-button primary big-btn" onClick={hostGame}>Oda Kur (Host)</button>
                    <br />
                    <br />
                    <div className="join-section">
                        <input
                            type="text"
                            placeholder="KODU GİR"
                            value={joinCodeInput}
                            onChange={(e) => setJoinCodeInput(e.target.value)}
                            className="code-input"
                        />
                        <button className="cta-button secondary big-btn" onClick={() => joinGame(joinCodeInput)}>Katıl</button>
                    </div>
                </div>
            )}

            {gameMode === 'hosting' && (
                <div className="hosting-info">
                    <p>Oda Kodun:</p>
                    <h3 className="room-code">{peerId}</h3>
                    <p className="loading-text">Bebişin bekleniyor...</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="glass-panel rps-container">
            <h2 className="game-title">TAŞ - KAĞIT - MAKAS</h2>

            {gameMode === 'local' && (
                <div className="local-intro">
                    <button className="cta-button primary wide-btn" onClick={() => setGameMode('online-menu')}>AŞKINLA OYNA</button>
                    <br />
                    <br />
                </div>
            )}

            {(gameMode === 'online-menu' || gameMode === 'hosting') ? (
                renderOnlineMenu()
            ) : (
                <div className="game-area">
                    <div className="score-board">
                        <div className="score-item">
                            <span className="sc-label">SEN</span>
                            <span className="sc-val">{score.me}</span>
                        </div>
                        <div className="score-divider">:</div>
                        <div className="score-item">
                            <span className="sc-label">{gameMode === 'local' ? 'PC' : 'AŞKIN'}</span>
                            <span className="sc-val">{score.them}</span>
                        </div>
                    </div>

                    <div className="hands-display">
                        <div className={`hand ${result ? (result === 'win' ? 'winner' : 'loser') : ''} ${!localChoice ? 'pulse' : ''}`}>
                            {localChoice ? choices.find(c => c.id === localChoice).emoji : '🤜'}
                        </div>
                        <div className="vs">VS</div>
                        <div className={`hand ${result ? (result === 'lose' ? 'winner' : 'loser') : ''} ${!remoteChoice ? 'pulse' : ''}`}>
                            {remoteChoice === 'hidden' ? '🤔' : (remoteChoice ? choices.find(c => c.id === remoteChoice).emoji : '🤛')}
                        </div>
                    </div>

                    {result && (
                        <div className="result-message fade-in">
                            {result === 'draw' && "BERABERE KALDINIZ! 😐"}
                            {result === 'win' && "KAZANDIN LAN HELAL! 🎉"}
                            {result === 'lose' && "YENİLDİN EZİK! 😢"}
                        </div>
                    )}

                    {!localChoice ? (
                        <div className="choices">
                            {choices.map(c => (
                                <button key={c.id} className="choice-btn" onClick={() => handleChoice(c.id)}>
                                    <span className="emoji">{c.emoji}</span>
                                    <span className="label">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button className="cta-button secondary wide-btn" onClick={resetGame}>TEKRAR OYNA</button>
                    )}
                </div>
            )}

            <style>{`
                .rps-container {
                    width: 100%;
                    text-align: center;
                    padding: 4rem;
                    min-height: 600px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .game-title {
                    font-family: 'Cinzel', serif;
                    font-size: 3rem;
                    color: var(--accent);
                    margin-bottom: 2rem;
                }
                .choice-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    min-width: 140px;
                }
                .choice-btn .emoji { font-size: 4rem; transition: transform 0.3s; }
                .choice-btn .label { font-size: 1.2rem; color: #fff; font-weight: bold; }
                
                .choice-btn:hover {
                    background: var(--primary);
                    transform: translateY(-10px);
                }
                .choice-btn:hover .emoji { transform: scale(1.2); }
                
                .choices {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 3rem;
                    flex-wrap: wrap;
                }
                .hands-display {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 4rem;
                    margin: 3rem 0;
                }
                .hand {
                    font-size: 8rem;
                    transition: all 0.5s;
                }
                .pulse { animation: pulseHand 1s infinite alternate; }
                @keyframes pulseHand { from { transform: scale(1); } to { transform: scale(1.1); } }
                
                .vs {
                    font-size: 3rem;
                    font-family: 'Cinzel', serif;
                    color: var(--primary);
                    font-weight: bold;
                }
                .score-board {
                    display: inline-flex;
                    align-items: center;
                    gap: 2rem;
                    background: rgba(0,0,0,0.4);
                    padding: 1rem 3rem;
                    border-radius: 50px;
                    border: 1px solid var(--accent);
                    margin-bottom: 2rem;
                }
                .score-item { display: flex; flex-direction: column; }
                .sc-label { font-size: 0.8rem; color: #aaa; letter-spacing: 2px; }
                .sc-val { font-size: 3rem; font-weight: bold; color: white; line-height: 1; }
                .score-divider { font-size: 3rem; color: var(--accent); margin-top: -10px; }
                
                .result-message {
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    color: var(--accent);
                    font-family: 'Playfair Display', serif;
                }
                .wide-btn {
                    padding: 1.2rem 3rem;
                    font-size: 1.2rem;
                }
            `}</style>
        </div>
    );
};

export default RockPaperScissors;
