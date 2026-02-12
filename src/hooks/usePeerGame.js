import { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';

const usePeerGame = (gameId) => {
    const [peerId, setPeerId] = useState('');
    const [conn, setConn] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [gameState, setGameState] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, connecting, connected, error
    const peerRef = useRef(null);

    // Initialize peer
    useEffect(() => {
        return () => {
            if (peerRef.current) peerRef.current.destroy();
        };
    }, []);

    const hostGame = () => {
        setStatus('connecting');
        const id = `busemm-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const peer = new Peer(id);

        peer.on('open', (id) => {
            setPeerId(id.replace('busemm-', ''));
            setIsHost(true);
            setStatus('waiting');
        });

        peer.on('connection', (c) => {
            setConn(c);
            setStatus('connected');
            setupConnection(c);
        });

        peer.on('error', (err) => {
            console.error(err);
            setStatus('error');
        });

        peerRef.current = peer;
    };

    const joinGame = (remoteId) => {
        setStatus('connecting');
        const peer = new Peer();

        peer.on('open', () => {
            const conn = peer.connect(`busemm-${remoteId.toUpperCase()}`);
            setConn(conn);
            setupConnection(conn);
        });

        peer.on('error', (err) => {
            console.error(err);
            setStatus('error');
        });

        peerRef.current = peer;
    };

    const setupConnection = (c) => {
        c.on('open', () => {
            setStatus('connected');
        });
        c.on('data', (data) => {
            setGameState(data);
        });
        c.on('close', () => {
            setStatus('disconnected');
            setConn(null);
        });
    };

    const sendState = (newState) => {
        if (conn && conn.open) {
            conn.send(newState);
        }
        setGameState(newState);
    };

    return {
        hostGame,
        joinGame,
        peerId,
        status,
        isHost,
        gameState,
        sendState
    };
};

export default usePeerGame;
