import React, { useState, useEffect } from 'react';
import usePeerGame from '../hooks/usePeerGame';

const TicTacToeLove = () => {
    const [localBoard, setLocalBoard] = useState(Array(9).fill(null));
    const [localIsXNext, setLocalIsXNext] = useState(true);
    const [gameMode, setGameMode] = useState('local'); // local, online-menu, hosting, joining, playing-online
    const [joinCodeInput, setJoinCodeInput] = useState('');

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
        if (status === 'connected' && gameState) {
            setLocalBoard(gameState.board);
            setLocalIsXNext(gameState.isXNext);
            setGameMode('playing-online');
        } else if (status === 'waiting') {
            setGameMode('hosting');
        }
    }, [status, gameState]);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i) => {
        const winner = calculateWinner(localBoard);
        if (winner || localBoard[i]) return;

        if (gameMode === 'playing-online') {
            if (isHost && !localIsXNext) return;
            if (!isHost && localIsXNext) return;

            const newBoard = [...localBoard];
            newBoard[i] = localIsXNext ? '❤️' : '💋';

            setLocalBoard(newBoard);
            setLocalIsXNext(!localIsXNext);

            sendState({
                board: newBoard,
                isXNext: !localIsXNext
            });
        } else {
            const newBoard = [...localBoard];
            newBoard[i] = localIsXNext ? '❤️' : '💋';
            setLocalBoard(newBoard);
            setLocalIsXNext(!localIsXNext);
        }
    };

    const winner = calculateWinner(localBoard);
    const isDraw = !winner && !localBoard.includes(null);

    const resetGame = () => {
        const newBoard = Array(9).fill(null);
        const newIsXNext = true;

        if (gameMode === 'playing-online') {
            sendState({
                board: newBoard,
                isXNext: newIsXNext
            });
            setLocalBoard(newBoard);
            setLocalIsXNext(newIsXNext);
        } else {
            setLocalBoard(newBoard);
            setLocalIsXNext(newIsXNext);
        }
    };

    const renderOnlineMenu = () => (
        <div className="online-menu fade-in">
            {gameMode === 'online-menu' && (
                <div className="menu-options">
                    <button className="cta-button primary big-btn" onClick={hostGame}>Odayı Kur</button>
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
                    <button className="text-btn" onClick={() => setGameMode('local')}>Vazgeçtim Yerel Oynicam</button>
                </div>
            )}

            {gameMode === 'hosting' && (
                <div className="hosting-info">
                    <p>Aşkın için Oda Kodu:</p>
                    <h3 className="room-code">{peerId}</h3>
                    <p className="loading-text">Manitan Bekleniyor...</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="glass-panel tictactoe-container">
            <h2 className="game-title">XOX</h2>

            {gameMode === 'local' && (
                <button className="online-btn" onClick={() => setGameMode('online-menu')}>Aşkınla Beraber Oyna</button>
            )}

            {(gameMode === 'online-menu' || gameMode === 'hosting') ? (
                renderOnlineMenu()
            ) : (
                <>
                    <div className="status">
                        {winner
                            ? (winner === 'Draw' ? "ikimizde kazandıkkkkkk" : `KAZANAN: ${winner}`)
                            : `SIRA: ${localIsXNext ? 'SENDE' : 'RAKİPTE'} ${gameMode === 'playing-online' ? (isHost === localIsXNext ? '(Sen)' : '(O)') : ''}`}
                    </div>

                    <div className={`board ${gameMode === 'playing-online' && ((isHost && !localIsXNext) || (!isHost && localIsXNext)) ? 'disabled' : ''}`}>
                        {localBoard.map((square, i) => (
                            <button key={i} className="square" onClick={() => handleClick(i)}>
                                {square}
                            </button>
                        ))}
                    </div>

                    <button className="cta-button secondary wide-btn" onClick={resetGame}>
                        OYUNU SIFIRLA
                    </button>
                    {gameMode === 'playing-online' && <div className="connection-status">🟢 Sevgiline Bağlısın</div>}
                </>
            )}

            <style>{`
                .tictactoe-container {
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
                    text-transform: uppercase;
                }
                .board {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin: 2rem auto;
                    width: 100%;
                    max-width: 500px;
                }
                .board.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .square {
                    aspect-ratio: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid var(--primary);
                    color: #fff;
                    font-size: 4rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .square:hover {
                    background: var(--primary);
                    transform: scale(1.1);
                    z-index: 10;
                }
                .status {
                    font-size: 2rem;
                    margin-bottom: 2rem;
                    color: white;
                    font-family: 'Playfair Display', serif;
                    text-shadow: 0 0 10px rgba(255, 31, 61, 0.5);
                }
                .online-btn {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid var(--accent);
                    color: var(--accent);
                    padding: 0.8rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .online-btn:hover {
                    background: var(--accent);
                    color: black;
                }
                .wide-btn {
                    width: 100%;
                    max-width: 400px;
                    margin-top: 2rem;
                    padding: 1.5rem;
                }
                .code-input {
                    padding: 1.5rem;
                    border-radius: 10px;
                    border: 2px solid var(--accent);
                    background: rgba(0,0,0,0.5);
                    color: white;
                    text-align: center;
                    font-size: 1.5rem;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    width: 250px;
                    outline: none;
                }
                .code-input:focus {
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
                }
                .room-code {
                    font-size: 5rem;
                    color: var(--accent);
                    letter-spacing: 10px;
                    margin: 2rem 0;
                    text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
                }
                .join-section {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
            `}</style>
        </div>
    );
};

export default TicTacToeLove;
